---
id: task_finqa_02
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
republic services , inc .

notes to consolidated financial statements 2014 ( continued ) high quality financial institutions .

such balances may be in excess of fdic insured limits .

to manage the related credit exposure , we continually monitor the credit worthiness of the financial institutions where we have deposits .

concentrations of credit risk with respect to trade accounts receivable are limited due to the wide variety of customers and markets in which we provide services , as well as the dispersion of our operations across many geographic areas .

we provide services to small-container , large-container , municipal and residential , and energy services customers in the united states and puerto rico .

we perform ongoing credit evaluations of our customers , but generally do not require collateral to support customer receivables .

we establish an allowance for doubtful accounts based on various factors including the credit risk of specific customers , age of receivables outstanding , historical trends , economic conditions and other information .

accounts receivable , net accounts receivable represent receivables from customers for collection , transfer , recycling , disposal , energy services and other services .

our receivables are recorded when billed or when the related revenue is earned and represent claims against third parties that will be settled in cash .

the carrying value of our receivables , net of the allowance for doubtful accounts and customer credits , represents their estimated net realizable value .

provisions for doubtful accounts are evaluated on a monthly basis and are recorded based on our historical collection experience , the age of the receivables , specific customer information and economic conditions .

we also review outstanding balances on an account-specific basis .

in general , reserves are provided for accounts receivable in excess of 90 days outstanding .

past due receivable balances are written-off when our collection efforts have been unsuccessful in collecting amounts due .

the following table reflects the activity in our allowance for doubtful accounts for the years ended december 31: .

|  | 2018 | 2017 | 2016 |
| --- | --- | --- | --- |
| balance at beginning of year | $ 38.9 | $ 44.0 | $ 46.7 |
| additions charged to expense | 34.8 | 30.6 | 20.4 |
| accounts written-off | ( 39.4 ) | ( 35.7 ) | ( 23.1 ) |
| balance at end of year | $ 34.3 | $ 38.9 | $ 44.0 |

restricted cash and marketable securities as of december 31 , 2018 , we had $ 108.1 million of restricted cash and marketable securities of which $ 78.6 million supports our insurance programs for workers 2019 compensation , commercial general liability , and commercial auto liability .

additionally , we obtain funds through the issuance of tax-exempt bonds for the purpose of financing qualifying expenditures at our landfills , transfer stations , collection and recycling processing centers .

the funds are deposited directly into trust accounts by the bonding authorities at the time of issuance .

as the use of these funds is contractually restricted , and we do not have the ability to use these funds for general operating purposes , they are classified as restricted cash and marketable securities in our consolidated balance sheets .

in the normal course of business , we may be required to provide financial assurance to governmental agencies and a variety of other entities in connection with municipal residential collection contracts , closure or post- closure of landfills , environmental remediation , environmental permits , and business licenses and permits as a financial guarantee of our performance .

at several of our landfills , we satisfy financial assurance requirements by depositing cash into restricted trust funds or escrow accounts. .

### Question

as of december 31 , 2018 what was the percentage decline in the allowance for doubtful accounts

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
    EXPECTED = '11.85%'  # Accepts both 11.8% and 11.9% (within 0.5% tolerance)

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

