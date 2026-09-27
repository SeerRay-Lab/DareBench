#!/usr/bin/env python3
"""Paper-style DAREBench report from one or more harness result JSONs.

Prints the six workload-group accuracies (Text-SS/MS/MT, MM-SS/MS/MT), the task-count-weighted
Text/MM averages and the Overall accuracy over applicable tasks (paper Eq. 11-12, Table 1), plus
tokens per task (Eq. 13, Table 2) and cost per task, and a health summary of the run.

Usage:
  python3 tools/group_report.py RESULTS.json [MORE.json ...] [options]
  python3 tools/group_report.py path/to/results/            # every *.json in the directory

Several files for the same model are merged by task_id; a task that appears in a later file
(by the file's "timestamp") replaces the earlier entry (e.g. a 208-task run + a 25-task MM-MT run,
or a re-run of failed tasks). With --runs N, the task score is the mean over the N runs and
tokens/cost are averaged over the runs.

Options:
  --mapping table1|table9   How CharXiv and HLE are grouped (default: table1, see NOTE below).
  --text-only               Text-only model: score only the 162 text tasks (as in the paper), even if
                            the run also contains multimodal tasks. Overall then equals Text Avg.
  --sessions DIR            Session-backup dir(s) (*.jsonl) of the run(s), repeatable. Flags task-runs
                            whose transcript ends in a provider/API error (the harness scores them 0 and
                            still reports status=success) and reports thinking levels / models used.
  --tasks-dir DIR           Task directory used to list missing tasks (default: ../tasks next to this
                            script, if present).
  --expect-all              Treat all 233 tasks (162 with --text-only) as expected, e.g. when merging
                            partial runs; otherwise the expected set is the union of the requested suites.
  --print-rerun             Only print a comma-separated list of task ids to re-run (missing tasks and
                            infrastructure failures: status=error, empty transcript, API-error
                            transcript, no result from the judge), for `--suite`. Timeouts and low
                            scores are NOT re-run.
  --prices IN,OUT[,CR[,CW]] Model prices in USD per 1M tokens (paper Eq. 14, OpenRouter rates).
                            Missing cache-read/cache-write prices default to the input price.
  --name NAME               Row label for --markdown (default: the model id).
  --markdown                Also print a Markdown row in the column order of paper Table 1.
  --json                    Print the report as JSON instead of text.
  --by-source               Also print per-source-benchmark accuracies.

Re-runs: pass the original and the re-run results (and both session dirs); the later file wins per task.

NOTE on --mapping: paper Table 9 and the README put HLE in MM-SS and CharXiv in MM-MS, but the
MM-SS / MM-MS numbers in paper Table 1 (and the README leaderboard) were computed with CharXiv in
MM-SS and HLE in MM-MS (verified: this reproduces the archived runs' Table 1 values exactly). Both
groups keep 20 / 26 tasks, so Text Avg, MM Avg and Overall are identical under both mappings. Use
the default (table1) to compare against Table 1.
"""

from __future__ import annotations

import argparse
import collections
import json
import sys
from pathlib import Path

TEXT_GROUPS = ["Text-SS", "Text-MS", "Text-MT"]
MM_GROUPS = ["MM-SS", "MM-MS", "MM-MT"]
ALL_GROUPS = TEXT_GROUPS + MM_GROUPS
EXPECTED_N = {"Text-SS": 20, "Text-MS": 87, "Text-MT": 55, "MM-SS": 20, "MM-MS": 26, "MM-MT": 25}

_BASE = {
    "logiqa": "Text-SS", "gpqa": "Text-SS",
    "advancedif": "Text-MS", "bamboogle": "Text-MS", "simpleqa": "Text-MS", "longbench": "Text-MS",
    "lexeval": "Text-MS", "tablebench": "Text-MS", "finqa": "Text-MS",
    "deepsearchqa": "Text-MT", "widesearch": "Text-MT", "seal0": "Text-MT", "terminalbench2": "Text-MT",
    "openagentsafety": "Text-MT", "osworld": "Text-MT",
    "simplevqa": "MM-SS", "medxpertqa": "MM-MS",
    "agentvista": "MM-MT", "mmsearch": "MM-MT", "mmsearchplus": "MM-MT",
}
MAPPINGS = {
    "table1": dict(_BASE, charxiv="MM-SS", hle="MM-MS"),
    "table9": dict(_BASE, hle="MM-SS", charxiv="MM-MS"),
}


