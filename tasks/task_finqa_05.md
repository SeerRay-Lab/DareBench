---
id: task_finqa_05
name: FinQA — page_35.pdf-4
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
page 22 of 100 in addition to worldview-3 , some of the segment 2019s other high-profile contracts include : the james webb space telescope , a successor to the hubble space telescope ; the joint polar satellite system , the next-generation satellite weather monitoring system ; the global precipitation measurement-microwave imager , which will play an essential role in the earth 2019s weather and environmental forecasting ; and a number of antennas and sensors for the joint strike fighter .

segment earnings in 2010 as compared to 2009 increased by $ 8.4 million due to favorable fixed-price program performance and higher sales , partially offset by the program reductions described above .

segment earnings in 2009 were down $ 14.8 million compared to 2008 , primarily attributable to the winding down of several large programs and overall reduced program activity .

on february 15 , 2008 , ball completed the sale of its shares in bsg to qinetiq pty ltd for approximately $ 10.5 million , including cash sold of $ 1.8 million .

the subsidiary provided services to the australian department of defense and related government agencies .

after an adjustment for working capital items , the sale resulted in a pretax gain of $ 7.1 million .

sales to the u.s .

government , either directly as a prime contractor or indirectly as a subcontractor , represented 96 percent of segment sales in 2010 , 94 percent in 2009 and 91 percent in 2008 .

contracted backlog for the aerospace and technologies segment at december 31 , 2010 and 2009 , was $ 989 million and $ 518 million , respectively .

the increase in backlog is primarily due to the awards of the worldview-3 and joint polar satellite system ( jpss ) contracts .

comparisons of backlog are not necessarily indicative of the trend of future operations .

discontinued operations 2013 plastic packaging , americas in august 2010 , we completed the sale of our plastics packaging business and received gross proceeds of $ 280 million .

this amount included $ 15 million of contingent consideration recognized at closing but did not include preliminary closing adjustments totaling $ 18.5 million paid in the fourth quarter .

the sale of our plastics packaging business included five u.s .

plants that manufactured polyethylene terephthalate ( pet ) bottles and preforms and polypropylene bottles , as well as associated customer contracts and other related assets .

our plastics business employed approximately 1000 people and had sales of $ 635 million in 2009 .

the manufacturing plants were located in ames , iowa ; batavia , illinois ; bellevue , ohio ; chino , california ; and delran , new jersey .

the research and development operations were based in broomfield and westminster , colorado .

the following table summarizes the operating results for the discontinued operations for the years ended december 31: .

| ( $ in millions ) | 2010 | 2009 | 2008 |
| --- | --- | --- | --- |
| net sales | $ 318.5 | $ 634.9 | $ 735.4 |
| earnings from operations | $ 3.5 | $ 19.6 | $ 18.2 |
| gain on sale of business | 8.6 | 2212 | 2212 |
| loss on asset impairment | -107.1 ( 107.1 ) | 2212 | 2212 |
| loss on business consolidation activities ( a ) | -10.4 ( 10.4 ) | -23.1 ( 23.1 ) | -8.3 ( 8.3 ) |
| gain on disposition | 2212 | 4.3 | 2212 |
| tax benefit ( provision ) | 30.5 | -3.0 ( 3.0 ) | -5.3 ( 5.3 ) |
| discontinued operations net of tax | $ -74.9 ( 74.9 ) | $ -2.2 ( 2.2 ) | $ 4.6 |

( a ) includes net charges recorded to reflect costs associated with the closure of plastics packaging manufacturing plants .

additional segment information for additional information regarding our segments , see the business segment information in note 2 accompanying the consolidated financial statements within item 8 of this report .

the charges recorded for business consolidation activities were based on estimates by ball management and were developed from information available at the time .

if actual outcomes vary from the estimates , the differences will be reflected in current period earnings in the consolidated statement of earnings and identified as business consolidation gains and losses .

additional details about our business consolidation activities and associated costs are provided in note 5 accompanying the consolidated financial statements within item 8 of this report. .

### Question

what was the gross proceeds from the sale of the packaging business ( in millions ) if the preliminary closing adjustments are not finalized?

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
    EXPECTED = '298.5'

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

