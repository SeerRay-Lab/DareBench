#!/usr/bin/env python3
"""
Aggregate PinchBench parallel run results from a directory like logs/parallel_20260325_123544.

Each immediate subdirectory with results/*.json is treated as one model run.
If <model>/sessions/<task>_run_<run_id>-<k>.jsonl exists, the last valid JSON line is parsed:
when that record contains an ``errorMessage`` whose text matches HTTP 4xx/5xx (regex ``\\b[45]\\d{2}\\b``),
the task outcome is upgraded to ``error`` (unless already ``timeout`` from results JSON).

**Fair comparison**: task keys ``(task_id, run_occurrence_index)`` that appear in every loaded model
and where *no* model marks that key as ``error``; aggregates can be restricted to this subset so scores
are comparable across models (no penalty when another model's failure would drop a task).
"""

from __future__ import annotations

import argparse
import json
import re
import statistics
from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Set, Tuple

# HTTP client / gateway style codes in error text (400–599)
_HTTP_4XX_5XX = re.compile(r"\b[45]\d{2}\b")


def benchmark_slug_from_task_id(task_id: str) -> str:
    """task_gpqa_03 -> gpqa, task_terminalbench2_09 -> terminalbench2"""
    parts = task_id.split("_")
    if len(parts) < 3 or parts[0] != "task":
        return "unknown"
    if parts[-1].isdigit():
        return "_".join(parts[1:-1]) or "unknown"
    return "_".join(parts[1:])


TASK_GROUP_BY_BENCHMARK: Dict[str, str] = {
    # 文本 - 单步
    "logiqa": "文本 - 单步",
    "advancedif": "文本 - 单步",
    # 文本 - 多步
    "gpqa": "文本 - 多步",
    "longbench": "文本 - 多步",
    "bamboogle": "文本 - 多步",
    "simpleqa": "文本 - 多步",
    # 文本 - 多步 + 工具
    "deepsearchqa": "文本 - 多步 + 工具",
    "widesearch": "文本 - 多步 + 工具",
    "seal0": "文本 - 多步 + 工具",
    "terminalbench2": "文本 - 多步 + 工具",
    # 文本 + 图像 - 单步
    "charxiv": "文本 + 图像 - 单步",
    "simplevqa": "文本 + 图像 - 单步",
    # 文本 + 图像 - 多步
    "hle": "文本 + 图像 - 多步",
    # 文本 + 图像 - 多步 + 工具
    "osworld": "文本 + 图像 - 多步 + 工具",
}


def task_group_from_benchmark_slug(bench_slug: str) -> str:
    return TASK_GROUP_BY_BENCHMARK.get(bench_slug, f"未分组 - {bench_slug}")


def _collect_error_message_strings(obj: Any) -> List[str]:
    out: List[str] = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == "errorMessage" and isinstance(v, str) and v.strip():
                out.append(v)
            else:
                out.extend(_collect_error_message_strings(v))
    elif isinstance(obj, list):
        for x in obj:
            out.extend(_collect_error_message_strings(x))
    return out


def last_jsonl_record_has_http_4xx_5xx(session_path: Path) -> bool:
    """True if the last parseable JSONL object has any errorMessage matching 4xx/5xx."""
    if not session_path.is_file():
        return False
    try:
        lines = session_path.read_text(encoding="utf-8").splitlines()
    except OSError:
        return False
    for line in reversed(lines):
        line = line.strip()
        if not line:
            continue
        try:
            rec = json.loads(line)
        except json.JSONDecodeError:
            continue
        msgs = _collect_error_message_strings(rec)
        if not msgs:
            return False
        return any(_HTTP_4XX_5XX.search(m) for m in msgs)
    return False


def classify_outcome(status: str, timed_out: bool, session_http_4xx_5xx: bool) -> str:
    if timed_out or status == "timeout":
        return "timeout"
    if status == "error" or session_http_4xx_5xx:
        return "error"
    if status == "success":
        return "success"
    return "error"