def source_of(task_id: str) -> str:
    # task_<source>_<NN>
    return task_id[len("task_"):].rsplit("_", 1)[0] if task_id.startswith("task_") else task_id


def tokens_of(usage: dict) -> float:
    if not usage:
        return 0.0
    if usage.get("total_tokens"):
        return float(usage["total_tokens"])
    return float(sum(usage.get(k, 0) or 0 for k in
                     ("input_tokens", "output_tokens", "cache_read_tokens", "cache_write_tokens")))


def price_cost(usage: dict, prices) -> float:
    p_in, p_out, p_cr, p_cw = prices
    return (
        (usage.get("input_tokens", 0) or 0) * p_in
        + (usage.get("output_tokens", 0) or 0) * p_out
        + (usage.get("cache_read_tokens", 0) or 0) * p_cr
        + (usage.get("cache_write_tokens", 0) or 0) * p_cw
    ) / 1e6


def load_results(paths):
    files = []
    for p in paths:
        p = Path(p)
        if p.is_dir():
            files.extend(sorted(p.glob("*.json")))
        else:
            files.append(p)
    if not files:
        sys.exit("no result JSON files found")
    docs = []
    for f in files:
        with open(f, encoding="utf-8") as fh:
            d = json.load(fh)
        if "tasks" not in d:
            print(f"skipping {f}: not a DAREBench result JSON", file=sys.stderr)
            continue
        d["_path"] = str(f)
        docs.append(d)
    if not docs:
        sys.exit("no DAREBench result JSON files found")
    docs.sort(key=lambda d: d.get("timestamp", 0))
    return docs


def scan_sessions(session_dirs):
    """Scan session backups (<task_id>_run_<run_id>-<k>.jsonl).

    Returns a list of dicts: name, task_id, run_id, api_error (or None), thinking levels, models.
    """
    files = [f for d in session_dirs for f in sorted(Path(d).glob("*.jsonl"))]
    out = []
    for f in files:
        last_err = None
        thinking, models = set(), set()
        for line in f.read_text(encoding="utf-8", errors="replace").splitlines():
            try:
                rec = json.loads(line)
            except json.JSONDecodeError:
                continue
            if not isinstance(rec, dict):
                continue
            if rec.get("type") == "thinking_level_change":
                thinking.add(str(rec.get("thinkingLevel")))
            elif rec.get("type") == "model_change":
                models.add(f"{rec.get('provider')}/{rec.get('modelId')}")
            msg = rec.get("message")
            if isinstance(msg, dict) and msg.get("role") == "assistant":
                if msg.get("stopReason") == "error" or msg.get("errorMessage"):
                    last_err = str(msg.get("errorMessage") or "stopReason=error")[:160]
                else:
                    last_err = None
        task_id, _, rest = f.stem.partition("_run_")
        out.append({"name": f.stem, "task_id": task_id, "run_id": rest.rsplit("-", 1)[0],
                    "api_error": last_err, "thinking": sorted(thinking), "models": sorted(models)})
    return out


AUTOMATED_NOTES = {"", "No automated grading code found", "Automated grading function missing"}


