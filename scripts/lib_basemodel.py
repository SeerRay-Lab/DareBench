"""
Direct base-model execution helpers for PinchBench.

This module bypasses OpenClaw agent/tool orchestration and calls an
OpenAI-compatible chat-completions endpoint directly.
"""

from __future__ import annotations

import base64
import json
import logging
import mimetypes
import os
import time
from pathlib import Path
from typing import Any, Dict, List, Tuple

from lib_agent import prepare_task_workspace
from lib_tasks import Task


logger = logging.getLogger(__name__)

MAX_TEXT_FILE_CHARS = int(os.environ.get("PINCHBENCH_BASEMODEL_MAX_FILE_CHARS", "120000"))
MAX_TOTAL_CONTEXT_CHARS = int(os.environ.get("PINCHBENCH_BASEMODEL_MAX_CONTEXT_CHARS", "500000"))
OPENCLAW_CONFIG_PATH = Path.home() / ".openclaw" / "openclaw.json"


def _split_provider_model(model_id: str) -> tuple[str | None, str]:
    if "/" not in model_id:
        return None, model_id
    provider, model = model_id.split("/", 1)
    return provider, model


def _load_openclaw_providers() -> Dict[str, Any]:
    if not OPENCLAW_CONFIG_PATH.exists():
        return {}
    try:
        payload = json.loads(OPENCLAW_CONFIG_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    return (
        payload.get("models", {})
        .get("providers", {})
    )


def _load_openclaw_profile_api_key(provider_name: str | None) -> str | None:
    """
    Load API key from OpenClaw auth profile storage.

    For built-in providers like openrouter, keys are stored in
    ~/.openclaw/agents/*/agent/auth-profiles.json instead of openclaw.json.
    """
    if not provider_name:
        return None
    openclaw_root = Path.home() / ".openclaw"
    profile_name = f"{provider_name}:default"
    candidates = [
        openclaw_root / "agents" / "main" / "agent" / "auth-profiles.json",
        # Fallback in case main agent is absent.
        openclaw_root / "agents",
    ]

    # 1) Prefer main agent profile store.
    main_profile = candidates[0]
    if main_profile.exists():
        try:
            payload = json.loads(main_profile.read_text(encoding="utf-8"))
            key = (
                payload.get("profiles", {})
                .get(profile_name, {})
                .get("key")
            )
            if isinstance(key, str) and key.strip():
                return key.strip()
        except (OSError, json.JSONDecodeError):
            pass

    # 2) Scan other agent profile stores.
    agents_dir = candidates[1]
    if agents_dir.exists() and agents_dir.is_dir():
        for p in agents_dir.glob("*/agent/auth-profiles.json"):
            try:
                payload = json.loads(p.read_text(encoding="utf-8"))
                key = (
                    payload.get("profiles", {})
                    .get(profile_name, {})
                    .get("key")
                )
                if isinstance(key, str) and key.strip():
                    return key.strip()
            except (OSError, json.JSONDecodeError):
                continue
    return None


def _resolve_model_connection(model_id: str) -> tuple[str, str, str, str]:
    """
    Resolve (model_name, base_url, api_key, api_type) for direct call.

    Priority:
    1) Env vars for base url / key
    2) openclaw.json provider config (for provider/model ids)
    3) defaults (openai base url; key required)
    """
    env_base_url = (
        os.environ.get("PINCHBENCH_BASEMODEL_BASE_URL")
        or os.environ.get("OPENAI_BASE_URL")
    )
    env_api_key = (
        os.environ.get("PINCHBENCH_BASEMODEL_API_KEY")
        or os.environ.get("OPENAI_API_KEY")
    )

    provider_name, model_name = _split_provider_model(model_id)
    provider_cfg: Dict[str, Any] = {}
    if provider_name:
        provider_cfg = _load_openclaw_providers().get(provider_name, {}) or {}

    provider_api_type = str(provider_cfg.get("api", "") or "openai-completions")
    if provider_api_type not in {"openai-completions", "anthropic-messages"}:
        raise RuntimeError(
            f"Provider '{provider_name}' uses unsupported api='{provider_api_type}'. "
            "Supported: openai-completions, anthropic-messages."
        )

    default_base_url = "https://api.openai.com/v1"
    if provider_name == "openrouter":
        default_base_url = "https://openrouter.ai/api/v1"
    base_url = (env_base_url or provider_cfg.get("baseUrl") or default_base_url).rstrip("/")
    api_key = (
        env_api_key
        or provider_cfg.get("apiKey")
        or _load_openclaw_profile_api_key(provider_name)
    )
    if not api_key:
        raise RuntimeError(
            "Missing API key. Set PINCHBENCH_BASEMODEL_API_KEY / OPENAI_API_KEY, "
            "or configure provider.apiKey in ~/.openclaw/openclaw.json, "
            "or authenticate provider profile in OpenClaw."
        )
    return model_name, base_url, str(api_key), provider_api_type


def _guess_is_text(path: Path) -> bool:
    mime, _ = mimetypes.guess_type(str(path))
    if mime is None:
        return False
    return mime.startswith("text/") or mime in {"application/json", "application/xml"}


def _read_text_limited(path: Path, limit_chars: int) -> str:
    text = path.read_text(encoding="utf-8", errors="replace")
    if len(text) <= limit_chars:
        return text
    return text[:limit_chars] + f"\n\n[TRUNCATED at {limit_chars} chars]"


def _append_file_content(
    *,
    content: List[Dict[str, Any]],
    display_path: str,
    file_bytes: bytes,
    mime: str,
    total_text_chars: int,
) -> int:
    if mime.startswith("text/") or mime in {"application/json", "application/xml"}:
        remaining = max(0, MAX_TOTAL_CONTEXT_CHARS - total_text_chars)
        if remaining <= 0:
            content.append(
                {
                    "type": "text",
                    "text": f"\n[File omitted due to context limit: {display_path}]",
                }
            )
            return total_text_chars
        per_file_limit = min(MAX_TEXT_FILE_CHARS, remaining)
        file_text = file_bytes.decode("utf-8", errors="replace")
        if len(file_text) > per_file_limit:
            file_text = file_text[:per_file_limit] + f"\n\n[TRUNCATED at {per_file_limit} chars]"
        content.append(
            {
                "type": "text",
                "text": f"\n## Workspace File: {display_path}\n{file_text}",
            }
        )
        return total_text_chars + len(file_text)

    if mime.startswith("image/"):
        data = base64.b64encode(file_bytes).decode("ascii")
        content.append(
            {
                "type": "text",
                "text": f"\n## Workspace Image: {display_path}",
            }
        )
        content.append(
            {
                "type": "image_url",
                "image_url": {"url": f"data:{mime};base64,{data}"},
            }
        )
        return total_text_chars

    content.append(
        {
            "type": "text",
            "text": f"\n[Skipped unsupported binary file: {display_path} ({mime})]",
        }
    )
    return total_text_chars


def _is_ground_truth_filename(display_path: str) -> bool:
    """Skip injecting files whose basename contains 'ground_truth' (case-insensitive)."""
    name = Path(display_path).name
    return "ground_truth" in name.lower()


def _build_user_content(task: Task, workspace: Path, skill_dir: Path) -> List[Dict[str, Any]]:
    content: List[Dict[str, Any]] = []
    content.append(
        {
            "type": "text",
            "text": (
                "You are solving a benchmark task in one shot. "
                "Use the provided prompt and files to answer.\n\n"
                "IMPORTANT OUTPUT RULES:\n"
                "1) Provide the final answer clearly.\n"
                "2) Include concise reasoning when requested.\n"
                "3) Do not call tools.\n\n"
                f"## Task Prompt\n{task.prompt}"
            ),
        }
    )

    # Prefer canonical task fixtures from assets/<source> so that prompt-building
    # is independent from transient workspace path state.
    total_text_chars = 0
    covered_dest_paths: set[str] = set()
    for file_spec in task.workspace_files:
        if "content" in file_spec:
            display_path = str(file_spec.get("path", "inline_content.txt"))
            if _is_ground_truth_filename(display_path):
                continue
            covered_dest_paths.add(display_path)
            raw = str(file_spec["content"]).encode("utf-8")
            total_text_chars = _append_file_content(
                content=content,
                display_path=display_path,
                file_bytes=raw,
                mime="text/plain",
                total_text_chars=total_text_chars,
            )
            continue

        source_rel = str(file_spec.get("source", ""))
        if not source_rel:
            continue
        display_path = str(file_spec.get("dest", source_rel))
        if _is_ground_truth_filename(display_path) or _is_ground_truth_filename(source_rel):
            continue
        covered_dest_paths.add(display_path)
        source_path = skill_dir / "assets" / source_rel
        if not source_path.exists():
            content.append(
                {
                    "type": "text",
                    "text": f"\n[Missing source fixture: assets/{source_rel}]",
                }
            )
            continue
        mime, _ = mimetypes.guess_type(str(source_path))
        mime = mime or "application/octet-stream"
        total_text_chars = _append_file_content(
            content=content,
            display_path=display_path,
            file_bytes=source_path.read_bytes(),
            mime=mime,
            total_text_chars=total_text_chars,
        )

    # Keep compatibility for any additional files that only exist in workspace.
    for path in sorted(workspace.rglob("*")):
        if not path.is_file():
            continue
        rel = str(path.relative_to(workspace))
        if _is_ground_truth_filename(rel):
            continue
        if rel in covered_dest_paths:
            continue
        mime, _ = mimetypes.guess_type(str(path))
        mime = mime or "application/octet-stream"
        total_text_chars = _append_file_content(
            content=content,
            display_path=rel,
            file_bytes=path.read_bytes(),
            mime=mime,
            total_text_chars=total_text_chars,
        )

    return content


def _extract_text_response(message_content: Any) -> str:
    if isinstance(message_content, str):
        return message_content.strip()
    if isinstance(message_content, list):
        chunks: List[str] = []
        for item in message_content:
            if isinstance(item, dict):
                item_type = str(item.get("type", "") or "")
                if item_type in {"text", "output_text"} and "text" in item:
                    chunks.append(str(item.get("text", "")))
                elif "text" in item:
                    # Some OpenAI-compatible providers return {"text": "..."}
                    # without a "type" field.
                    chunks.append(str(item.get("text", "")))
                elif "content" in item and isinstance(item.get("content"), str):
                    chunks.append(str(item.get("content", "")))
            elif isinstance(item, str):
                chunks.append(item)
        return "\n".join(x for x in chunks if x).strip()
    return str(message_content).strip()


def _extract_answer_from_response(response: Dict[str, Any]) -> str:
    """
    Extract assistant text from various OpenAI-compatible payload shapes.
    """
    # 1) Chat-completions standard shape
    choices = response.get("choices") or []
    if choices:
        first = choices[0] or {}
        message = first.get("message") or {}
        if isinstance(message, dict):
            answer = _extract_text_response(message.get("content", ""))
            if answer:
                return answer
            # Some providers expose refusal/reasoning as string fields.
            for key in ("refusal", "reasoning_content", "reasoning", "text"):
                val = message.get(key)
                if isinstance(val, str) and val.strip():
                    return val.strip()

        # 2) Legacy completions shape: choices[0].text
        choice_text = first.get("text")
        if isinstance(choice_text, str) and choice_text.strip():
            return choice_text.strip()

    # 3) Responses-style top-level output_text
    output_text = response.get("output_text")
    if isinstance(output_text, str) and output_text.strip():
        return output_text.strip()

    # 4) Generic fallback to avoid silent empty answers
    return ""


def _openai_usage_to_common(usage_payload: Any) -> Dict[str, Any]:
    usage_payload = usage_payload or {}
    if hasattr(usage_payload, "model_dump"):
        usage_payload = usage_payload.model_dump()
    return {
        "input_tokens": int(usage_payload.get("prompt_tokens", 0) or 0),
        "output_tokens": int(usage_payload.get("completion_tokens", 0) or 0),
        "total_tokens": int(usage_payload.get("total_tokens", 0) or 0),
        "cost_usd": float(usage_payload.get("cost_usd", 0.0) or 0.0),
        "request_count": 1,
    }


def _anthropic_usage_to_common(usage_payload: Any) -> Dict[str, Any]:
    usage_payload = usage_payload or {}
    if hasattr(usage_payload, "model_dump"):
        usage_payload = usage_payload.model_dump()
    input_tokens = int(usage_payload.get("input_tokens", 0) or 0)
    output_tokens = int(usage_payload.get("output_tokens", 0) or 0)
    return {
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "total_tokens": input_tokens + output_tokens,
        "cost_usd": 0.0,
        "request_count": 1,
    }


def _extract_data_url(url: str) -> Tuple[str, str]:
    # data:<mime>;base64,<payload>
    if not url.startswith("data:") or ";base64," not in url:
        raise ValueError("Unsupported image_url format for anthropic conversion")
    prefix, b64data = url.split(";base64,", 1)
    mime = prefix[len("data:") :]
    return mime, b64data


def _convert_openai_content_to_anthropic(openai_content: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for block in openai_content:
        block_type = block.get("type")
        if block_type == "text":
            out.append({"type": "text", "text": str(block.get("text", ""))})
        elif block_type == "image_url":
            image_url = block.get("image_url", {}) or {}
            url = str(image_url.get("url", ""))
            mime, data = _extract_data_url(url)
            out.append(
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": mime,
                        "data": data,
                    },
                }
            )
    return out


