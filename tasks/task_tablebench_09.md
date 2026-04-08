---
id: task_tablebench_09
name: TableBench DP — NumericalReasoning / Time-basedCalculation
category: tablebench
grading_type: automated
timeout_seconds: 480
workspace_files: []
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

~~~text
You are a table analyst. Your task is to answer questions based on the table content.


The answer should follow the format below:
[Answer Format]
Final Answer: AnswerName1, AnswerName2...

Ensure the final answer format is the last output line and can only be in the "Final Answer: AnswerName1, AnswerName2..." form, no other form. Ensure the "AnswerName" is a number or entity name, as short as possible, without any explanation.


Give the final answer to the question directly without any explanation.

Read the table below in JSON format:
[TABLE] 
{'columns': ['year', 'births (000s)', 'deaths', 'natural growth', 'total fertility rate'], 'data': [['1990', 0.7, 0.4, 0.3, '1.58'], ['1991', 2.4, 1.85, 0.55, '1.31'], ['1992', 3.4, 2.7, 0.7, '1.33'], ['1993', 4.6, 3.3, 1.3, '1.52'], ['1994', 5.8, 4.0, 1.8, '1.65'], ['1995', 6.75, 4.6, 2.15, '1.72'], ['1996', 7.5, 5.0, 2.5, '1.70'], ['1997', 8.2, 5.4, 2.8, '1.71'], ['1998', 8.9, 5.9, 3.0, '1.71'], ['1999', 9.3, 6.3, 3.0, '1.63'], ['2000', 10.1, 6.7, 3.4, '1.62'], ['2001', 10.3, 6.9, 3.4, '1.56'], ['2002', 10.6, 7.2, 3.4, '1.55'], ['2003', 11.1, 7.25, 3.85, '1.60'], ['2004', 10.9, 7.4, 3.5, '1.55'], ['2005', 11.0, 7.6, 3.4, '1.55'], ['2006', 11.2, 7.6, 3.6, 'na'], ['2007', 10.3, 7.8, 2.5, 'na'], ['2008', 11.6, 7.8, 3.8, 'na'], ['2009', 11.7, 7.6, 4.1, 'na'], ['1990 - 2009', 166.4, 113.3, 53.1, 'na']]}

Let's get start!
Question: In which year was the natural growth rate significantly different from the average natural growth rate between 1990 and 2000?

~~~


**Output format:** Write your **entire** answer to `answer.txt` in the workspace. Keep the same answer format as in the instruction above (including the final line `Final Answer: ...` where applicable).

## Expected Behavior

The agent should follow the TableBench DP instruction. It must write the required output to `answer.txt` in the workspace so automated grading can parse it. The file should contain a line matching `Final Answer: ...` as required by the instruction.

## Grading Criteria

- [ ] answer_written: `answer.txt` exists and is non-empty
- [ ] tablebench_aligned: Score matches TableBench-style metric for this `qtype`/`qsubtype` (EM, EM_with_error_10, or ROUGE-L)

## Automated Checks

