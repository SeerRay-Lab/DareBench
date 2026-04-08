---
id: task_finqa_06
name: FinQA — page_48.pdf-2
category: finqa
grading_type: automated
timeout_seconds: 480
workspace_files: []
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

~~~text
.

| currency | 2012 | 2011 | 2010 |
| --- | --- | --- | --- |
| real | $ 40.4 | $ 42.4 | $ 32.5 |
| euro | 27.1 | 26.4 | 18.6 |
| pound sterling | 18.5 | 17.6 | 9.0 |
| indian rupee | 4.3 | 3.6 | 2.6 |
| total impact | $ 90.3 | $ 90.0 | $ 62.7 |

the impact on earnings of the foregoing assumed 10% ( 10 % ) change in each of the periods presented would not have been significant .

revenue included $ 100.8 million and operating income included $ 9.0 million of unfavorable foreign currency impact during 2012 resulting from a stronger u.s .

dollar during 2012 compared to 2011 .

our foreign exchange risk management policy permits the use of derivative instruments , such as forward contracts and options , to reduce volatility in our results of operations and/or cash flows resulting from foreign exchange rate fluctuations .

our international operations' revenues and expenses are generally denominated in local currency , which limits the economic exposure to foreign exchange risk in those jurisdictions .

we do not enter into foreign currency derivative instruments for trading purposes .

we have entered into foreign currency forward exchange contracts to hedge foreign currency exposure to intercompany loans .

as of december 31 , 2012 , the notional amount of these derivatives was approximately $ 115.6 million and the fair value was nominal .

these derivatives are intended to hedge the foreign exchange risks related to intercompany loans , but have not been designated as hedges for accounting purposes. .

### Question

what is the percentage change in the impact of euro from 2011 to 2012?

### Output requirements

- Give **only** the final answer: a number, a percentage (e.g. `12.5%`), `yes` or `no`, or a short phrase as appropriate.
- Do **not** put step-by-step reasoning in the answer file; the file should contain the direct answer only.

Write your final answer to `answer.txt` in the workspace (prefer a single concise line).
~~~

## Expected Behavior

The agent uses only the text and table given in the prompt, writes the direct answer to `answer.txt`. Grading compares this answer to the FinQA dataset reference (normalized: numbers/percentages with small tolerance).

## Grading Criteria

- [ ] answer_correct: Model answer matches the reference (1.0) or not (0.0)

## Automated Checks

```python
import re
from decimal import Decimal, InvalidOperation
from pathlib import Path


def grade(transcript: list, workspace_path: str) -> dict:
    EXPECTED = '2.7%'

    def norm_spaces(s: str) -> str:
        return re.sub(r"\s+", " ", s.strip())

    def parse_num(s: str):
        s = s.lower().replace(",", "").replace("$", "").strip()
        if s.endswith("%"):
            s = s[:-1].strip()
            try:
                return Decimal(s) / Decimal(100)
            except InvalidOperation:
                return None
        try:
            return Decimal(s)
        except InvalidOperation:
            return None

    def match(pred: str, ref: str) -> bool:
        p = norm_spaces(pred)
        r = norm_spaces(ref)
        if p.lower() == r.lower():
            return True
        pn, rn = parse_num(p), parse_num(r)
        if pn is not None and rn is not None:
            if rn == 0:
                return pn == 0
            diff = abs(pn - rn)
            if diff <= Decimal("1e-6"):
                return True
            try:
                rel = diff / abs(rn)
                return rel <= Decimal("0.005")
            except Exception:
                return False
        return False

    text = ""
    p = Path(workspace_path) / "answer.txt"
    if p.exists():
        try:
            text = p.read_text(encoding="utf-8", errors="replace")
        except OSError:
            text = ""
    if not text.strip():
        for ev in reversed(transcript):
            if ev.get("type") != "message":
                continue
            msg = ev.get("message", {})
            if msg.get("role") != "assistant":
                continue
            for item in msg.get("content", []):
                if item.get("type") == "text" and item.get("text"):
                    text = item["text"]
                    break
            if text:
                break

    first_line = text.strip().splitlines()[0] if text.strip() else ""
    ok = match(first_line, EXPECTED)
    return {"answer_correct": 1.0 if ok else 0.0}
```