def row_score(entry: Dict[str, Any], run_occurrence: int) -> float:
    g = entry.get("grading") or {}
    runs = g.get("runs") or []
    if run_occurrence < len(runs):
        return float(runs[run_occurrence].get("score") or 0.0)
    return float(g.get("mean") or 0.0)


def pick_results_json(results_dir: Path) -> Optional[Path]:
    if not results_dir.is_dir():
        return None
    jsons = sorted(results_dir.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True)
    return jsons[0] if jsons else None


def discover_model_dirs(parallel_root: Path) -> List[Tuple[str, Path]]:
    """Return [(display_name, model_dir), ...] sorted by name."""
    out: List[Tuple[str, Path]] = []
    if not parallel_root.is_dir():
        return out
    for child in sorted(parallel_root.iterdir()):
        if not child.is_dir():
            continue
        if child.name.startswith("."):
            continue
        if pick_results_json(child / "results"):
            out.append((child.name, child))
    return out


@dataclass
class RowMetrics:
    task_key: Tuple[str, int]  # (task_id, 0-based occurrence for runs_per_task)
    score: float
    full_mark: int  # 1 if score > 0.9 else 0
    time_s: float
    tokens: int
    outcome: str  # success | timeout | error
    benchmark: str
    task_group: str


@dataclass
class ModelRollup:
    model_label: str
    rows: List[RowMetrics] = field(default_factory=list)

    def extend(self, other_rows: Iterable[RowMetrics]) -> None:
        self.rows.extend(other_rows)


def load_model_metrics(model_dir: Path, data: Dict[str, Any]) -> List[RowMetrics]:
    run_id = str(data.get("run_id") or "")
    tasks = data.get("tasks") or []
    sessions_dir = model_dir / "sessions"

    per_task_occurrence: Dict[str, int] = defaultdict(int)
    rows: List[RowMetrics] = []

    for entry in tasks:
        task_id = entry.get("task_id") or ""
        occ = per_task_occurrence[task_id]
        per_task_occurrence[task_id] = occ + 1

        score = row_score(entry, occ)
        full_mark = 1 if score > 0.9 else 0
        time_s = float(entry.get("execution_time") or 0.0)
        usage = entry.get("usage") or {}
        tokens = int(usage.get("total_tokens") or 0)

        session_name = f"{task_id}_run_{run_id}-{occ + 1}.jsonl"
        session_path = sessions_dir / session_name
        session_http = last_jsonl_record_has_http_4xx_5xx(session_path)

        status = str(entry.get("status") or "unknown")
        timed_out = bool(entry.get("timed_out"))
        outcome = classify_outcome(status, timed_out, session_http)

        bench = benchmark_slug_from_task_id(task_id)
        task_group = task_group_from_benchmark_slug(bench)
        rows.append(
            RowMetrics(
                task_key=(task_id, occ),
                score=score,
                full_mark=full_mark,
                time_s=time_s,
                tokens=tokens,
                outcome=outcome,
                benchmark=bench,
                task_group=task_group,
            )
        )
    return rows


def compute_fair_task_keys(rollups: Dict[str, ModelRollup]) -> Set[Tuple[str, int]]:
    """Keys present in every model where no model has outcome == error for that key."""
    models = list(rollups.values())
    if not models:
        return set()
    key_sets: List[Set[Tuple[str, int]]] = []
    any_error: Set[Tuple[str, int]] = set()
    for m in models:
        ks: Set[Tuple[str, int]] = set()
        for row in m.rows:
            ks.add(row.task_key)
            if row.outcome == "error":
                any_error.add(row.task_key)
        key_sets.append(ks)
    inter = set.intersection(*key_sets) if key_sets else set()
    return inter - any_error