def _send_openai_request(
    *,
    model_name: str,
    base_url: str,
    api_key: str,
    user_content: List[Dict[str, Any]],
    system_prompt: str,
) -> tuple[Dict[str, Any], str, Dict[str, Any]]:
    from openai import OpenAI

    client = OpenAI(base_url=base_url, api_key=api_key)
    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content},
        ],
        temperature=0,
    )
    raw = response.model_dump() if hasattr(response, "model_dump") else dict(response)
    answer = _extract_answer_from_response(raw)
    usage = _openai_usage_to_common(raw.get("usage"))
    return raw, answer, usage


def _send_anthropic_request(
    *,
    model_name: str,
    base_url: str,
    api_key: str,
    user_content: List[Dict[str, Any]],
    system_prompt: str,
) -> tuple[Dict[str, Any], str, Dict[str, Any]]:
    from anthropic import Anthropic

    max_output_tokens = int(os.environ.get("PINCHBENCH_BASEMODEL_MAX_OUTPUT_TOKENS", "2048"))
    client = Anthropic(api_key=api_key, base_url=base_url)
    anthropic_content = _convert_openai_content_to_anthropic(user_content)
    response = client.messages.create(
        model=model_name,
        system=system_prompt,
        messages=[{"role": "user", "content": anthropic_content}],
        max_tokens=max_output_tokens,
        temperature=0,
    )
    raw = response.model_dump() if hasattr(response, "model_dump") else dict(response)
    # Anthropic content blocks: [{"type":"text","text":"..."}]
    answer = _extract_text_response(raw.get("content", []))
    usage = _anthropic_usage_to_common(raw.get("usage"))
    return raw, answer, usage


