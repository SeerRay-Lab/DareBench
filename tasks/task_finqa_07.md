---
id: task_finqa_07
name: FinQA — page_91.pdf-4
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
u.s .

equity securities and international equity securities categorized as level 1 are traded on active national and international exchanges and are valued at their closing prices on the last trading day of the year .

for u.s .

equity securities and international equity securities not traded on an active exchange , or if the closing price is not available , the trustee obtains indicative quotes from a pricing vendor , broker or investment manager .

these securities are categorized as level 2 if the custodian obtains corroborated quotes from a pricing vendor or categorized as level 3 if the custodian obtains uncorroborated quotes from a broker or investment manager .

commingled equity funds are investment vehicles valued using the net asset value ( nav ) provided by the fund managers .

the nav is the total value of the fund divided by the number of shares outstanding .

commingled equity funds are categorized as level 1 if traded at their nav on a nationally recognized securities exchange or categorized as level 2 if the nav is corroborated by observable market data ( e.g. , purchases or sales activity ) and we are able to redeem our investment in the near-term .

fixed income investments categorized as level 2 are valued by the trustee using pricing models that use verifiable observable market data ( e.g. , interest rates and yield curves observable at commonly quoted intervals and credit spreads ) , bids provided by brokers or dealers or quoted prices of securities with similar characteristics .

fixed income investments are categorized at level 3 when valuations using observable inputs are unavailable .

the trustee obtains pricing based on indicative quotes or bid evaluations from vendors , brokers or the investment manager .

private equity funds , real estate funds and hedge funds are valued using the nav based on valuation models of underlying securities which generally include significant unobservable inputs that cannot be corroborated using verifiable observable market data .

valuations for private equity funds and real estate funds are determined by the general partners .

depending on the nature of the assets , the general partners may use various valuation methodologies , including the income and market approaches in their models .

the market approach consists of analyzing market transactions for comparable assets while the income approach uses earnings or the net present value of estimated future cash flows adjusted for liquidity and other risk factors .

hedge funds are valued by independent administrators using various pricing sources and models based on the nature of the securities .

private equity funds , real estate funds and hedge funds are generally categorized as level 3 as we cannot fully redeem our investment in the near-term .

commodities are traded on an active commodity exchange and are valued at their closing prices on the last trading day of the year .

contributions and expected benefit payments the funding of our qualified defined benefit pension plans is determined in accordance with erisa , as amended by the ppa , and in a manner consistent with cas and internal revenue code rules .

in 2014 , we made contributions of $ 2.0 billion related to our qualified defined benefit pension plans .

we do not plan to make contributions to our qualified defined benefit pension plans in 2015 through 2017 because none are required using current assumptions .

the following table presents estimated future benefit payments , which reflect expected future employee service , as of december 31 , 2014 ( in millions ) : .

|  | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 - 2024 |
| --- | --- | --- | --- | --- | --- | --- |
| qualified defined benefit pension plans | $ 2070 | $ 2150 | $ 2230 | $ 2320 | $ 2420 | $ 13430 |
| retiree medical and life insurance plans | 190 | 200 | 200 | 210 | 210 | 1020 |

defined contribution plans we maintain a number of defined contribution plans , most with 401 ( k ) features , that cover substantially all of our employees .

under the provisions of our 401 ( k ) plans , we match most employees 2019 eligible contributions at rates specified in the plan documents .

our contributions were $ 385 million in 2014 , $ 383 million in 2013 and $ 380 million in 2012 , the majority of which were funded in our common stock .

our defined contribution plans held approximately 41.7 million and 44.7 million shares of our common stock as of december 31 , 2014 and 2013 .

note 10 2013 stockholders 2019 equity at december 31 , 2014 and 2013 , our authorized capital was composed of 1.5 billion shares of common stock and 50 million shares of series preferred stock .

of the 316 million shares of common stock issued and outstanding as of december 31 , 2014 , 314 million shares were considered outstanding for balance sheet presentation purposes ; the remaining .

### Question

in 2014 what was the ratio of the estimated future benefit payments due in 2015 compared to the amount after 2020

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
    EXPECTED = '0.15'

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