def aggregate_rows(rows: List[RowMetrics]) -> Dict[str, Any]:
    n = len(rows)
    if n == 0:
        return {
            "n": 0,
            "mean_score": 0.0,
            "full_rate": 0.0,
            "mean_time": 0.0,
            "total_tokens": 0,
            "mean_tokens": 0.0,
            "success": 0,
            "timeout": 0,
            "error": 0,
        }
    success = sum(1 for r in rows if r.outcome == "success")
    timeout = sum(1 for r in rows if r.outcome == "timeout")
    error = sum(1 for r in rows if r.outcome == "error")
    total_tokens = sum(r.tokens for r in rows)
    return {
        "n": n,
        "mean_score": statistics.mean(r.score for r in rows),
        "full_rate": statistics.mean(r.full_mark for r in rows) * 100.0,
        "mean_time": statistics.mean(r.time_s for r in rows),
        "total_tokens": total_tokens,
        "mean_tokens": total_tokens / n,
        "success": success,
        "timeout": timeout,
        "error": error,
    }


def format_table(headers: List[str], rows: List[List[str]], min_width: int = 8) -> str:
    cols = len(headers)
    str_rows = [[str(c) for c in row] for row in rows]
    widths = [min_width] * cols
    for i, h in enumerate(headers):
        widths[i] = max(widths[i], len(h))
    for row in str_rows:
        for i, cell in enumerate(row):
            widths[i] = max(widths[i], len(cell))
    sep = " | "
    div = "-+-".join("-" * w for w in widths)
    lines = [sep.join(h.ljust(widths[i]) for i, h in enumerate(headers))]
    lines.append(div)
    for row in str_rows:
        lines.append(sep.join(row[i].ljust(widths[i]) for i in range(cols)))
    return "\n".join(lines)


def build_overall_table(
    rollups: Dict[str, ModelRollup],
    fair_keys: Optional[Set[Tuple[str, int]]] = None,
) -> str:
    headers = [
        "Model",
        "Tasks",
        "Mean Score",
        "Full Rate %",
        "Mean Time (s)",
        "Total Tokens",
        "Mean Tokens",
        "Success",
        "Timeout",
        "Error",
    ]
    # Compute aggregates and sort by mean_score descending
    model_aggregates = []
    for name in rollups.keys():
        rows = rollups[name].rows
        if fair_keys is not None:
            rows = [r for r in rows if r.task_key in fair_keys]
        m = aggregate_rows(rows)
        model_aggregates.append((name, m))
    # Sort by mean_score descending
    model_aggregates.sort(key=lambda x: x[1]['mean_score'], reverse=True)
    
    body: List[List[str]] = []
    for name, m in model_aggregates:
        body.append(
            [
                name,
                str(m["n"]),
                f"{m['mean_score']:.4f}",
                f"{m['full_rate']:.2f}",
                f"{m['mean_time']:.2f}",
                str(m["total_tokens"]),
                f"{m['mean_tokens']:.1f}",
                str(m["success"]),
                str(m["timeout"]),
                str(m["error"]),
            ]
        )
    return format_table(headers, body)


def build_task_group_pivot(
    rollups: Dict[str, ModelRollup],
    fair_keys: Optional[Set[Tuple[str, int]]] = None,
) -> Tuple[List[str], List[str], Dict[str, Dict[str, Dict[str, Any]]]]:
    """task_group -> model -> aggregate dict"""
    groups: set[str] = set()
    for r in rollups.values():
        for row in r.rows:
            if fair_keys is not None and row.task_key not in fair_keys:
                continue
            groups.add(row.task_group)
    group_sorted = sorted(groups)

    pivot: Dict[str, Dict[str, Dict[str, Any]]] = {}
    for group in group_sorted:
        pivot[group] = {}
        for model_name, rollup in rollups.items():
            sub = [
                x
                for x in rollup.rows
                if x.task_group == group
                and (fair_keys is None or x.task_key in fair_keys)
            ]
            pivot[group][model_name] = aggregate_rows(sub)

    return group_sorted, sorted(rollups.keys()), pivot