def judge_failed(run: dict, frontmatter: dict) -> bool:
    """True if an llm_judge/hybrid grading run got no usable result from the judge.

    The harness scores such runs 0 and logs nothing (judge API error, quota, timeout or an empty/
    unparseable reply): the judge part has no breakdown, no notes and contributes 0 to the score.
    A real judge verdict always has notes or criterion scores, or a non-zero total.
    """
    gt = run.get("grading_type")
    if gt not in ("llm_judge", "hybrid"):
        return False
    bd = run.get("breakdown") or {}
    notes = str(run.get("notes") or "")
    score = float(run.get("score") or 0.0)
    if "Grading failed:" in notes:                  # exception while grading
        return True
    if gt == "llm_judge":
        return not bd and not notes and score == 0.0
    # hybrid = weighted mean of the automated part and the judge part
    if any(k.startswith("llm_judge.") for k in bd) or notes not in AUTOMATED_NOTES:
        return False
    w = (frontmatter or {}).get("grading_weights") or {}
    try:
        aw, lw = float(w.get("automated", 0.5)), float(w.get("llm_judge", 0.5))
    except (TypeError, ValueError):
        aw, lw = 0.5, 0.5
    if aw + lw <= 0:
        aw = lw = 0.5
    if lw <= 0:
        return False
    auto = [float(v) for k, v in bd.items() if k.startswith("automated.") and isinstance(v, (int, float))]
    auto_score = sum(auto) / len(auto) if auto else 0.0
    return abs((score * (aw + lw) - auto_score * aw) / lw) < 1e-6