```python
import re
import string
import sys
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
from typing import List


def _normalize_answer(s: str) -> str:
    def remove_articles(text):
        return re.sub(r"\b(a|an|the)\b", " ", text)

    def white_space_fix(text):
        return " ".join(text.split())

    def remove_punc(text):
        exclude = set(string.punctuation)
        return "".join(ch for ch in text if ch not in exclude)

    def lower(text):
        return text.lower()

    return white_space_fix(remove_articles(remove_punc(lower(s))))


def _parse_final_answer(prediction: str) -> str:
    if not prediction or not prediction.strip():
        return ""
    m = re.search(r"Final Answer:\s*(.+)", prediction, flags=re.IGNORECASE | re.DOTALL)
    if not m:
        return ""
    return m.group(1).strip().splitlines()[0].strip()


def _normalize_number(value: str) -> Decimal:
    if value.endswith("%"):
        value = value.strip("%")
        decimal_value = Decimal(value) / Decimal("100")
        return decimal_value.quantize(Decimal("1.0000"), rounding=ROUND_HALF_UP)
    return Decimal(value)


def _get_decimal_precision(values: List[str]) -> int:
    precisions = []
    for val in values:
        if val.endswith("%"):
            continue
        if "." in val:
            precisions.append(len(val.split(".")[-1]))
        else:
            precisions.append(0)
    return min(precisions) if precisions else 0


def _round_decimal(value: Decimal, precision: int) -> str:
    rounding_format = f'1.{"0" * precision}'
    return str(value.quantize(Decimal(rounding_format), rounding=ROUND_HALF_UP))


def _is_number(val: str) -> bool:
    val = val.strip()
    return bool(re.match(r"^-?\d+(\.\d+)?%?$", val))


def _compute_em(references: List[str], predictions: List[str]) -> float:
    total_score = 0.0
    total_count = 0
    for pred, ref in zip(predictions, references):
        ref_answers = [x.strip() for x in ref.split(",")]
        pred_answers = [x.strip() for x in pred.split(",")]
        match_score = 0.0
        weight = 1.0 / len(ref_answers)
        for i, r in enumerate(ref_answers):
            if i >= len(pred_answers):
                continue
            p = pred_answers[i]
            if _is_number(r):
                try:
                    if r.endswith("%"):
                        norm_r = _normalize_number(r)
                        norm_p = _normalize_number(p)
                        if norm_r == norm_p:
                            match_score += weight
                    else:
                        ref_vals = [x for x in ref_answers if _is_number(x) and not x.endswith("%")]
                        precision = _get_decimal_precision(ref_vals)
                        norm_r = _round_decimal(_normalize_number(r), precision)
                        norm_p = _round_decimal(_normalize_number(p), precision)
                        if norm_r == norm_p:
                            match_score += weight
                except Exception:
                    continue
            else:
                if r == p:
                    match_score += weight
        total_score += match_score
        total_count += 1
    return total_score / total_count if total_count else 0.0


def _compute_em_with_tolerance(
    references: List[str], predictions: List[str], error_range: float
) -> float:
    total_score = 0.0
    total_count = 0
    for pred, ref in zip(predictions, references):
        ref_answers = [x.strip() for x in ref.split(",")]
        pred_answers = [x.strip() for x in pred.split(",")]
        match_score = 0.0
        weight = 1.0 / len(ref_answers)
        for i, r in enumerate(ref_answers):
            if i >= len(pred_answers):
                continue
            p = pred_answers[i]
            if _is_number(r):
                try:
                    val_r = _normalize_number(r)
                    val_p = _normalize_number(p)
                    if val_r == Decimal("0"):
                        if val_p == val_r:
                            match_score += weight
                    else:
                        error = abs(val_r - val_p) / abs(val_r)
                        if error <= error_range / 100:
                            match_score += weight
                except Exception:
                    continue
            else:
                if r == p:
                    match_score += weight
        total_score += match_score
        total_count += 1
    return total_score / total_count if total_count else 0.0


def _lcs_len(a: List[str], b: List[str]) -> int:
    na, nb = len(a), len(b)
    dp = [[0] * (nb + 1) for _ in range(na + 1)]
    for i in range(na):
        for j in range(nb):
            if a[i] == b[j]:
                dp[i + 1][j + 1] = dp[i][j] + 1
            else:
                dp[i + 1][j + 1] = max(dp[i][j + 1], dp[i + 1][j])
    return dp[na][nb]


def _rouge_l_f1_0_100(ref: str, pred: str) -> float:
    """ROUGE-L style F1 on words (LCS-based; stdlib only)."""
    rw = ref.split()
    pw = pred.split()
    if not rw or not pw:
        return 0.0
    lcs = _lcs_len(rw, pw)
    if lcs == 0:
        return 0.0
    prec = lcs / len(pw)
    rec = lcs / len(rw)
    if prec + rec == 0:
        return 0.0
    f1 = 2 * prec * rec / (prec + rec)
    return round(f1 * 100, 2)


def _qa_metric_scores(reference: str, prediction: str) -> dict:
    ref = _normalize_answer(reference)
    pred = _normalize_answer(prediction)
    sys.setrecursionlimit(8735 * 2080 + 10)
    em = _compute_em([ref], [pred])
    em10 = _compute_em_with_tolerance([ref], [pred], 10)
    rl = _rouge_l_f1_0_100(ref, pred)
    return {
        "EM": round(em * 100, 2),
        "EM_with_error_10": round(em10 * 100, 2),
        "ROUGE-L": rl,
    }




def grade(transcript: list, workspace_path: str) -> dict:
    EXPECTED_ANSWER = "1990"
    METRIC_KEY = "EM"
    workspace = Path(workspace_path)

    ans = workspace / "answer.txt"
    if not ans.is_file():
        return {"answer_written": 0.0, "tablebench_aligned": 0.0}
    try:
        raw = ans.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return {"answer_written": 0.0, "tablebench_aligned": 0.0}
    if not raw.strip():
        return {"answer_written": 0.0, "tablebench_aligned": 0.0}

    pred_line = _parse_final_answer(raw)
    if not pred_line.strip():
        return {"answer_written": 1.0, "tablebench_aligned": 0.0}

    scores = _qa_metric_scores(EXPECTED_ANSWER, pred_line)
    val = float(scores[METRIC_KEY])

    passed = 1.0 if val >= 99.5 else 0.0

    return {"answer_written": 1.0, "tablebench_aligned": passed}
```

## Additional Notes

- Source: `datasets/tablebench/data/TableBench_DP.jsonl`, row id `19f5fcd6b29df032293fab57a9cd5e91`, `qtype=NumericalReasoning`, `qsubtype=Time-basedCalculation`.
- Grading uses only the Python standard library. `compute_em` / `compute_em_with_tolerance` follow TableBench `custom_em_metric.py`; `normalize_answer` follows `qa_metrics.py`; ROUGE-L is an LCS-based F1 on words (approximation of ROUGE-L).