def print_task_group_sections(
    rollups: Dict[str, ModelRollup],
    fair_keys: Optional[Set[Tuple[str, int]]] = None,
) -> str:
    group_sorted, model_names, pivot = build_task_group_pivot(rollups, fair_keys=fair_keys)
    chunks: List[str] = []
    for group in group_sorted:
        headers = [
            "Model",
            "Tasks",
            "Mean Score",
            "Full Rate %",
            "Mean Time (s)",
            "Total Tokens",
            "Mean Tokens",
            "Success",
            "Timeout",
            "Error",
        ]
        # Compute aggregates and sort by mean_score descending
        model_aggregates = []
        for mn in model_names:
            m = pivot[group][mn]
            if m["n"] == 0:
                continue
            model_aggregates.append((mn, m))
        # Sort by mean_score descending
        model_aggregates.sort(key=lambda x: x[1]['mean_score'], reverse=True)
        
        body: List[List[str]] = []
        for mn, m in model_aggregates:
            body.append(
                [
                    mn,
                    str(m["n"]),
                    f"{m['mean_score']:.4f}",
                    f"{m['full_rate']:.2f}",
                    f"{m['mean_time']:.2f}",
                    str(m["total_tokens"]),
                    f"{m['mean_tokens']:.1f}",
                    str(m["success"]),
                    str(m["timeout"]),
                    str(m["error"]),
                ]
            )
        if not body:
            continue
        chunks.append(f"\n### [{group}]")
        chunks.append(format_table(headers, body))
    return "\n".join(chunks)


def export_csv_overall(
    path: Path,
    rollups: Dict[str, ModelRollup],
    fair_keys: Optional[Set[Tuple[str, int]]] = None,
) -> None:
    import csv

    headers = [
        "model",
        "tasks",
        "full_rate_pct",
        "mean_score",
        "mean_time_s",
        "total_tokens",
        "mean_tokens",
        "success",
        "timeout",
        "error",
    ]
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(headers)
        for name in sorted(rollups.keys()):
            rows = rollups[name].rows
            if fair_keys is not None:
                rows = [r for r in rows if r.task_key in fair_keys]
            m = aggregate_rows(rows)
            w.writerow(
                [
                    name,
                    m["n"],
                    f"{m['full_rate']:.4f}",
                    f"{m['mean_score']:.6f}",
                    f"{m['mean_time']:.4f}",
                    m["total_tokens"],
                    f"{m['mean_tokens']:.4f}",
                    m["success"],
                    m["timeout"],
                    m["error"],
                ]
            )


def export_csv_by_benchmark(
    path: Path,
    rollups: Dict[str, ModelRollup],
    fair_keys: Optional[Set[Tuple[str, int]]] = None,
) -> None:
    import csv

    _, model_names, pivot = build_task_group_pivot(rollups, fair_keys=fair_keys)
    headers = [
        "task_group",
        "model",
        "tasks",
        "full_rate_pct",
        "mean_score",
        "mean_time_s",
        "total_tokens",
        "mean_tokens",
        "success",
        "timeout",
        "error",
    ]
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(headers)
        for group in sorted(pivot.keys()):
            for mn in model_names:
                m = pivot[group][mn]
                if m["n"] == 0:
                    continue
                w.writerow(
                    [
                        group,
                        mn,
                        m["n"],
                        f"{m['full_rate']:.4f}",
                        f"{m['mean_score']:.6f}",
                        f"{m['mean_time']:.4f}",
                        m["total_tokens"],
                        f"{m['mean_tokens']:.4f}",
                        m["success"],
                        m["timeout"],
                        m["error"],
                    ]
                )