def build_report(docs, mapping_name, prices=None, session_dirs=(), text_only=False, tasks_dir=None,
                 expect_all=False):
    mapping = MAPPINGS[mapping_name]
    if text_only:
        mapping = {s: g for s, g in mapping.items() if g in TEXT_GROUPS}
    models = sorted({d.get("model", "?") for d in docs})
    tasks = {}      # task_id -> dict(score, tokens, cost, statuses, ...)
    replaced = []
    for d in docs:
        per_task = collections.defaultdict(list)
        for t in d["tasks"]:
            per_task[t["task_id"]].append(t)
        for tid, entries in per_task.items():
            if tid in tasks:
                replaced.append(tid)
            usages = [e.get("usage") or {} for e in entries]
            grading_runs = [r for e in entries[:1] for r in (e.get("grading") or {}).get("runs", [])]
            tasks[tid] = {
                "score": float(entries[0]["grading"]["mean"]),
                "runs": len(entries),
                "tokens": sum(tokens_of(u) for u in usages) / len(entries),
                "harness_cost": sum(float(u.get("cost_usd", 0) or 0) for u in usages) / len(entries),
                "price_cost": (sum(price_cost(u, prices) for u in usages) / len(entries)) if prices else None,
                "statuses": [e.get("status", "?") for e in entries],
                "empty_transcripts": sum(1 for e in entries if not e.get("transcript_length")),
                "no_usage": sum(1 for u in usages if not tokens_of(u)),
                "exec_time": sum(float(e.get("execution_time", 0) or 0) for e in entries) / len(entries),
                "grading_type": entries[0].get("grading", {}).get("runs", [{}])[0].get("grading_type", "?"),
                "judged_runs": sum(1 for r in grading_runs if r.get("grading_type") in ("llm_judge", "hybrid")),
                "judge_failed_runs": sum(1 for r in grading_runs
                                         if judge_failed(r, entries[0].get("frontmatter") or {})),
                "file": d["_path"],
                "run_id": d.get("run_id", ""),
            }

    unknown = sorted(t for t in tasks if source_of(t) not in MAPPINGS[mapping_name])
    ignored = sorted(t for t in tasks if source_of(t) in MAPPINGS[mapping_name] and source_of(t) not in mapping)
    groups = collections.defaultdict(list)
    for tid, rec in tasks.items():
        g = mapping.get(source_of(tid))
        if g:
            groups[g].append(tid)

    def agg(tids):
        n = len(tids)
        if n == 0:
            return None
        out = {
            "n": n,
            "acc": 100.0 * sum(tasks[t]["score"] for t in tids) / n,
            "tokens_per_task": sum(tasks[t]["tokens"] for t in tids) / n,
            "harness_cost_per_task": sum(tasks[t]["harness_cost"] for t in tids) / n,
        }
        if prices:
            out["price_cost_per_task"] = sum(tasks[t]["price_cost"] for t in tids) / n
        return out

    group_stats = {g: agg(groups.get(g, [])) for g in ALL_GROUPS}
    text_tids = [t for g in TEXT_GROUPS for t in groups.get(g, [])]
    mm_tids = [t for g in MM_GROUPS for t in groups.get(g, [])]
    all_tids = text_tids + mm_tids
    # Task-count-weighted averages == mean over the pooled tasks of those groups.
    summary = {"Text Avg": agg(text_tids), "MM Avg": agg(mm_tids), "Overall": agg(all_tids)}

    statuses = collections.Counter(s for t in tasks.values() for s in t["statuses"])
    health = {
        "tasks": len(tasks),
        "task_runs": sum(t["runs"] for t in tasks.values()),
        "status_counts": dict(statuses),
        "timeouts": sorted(t for t, r in tasks.items() if "timeout" in r["statuses"]),
        "errors": sorted(t for t, r in tasks.items() if "error" in r["statuses"]),
        "empty_transcripts": sorted(t for t, r in tasks.items() if r["empty_transcripts"]),
        "no_usage": sorted(t for t, r in tasks.items() if r["no_usage"]),
        "judged_task_runs": sum(r["judged_runs"] for r in tasks.values()),
        "judge_failure_runs": sum(r["judge_failed_runs"] for r in tasks.values()),
        "judge_failures": sorted(t for t, r in tasks.items() if r["judge_failed_runs"]),
        "incomplete_groups": {g: f"{(group_stats[g] or {}).get('n', 0)}/{EXPECTED_N[g]}"
                              for g in ALL_GROUPS
                              if group_stats[g] and group_stats[g]["n"] != EXPECTED_N[g]},
        "missing_groups": [g for g in (TEXT_GROUPS if text_only else ALL_GROUPS) if not group_stats[g]],
        "replaced_by_later_file": sorted(set(replaced)),
        "ignored_mm_tasks_text_only": ignored,
        "unknown_tasks": unknown,
        "total_tokens": sum(t["tokens"] * t["runs"] for t in tasks.values()),
        "total_harness_cost_usd": sum(t["harness_cost"] * t["runs"] for t in tasks.values()),
        "total_exec_time_s": sum(t["exec_time"] * t["runs"] for t in tasks.values()),
    }
    if prices:
        health["total_price_cost_usd"] = sum(t["price_cost"] * t["runs"] for t in tasks.values())
    session_dirs = [p for p in (session_dirs or []) if Path(p).is_dir()]
    if session_dirs:
        # only transcripts of the run that "won" for each task count
        recs = [r for r in scan_sessions(session_dirs)
                if r["task_id"] in tasks and r["run_id"] == tasks[r["task_id"]]["run_id"]]
        health["api_error_transcripts"] = {r["name"]: r["api_error"] for r in recs if r["api_error"]}
        health["thinking_levels"] = dict(collections.Counter(x for r in recs for x in r["thinking"]))
        health["models_in_transcripts"] = dict(collections.Counter(x for r in recs for x in r["models"]))
    # Expected tasks = the union of the suites that were requested ("all" = every task file),
    # or every applicable task with --expect-all (e.g. to complete a full run from partial chunks).
    tasks_dir = Path(tasks_dir) if tasks_dir else Path(__file__).resolve().parent.parent / "tasks"
    suites = [str(d.get("suite", "")) for d in docs]
    expected = set()
    if (expect_all or "all" in suites) and tasks_dir.is_dir():
        expected = {f.stem for f in tasks_dir.glob("task_*.md")}
    for su in suites:
        if su not in ("all", "automated-only"):
            expected |= {x.strip() for x in su.split(",") if x.strip()}
    health["missing_tasks"] = sorted(t for t in expected if t not in tasks and source_of(t) in mapping)
    api_tasks = {n.partition("_run_")[0] for n in health.get("api_error_transcripts", {})}
    rerun = (set(health.get("missing_tasks", [])) | set(health["errors"]) | set(health["empty_transcripts"])
             | api_tasks | set(health["judge_failures"]))
    health["rerun_suggested"] = sorted(t for t in rerun if source_of(t) in mapping)

    by_source = {}
    for tid in all_tids:
        by_source.setdefault(source_of(tid), []).append(tasks[tid]["score"])
    by_source = {s: {"n": len(v), "acc": 100.0 * sum(v) / len(v), "group": mapping[s]}
                 for s, v in sorted(by_source.items())}

    return {
        "models": models,
        "files": [d["_path"] for d in docs],
        "benchmark_versions": sorted({d.get("benchmark_version", "") for d in docs}),
        "executors": sorted({d.get("executor", "") for d in docs}),
        "runs_per_task": sorted({d.get("runs_per_task", 1) for d in docs}),
        "mapping": mapping_name,
        "text_only": text_only,
        "prices_per_1m": list(prices) if prices else None,
        "groups": group_stats,
        "summary": summary,
        "by_source": by_source,
        "health": health,
    }