def _call_model_api(
    *,
    model_id: str,
    user_content: List[Dict[str, Any]],
    timeout_seconds: float,
) -> tuple[Dict[str, Any], str, Dict[str, Any]]:
    model_name, base_url, api_key, api_type = _resolve_model_connection(model_id)
    extra_system = os.environ.get("PINCHBENCH_BASEMODEL_SYSTEM_PROMPT", "").strip()
    system_prompt = (
        "You are a direct baseline model run for PinchBench. "
        "Return your best final answer using only the provided prompt and files."
    )
    if extra_system:
        system_prompt = f"{system_prompt}\n\n{extra_system}"
    if api_type == "openai-completions":
        return _send_openai_request(
            model_name=model_name,
            base_url=base_url,
            api_key=api_key,
            user_content=user_content,
            system_prompt=system_prompt,
        )
    if api_type == "anthropic-messages":
        return _send_anthropic_request(
            model_name=model_name,
            base_url=base_url,
            api_key=api_key,
            user_content=user_content,
            system_prompt=system_prompt,
        )
    raise RuntimeError(f"Unsupported provider api type: {api_type}")


def execute_basemodel_task(
    *,
    task: Task,
    agent_id: str,
    model_id: str,
    run_id: str,
    timeout_multiplier: float,
    skill_dir: Path,
    verbose: bool = False,
) -> Dict[str, Any]:
    logger.info("🤖 BaseModel [%s] starting task: %s", model_id, task.task_id)
    start_time = time.time()
    workspace = prepare_task_workspace(skill_dir, run_id, task, agent_id)
    timeout_seconds = task.timeout_seconds * timeout_multiplier

    stdout = ""
    stderr = ""
    exit_code = 0
    timed_out = False
    status = "success"
    usage: Dict[str, Any] = {}
    answer_text = ""

    user_content = _build_user_content(task, workspace, skill_dir)

    try:
        response, answer_text, usage = _call_model_api(
            model_id=model_id,
            user_content=user_content,
            timeout_seconds=timeout_seconds,
        )
        if verbose:
            logger.info(
                "   [VERBOSE] Raw model response JSON:\n%s",
                json.dumps(response, ensure_ascii=False, indent=2),
            )
        if not answer_text:
            # Keep this non-empty for debugging and grading visibility.
            response_preview = json.dumps(response, ensure_ascii=False)[:1200]
            stderr = (
                "Model response contained no extractable answer text. "
                f"Response preview: {response_preview}"
            )
    except Exception as exc:
        status = "error"
        exit_code = -1
        stderr = str(exc)
        answer_text = ""

    if answer_text:
        (workspace / "answer.txt").write_text(answer_text, encoding="utf-8")

    execution_time = time.time() - start_time
    if execution_time > timeout_seconds:
        timed_out = True
        status = "timeout"

    write_call_id = f"toolu_basemodel_write_{int(start_time * 1000)}"
    wrote_bytes = len(answer_text.encode("utf-8")) if answer_text else 0
    transcript = [
        {
            "type": "message",
            "message": {
                "role": "user",
                "content": [{"type": "text", "text": task.prompt}],
            },
        },
        {
            "type": "message",
            "message": {
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            "I will write the final response to answer.txt in the workspace."
                            if answer_text
                            else "I attempted to generate a response."
                        ),
                    },
                    {
                        "type": "toolCall",
                        "id": write_call_id,
                        "name": "write",
                        "arguments": {
                            "file_path": "answer.txt",
                            "content": answer_text,
                        },
                    },
                ],
            },
        },
        {
            "type": "message",
            "message": {
                "role": "toolResult",
                "toolCallId": write_call_id,
                "toolName": "write",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            f"Successfully wrote {wrote_bytes} bytes to answer.txt"
                            if answer_text
                            else "Failed to write answer.txt due to empty response"
                        ),
                    }
                ],
                "isError": not bool(answer_text),
            },
        },
    ]

    if verbose:
        logger.info("   [VERBOSE] BaseModel status: %s", status)
        logger.info("   [VERBOSE] Workspace: %s", workspace)
        logger.info("   [VERBOSE] Answer preview: %s", answer_text[:500])

    return {
        "agent_id": f"basemodel-{model_id}",
        "task_id": task.task_id,
        "status": status,
        "transcript": transcript,
        "usage": usage,
        "workspace": str(workspace),
        "exit_code": exit_code,
        "timed_out": timed_out,
        "execution_time": execution_time,
        "stdout": stdout,
        "stderr": stderr,
    }