def main() -> None:
    parser = argparse.ArgumentParser(description="Summarize parallel PinchBench logs under logs/parallel_*")
    parser.add_argument(
        "parallel_dir",
        type=str,
        help="Path to parallel run directory, e.g. logs/parallel_20260325_123544",
    )
    parser.add_argument(
        "--csv",
        type=str,
        default=None,
        help="Write overall summary CSV to this path",
    )
    parser.add_argument(
        "--csv-benchmark",
        type=str,
        default=None,
        help="Write per-benchmark long-form CSV to this path",
    )
    parser.add_argument(
        "--csv-fair",
        type=str,
        default=None,
        help="Write overall summary CSV using fair task subset only",
    )
    parser.add_argument(
        "--csv-benchmark-fair",
        type=str,
        default=None,
        help="Write per-benchmark CSV using fair task subset only",
    )
    parser.add_argument(
        "--no-full",
        action="store_true",
        help="Do not print full (all samples) tables after fair tables",
    )
    args = parser.parse_args()

    parallel_root = Path(args.parallel_dir).expanduser().resolve()
    discovered = discover_model_dirs(parallel_root)
    if not discovered:
        print(f"未找到含 results/*.json 的子目录: {parallel_root}")
        raise SystemExit(1)

    rollups: Dict[str, ModelRollup] = {}
    for name, model_dir in discovered:
        rj = pick_results_json(model_dir / "results")
        if rj is None:
            continue
        try:
            data = json.loads(rj.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError) as exc:
            print(f"跳过 {name}: 无法读取 {rj}: {exc}")
            continue
        rows = load_model_metrics(model_dir, data)
        rollups[name] = ModelRollup(model_label=name, rows=rows)
        print(f"加载 {name}: {rj.name} ({len(rows)} 条任务记录)")

    if not rollups:
        print("没有可用的结果文件。")
        raise SystemExit(1)

    fair_keys = compute_fair_task_keys(rollups)
    n_models = len(rollups)
    inter_n = (
        len(set.intersection(*[{r.task_key for r in m.rows} for m in rollups.values()]))
        if rollups
        else 0
    )
    print(
        f"\n公平子集: {len(fair_keys)} 个任务实例 (task_id + 轮次)，"
        f"要求已加载的 {n_models} 个模型均含该键且无一将该样本标为 error。"
        f"（各模型任务键交集大小: {inter_n}）"
    )

    print(f"\n{'=' * 80}")
    print(f"总表（公平子集）— {parallel_root.name}")
    print("=" * 80)
    print(build_overall_table(rollups, fair_keys=fair_keys))

    detail_fair = print_task_group_sections(rollups, fair_keys=fair_keys)
    if detail_fair.strip():
        print(f"\n{'=' * 80}")
        print("分任务大类细表（文本/图像 + 单步/多步/工具）— 公平子集")
        print("=" * 80)
        print(detail_fair)

    if not args.no_full:
        print(f"\n{'=' * 80}")
        print(f"总表（全量，含错误样本）— {parallel_root.name}")
        print("=" * 80)
        print(build_overall_table(rollups, fair_keys=None))

        detail_full = print_task_group_sections(rollups, fair_keys=None)
        if detail_full.strip():
            print(f"\n{'=' * 80}")
            print("分任务大类细表（文本/图像 + 单步/多步/工具）— 全量")
            print("=" * 80)
            print(detail_full)

    if args.csv:
        export_csv_overall(Path(args.csv).expanduser().resolve(), rollups, fair_keys=None)
        print(f"\n已写 overall CSV (全量): {args.csv}")
    if args.csv_benchmark:
        export_csv_by_benchmark(
            Path(args.csv_benchmark).expanduser().resolve(), rollups, fair_keys=None
        )
        print(f"已写 benchmark CSV (全量): {args.csv_benchmark}")
    if args.csv_fair:
        export_csv_overall(
            Path(args.csv_fair).expanduser().resolve(), rollups, fair_keys=fair_keys
        )
        print(f"已写 overall CSV (公平子集): {args.csv_fair}")
    if args.csv_benchmark_fair:
        export_csv_by_benchmark(
            Path(args.csv_benchmark_fair).expanduser().resolve(),
            rollups,
            fair_keys=fair_keys,
        )
        print(f"已写 benchmark CSV (公平子集): {args.csv_benchmark_fair}")


if __name__ == "__main__":
    main()
