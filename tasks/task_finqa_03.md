---
id: task_finqa_03
name: FinQA — page_94.pdf-1
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
zero .

to the extent earned , these performance units convert into unrestricted shares after performance results for the three-year performance period are certified by the compensation committee .

we recognize share-based compensation expense based on the grant-date fair value of the performance-based restricted stock units , as determined by use of a monte carlo model , on a straight-line basis over the performance period .

leveraged performance units during the year ended may 31 , 2015 , certain executives were granted performance units that we refer to as 201cleveraged performance units , 201d or 201clpus . 201d lpus contain a market condition based on our relative stock price growth over a three-year performance period .

the lpus contain a minimum threshold performance which , if not met , would result in no payout .

the lpus also contain a maximum award opportunity set as a fixed dollar and fixed number of shares .

after the three-year performance period , which concluded in october 2017 , one-third of the earned units converted to unrestricted common stock .

the remaining two-thirds converted to restricted stock that will vest in equal installments on each of the first two anniversaries of the conversion date .

we recognize share-based compensation expense based on the grant date fair value of the lpus , as determined by use of a monte carlo model , on a straight-line basis over the requisite service period for each separately vesting portion of the lpu award .

the following table summarizes the changes in unvested restricted stock and performance awards for the years ended december 31 , 2018 and 2017 , the 2016 fiscal transition period and the year ended may 31 , 2016 : shares weighted-average grant-date fair value ( in thousands ) .

|  | shares ( in thousands ) | weighted-averagegrant-datefair value |
| --- | --- | --- |
| unvested at may 31 2015 | 1848 | $ 28.97 |
| granted | 461 | 57.04 |
| vested | -633 ( 633 ) | 27.55 |
| forfeited | -70 ( 70 ) | 34.69 |
| unvested at may 31 2016 | 1606 | 37.25 |
| granted | 348 | 74.26 |
| vested | -639 ( 639 ) | 31.38 |
| forfeited | -52 ( 52 ) | 45.27 |
| unvested at december 31 2016 | 1263 | 49.55 |
| granted | 899 | 79.79 |
| vested | -858 ( 858 ) | 39.26 |
| forfeited | -78 ( 78 ) | 59.56 |
| unvested at december 31 2017 | 1226 | 78.29 |
| granted | 650 | 109.85 |
| vested | -722 ( 722 ) | 60.08 |
| forfeited | -70 ( 70 ) | 91.47 |
| unvested at december 31 2018 | 1084 | $ 108.51 |

the total fair value of restricted stock and performance awards vested was $ 43.4 million and $ 33.7 million for the years ended december 31 , 2018 and 2017 , respectively , $ 20.0 million for the 2016 fiscal transition period and $ 17.4 million for the year ended may 31 , 2016 .

for restricted stock and performance awards , we recognized compensation expense of $ 53.2 million and $ 35.2 million for the years ended december 31 , 2018 and 2017 , respectively , $ 17.2 million for the 2016 fiscal transition period and $ 28.8 million for the year ended may 31 , 2016 .

as of december 31 , 2018 , there was $ 62.7 million of unrecognized compensation expense related to unvested restricted stock and performance awards that we expect to recognize over a weighted-average period of 2.0 years .

our restricted stock and performance award plans provide for accelerated vesting under certain conditions .

94 2013 global payments inc .

| 2018 form 10-k annual report .

### Question

what was the value in thousands of unvested restricted stock and performance awards at the weighted-averagegrant-datefair value as of december 31 , 2017?\

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
    EXPECTED = '95983.54'

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