def fmt_acc(s):
    return "—" if not s else f"{s['acc']:.1f}"


def fmt_tok(s):
    if not s:
        return "—"
    v = s["tokens_per_task"]
    return f"{v / 1000:.0f}k" if v >= 1000 else f"{v:.0f}"


def print_text(rep, by_source=False):
    h = rep["health"]
    print(f"DAREBench report  model(s): {', '.join(rep['models'])}")
    print(f"  files: {len(rep['files'])}  commit(s): {', '.join(v or '?' for v in rep['benchmark_versions'])}  "
          f"executor: {', '.join(rep['executors'])}  runs/task: {rep['runs_per_task']}  mapping: {rep['mapping']}"
          + ("  TEXT-ONLY (162 text tasks)" if rep["text_only"] else ""))
    print("  NOTE: primary-judge scores only (pre-audit); the paper's Table 1 is after the meta-judge audit.")
    print()
    cols = ALL_GROUPS[:3] + ["Text Avg"] + ALL_GROUPS[3:] + ["MM Avg", "Overall"]
    stats = dict(rep["groups"], **rep["summary"])
    w = 9
    print("Accuracy (%)".ljust(16) + "".join(c.rjust(w) for c in cols))
    print("  score".ljust(16) + "".join(fmt_acc(stats[c]).rjust(w) for c in cols))
    print("  n tasks".ljust(16) + "".join((str(stats[c]["n"]) if stats[c] else "0").rjust(w) for c in cols))
    print("  tokens/task".ljust(16) + "".join(fmt_tok(stats[c]).rjust(w) for c in cols))
    print("  cost/task $".ljust(16) + "".join(
        ("—" if not stats[c] else f"{stats[c]['harness_cost_per_task']:.3f}").rjust(w) for c in cols)
        + "   (OpenClaw-reported cost)")
    if rep["prices_per_1m"]:
        print("  cost/task $".ljust(16) + "".join(
            ("—" if not stats[c] else f"{stats[c]['price_cost_per_task']:.3f}").rjust(w) for c in cols)
            + f"   (--prices {','.join(str(p) for p in rep['prices_per_1m'])} per 1M)")
    if by_source:
        print()
        print("Per source benchmark:")
        for s, v in rep["by_source"].items():
            print(f"  {s:<16} {v['group']:<8} n={v['n']:<3} acc={v['acc']:.1f}")
    print()
    print("Run health:")
    print(f"  tasks={h['tasks']} task-runs={h['task_runs']} status={h['status_counts']}")
    print(f"  total tokens={h['total_tokens']:.0f}  OpenClaw-reported cost=${h['total_harness_cost_usd']:.4f}"
          + (f"  priced cost=${h['total_price_cost_usd']:.4f}" if "total_price_cost_usd" in h else "")
          + f"  agent wall time={h['total_exec_time_s'] / 3600:.2f} h")
    for key, label in [("timeouts", "timed out"), ("errors", "status=error"),
                       ("empty_transcripts", "EMPTY transcript"), ("no_usage", "no token usage"),
                       ("unknown_tasks", "unknown task ids"), ("replaced_by_later_file", "replaced by later file")]:
        if h[key]:
            print(f"  {label} ({len(h[key])}): {', '.join(h[key][:15])}{' ...' if len(h[key]) > 15 else ''}")
    if h["judge_failures"]:
        print(f"  no result from the judge, scored 0 ({h['judge_failure_runs']} of {h['judged_task_runs']} judged "
              f"task-runs): {', '.join(h['judge_failures'][:15])}{' ...' if len(h['judge_failures']) > 15 else ''}")
    if h["ignored_mm_tasks_text_only"]:
        print(f"  --text-only: ignored {len(h['ignored_mm_tasks_text_only'])} multimodal task(s) present in the results")
    if h.get("missing_tasks"):
        print(f"  missing tasks ({len(h['missing_tasks'])}): {', '.join(h['missing_tasks'][:10])}"
              f"{' ...' if len(h['missing_tasks']) > 10 else ''}")
    if h["missing_groups"]:
        print(f"  WARNING groups with no results: {h['missing_groups']}"
              + ("" if rep["text_only"] else "  (text-only model? use --text-only)"))
    if h["incomplete_groups"]:
        print(f"  WARNING incomplete groups (have/expected): {h['incomplete_groups']}")
    if "thinking_levels" in h:
        print(f"  thinking level(s) in transcripts: {h['thinking_levels']}   model(s): {h['models_in_transcripts']}")
    if "api_error_transcripts" in h:
        errs = h["api_error_transcripts"]
        print(f"  transcripts ending in an API error: {len(errs)}")
        for tid, msg in list(errs.items())[:15]:
            print(f"    {tid}: {msg}")
    if h["rerun_suggested"]:
        print(f"  re-run candidates (infrastructure failures/missing tasks, {len(h['rerun_suggested'])}): "
              f"python3 tools/group_report.py <results...> --sessions <dir> --print-rerun")
        print("    (the paper kept such failures as 0; re-run only after exit code 4 or with the human's "
              "approval, see RUN_NEW_MODELS.md section 7.2)")


