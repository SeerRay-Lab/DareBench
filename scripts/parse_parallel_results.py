#!/usr/bin/env python3
"""
Parse PinchBench parallel run directories (per-model results/*.json) and emit Markdown tables only.

Usage:
  python scripts/parse_parallel_results.py logs/parallel_20260322_102903
  python scripts/parse_parallel_results.py logs/parallel_20260322_102903 -o logs/parallel_20260322_102903/REPORT.md

Does not generate narrative analysis — add that manually in REPORT.md if needed.
"""

from __future__ import annotations

import argparse
import json
import re
import statistics
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


TASK_ID_RE = re.compile(r"^task_(.+)_(\d+)$")


def parse_task_id(task_id: str) -> Tuple[str, int]:
    m = TASK_ID_RE.match(task_id)
    if not m:
        return ("unknown", -1)
    return m.group(1), int(m.group(2))


def fmt_num(x: Optional[float], digits: int = 2, empty: str = "—") -> str:
    if x is None:
        return empty
    if isinstance(x, float) and (x != x):  # nan
        return empty
    return f"{x:.{digits}f}"


def _is_perfect_score(score: float) -> bool:
    """0/1 metric: only exactly full credit (1.0) counts as 1."""
    return abs(float(score) - 1.0) < 1e-9


def load_runs(log_dir: Path) -> List[Dict[str, Any]]:
    runs: List[Dict[str, Any]] = []
    for path in sorted(log_dir.rglob("results/*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as e:
            runs.append({"_error": str(e), "_path": str(path)})
            continue
        data["_source_path"] = str(path)
        runs.append(data)
    return runs


def task_metrics(tasks: List[Dict[str, Any]]) -> Dict[str, Any]:
    scores: List[float] = []
    times: List[float] = []
    tokens_list: List[int] = []
    statuses = {"success": 0, "timeout": 0, "error": 0, "other": 0}
    for t in tasks:
        g = t.get("grading") or {}
        s = float(g.get("mean", 0.0))
        scores.append(s)
        times.append(float(t.get("execution_time") or 0.0))
        u = t.get("usage") or {}
        tt = int(u.get("total_tokens") or 0)
        tokens_list.append(tt)

        st = (t.get("status") or "").lower()
        if t.get("timed_out") or st == "timeout":
            statuses["timeout"] += 1
        elif st == "success":
            statuses["success"] += 1
        elif st == "error":
            statuses["error"] += 1
        else:
            statuses["other"] += 1

    n = len(scores)

    total_tok = sum(tokens_list)
    tasks_with_tok = sum(1 for x in tokens_list if x > 0)
    perfect_n = sum(1 for s in scores if _is_perfect_score(s))
    strict_rate = (perfect_n / n) if n else 0.0

    return {
        "n_tasks": n,
        "accuracy": statistics.mean(scores) if scores else 0.0,
        "perfect_n": perfect_n,
        "strict_rate": strict_rate,
        "avg_time_s": statistics.mean(times) if times else 0.0,
        "total_tokens": total_tok,
        "avg_tokens": (total_tok / n) if n else 0.0,
        "has_token_stats": tasks_with_tok > 0,
        "statuses": statuses,
    }


def metrics_for_subset(
    tasks: List[Dict[str, Any]], dataset: Optional[str] = None
) -> Dict[str, Any]:
    if dataset is None:
        return task_metrics(tasks)
    sub = [t for t in tasks if parse_task_id(t.get("task_id", ""))[0] == dataset]
    return task_metrics(sub)


def _fmt_strict(m: Dict[str, Any]) -> str:
    n = m["n_tasks"]
    k = m["perfect_n"]
    if n == 0:
        return "—"
    p = 100.0 * m["strict_rate"]
    return f"{k}/{n} ({p:.2f}%)"


def _row_cells(m: Dict[str, Any], include_model: str | None) -> str:
    tok_avg = fmt_num(m["avg_tokens"], 1) if m["has_token_stats"] else "—"
    tot_tok = m["total_tokens"] if m["total_tokens"] else "—"
    st = m["statuses"]
    status_str = f"{st['success']}/{st['timeout']}/{st['error']}"
    model_cell = f"`{include_model}` | " if include_model else ""
    return (
        f"| {model_cell}{m['n_tasks']} | {fmt_num(m['accuracy'], 4)} | {_fmt_strict(m)} | "
        f"{fmt_num(m['avg_time_s'], 2)} | {tot_tok} | {tok_avg} | {status_str} |\n"
    )


def build_markdown(log_dir: Path, runs: List[Dict[str, Any]]) -> str:
    lines: List[str] = []
    lines.append("# PinchBench 并行结果（表格）\n")
    lines.append(f"- **目录**: `{log_dir}`\n")
    lines.append(f"- **结果 JSON 数量**: {len(runs)}\n")
    lines.append(
        "- **满分率 (0/1)**：仅 `grading.mean == 1.0` 计为满分，否则记 0；格式 `满分题数/总题数 (占比%)`。\n"
    )
    lines.append(
        "- **均 tokens**：无有效 token 统计时（全 0）显示 **—**。\n"
    )

    valid = [r for r in runs if "tasks" in r and "_error" not in r]
    errored = [r for r in runs if "_error" in r]

    if errored:
        lines.append("\n## 无法解析的文件\n\n")
        for r in errored:
            lines.append(f"- `{r.get('_path', '?')}`: {r.get('_error', '')}\n")

    if not valid:
        lines.append("\n无有效 `results/*.json`。\n")
        return "".join(lines)

    all_datasets: set[str] = set()
    for r in valid:
        for t in r.get("tasks") or []:
            ds, _ = parse_task_id(t.get("task_id", ""))
            if ds != "unknown":
                all_datasets.add(ds)
    datasets_sorted = sorted(all_datasets)

    lines.append("\n## 1. 各模型总体\n\n")
    lines.append(
        "| 模型 | n | 平均分 | 满分率(0/1) | 均耗时(s) | 总tokens | 均tokens | 成功/超时/错误 |\n"
    )
    lines.append(
        "|------|---|--------|---------------|-----------|----------|----------|----------------|\n"
    )

    for r in valid:
        model = r.get("model", "?")
        tasks = r.get("tasks") or []
        m = metrics_for_subset(tasks)
        lines.append(_row_cells(m, model))

    lines.append("\n## 2. 各数据集 × 模型\n\n")
    for ds in datasets_sorted:
        lines.append(f"### `{ds}`\n\n")
        lines.append(
            "| 模型 | n | 平均分 | 满分率(0/1) | 均耗时(s) | 总tokens | 均tokens | 成功/超时/错误 |\n"
        )
        lines.append(
            "|------|---|--------|---------------|-----------|----------|----------|----------------|\n"
        )
        for r in valid:
            model = r.get("model", "?")
            tasks = r.get("tasks") or []
            m = metrics_for_subset(tasks, ds)
            if m["n_tasks"] == 0:
                continue
            lines.append(_row_cells(m, model))

        lines.append("\n")

    lines.append("\n---\n\n*表格由 `scripts/parse_parallel_results.py` 根据 `results/*.json` 生成。*\n")
    return "".join(lines)


def main() -> None:
    ap = argparse.ArgumentParser(description="Parse parallel benchmark JSON into Markdown tables")
    ap.add_argument("log_dir", type=Path)
    ap.add_argument("-o", "--output", type=Path, default=None)
    args = ap.parse_args()
    log_dir = args.log_dir.resolve()
    if not log_dir.is_dir():
        raise SystemExit(f"Not a directory: {log_dir}")

    runs = load_runs(log_dir)
    out = args.output or (log_dir / "REPORT.md")
    md = build_markdown(log_dir, runs)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(md, encoding="utf-8")
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