def print_markdown(rep, name):
    stats = dict(rep["groups"], **rep["summary"])
    cols = ALL_GROUPS[:3] + ["Text Avg"] + ALL_GROUPS[3:] + ["MM Avg"]
    print()
    print("| Model | Text-SS | Text-MS | Text-MT | Text Avg | MM-SS | MM-MS | MM-MT | MM Avg |")
    print("| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |")
    print("| " + name + " | " + " | ".join(fmt_acc(stats[c]) for c in cols) + " |")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("results", nargs="+")
    ap.add_argument("--mapping", choices=sorted(MAPPINGS), default="table1")
    ap.add_argument("--text-only", action="store_true")
    ap.add_argument("--sessions", action="append", default=[])
    ap.add_argument("--tasks-dir")
    ap.add_argument("--print-rerun", action="store_true")
    ap.add_argument("--expect-all", action="store_true")
    ap.add_argument("--prices")
    ap.add_argument("--name")
    ap.add_argument("--markdown", action="store_true")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--by-source", action="store_true")
    a = ap.parse_args()
    prices = None
    if a.prices:
        vals = [float(x) for x in a.prices.split(",")]
        if not 2 <= len(vals) <= 4:
            ap.error("--prices needs IN,OUT[,CACHE_READ[,CACHE_WRITE]]")
        while len(vals) < 4:
            vals.append(vals[0])
        prices = tuple(vals)
    rep = build_report(load_results(a.results), a.mapping, prices, a.sessions, a.text_only, a.tasks_dir,
                       a.expect_all)
    if a.print_rerun:
        print(",".join(rep["health"]["rerun_suggested"]))
        return
    if len(rep["models"]) > 1:
        print(f"WARNING: results from several models are merged: {rep['models']}", file=sys.stderr)
    if a.json:
        print(json.dumps(rep, indent=2))
        return
    print_text(rep, by_source=a.by_source)
    if a.markdown:
        print_markdown(rep, a.name or rep["models"][0])


if __name__ == "__main__":
    main()
