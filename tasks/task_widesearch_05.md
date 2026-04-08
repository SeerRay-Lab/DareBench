---
id: task_widesearch_05
name: WideSearch - ws_en_006
category: information_seeking
level: L2
grading_type: automated
timeout_seconds: 480
environment:
  type: sandbox
  requirements:
    - web_search
workspace_files:
  - source: widesearch/ws_en_006.csv
    dest: ground_truth.csv
---

## Prompt

You are given a broad information-seeking task that requires collecting and organizing information into a structured table format.

### Query
Could you list every single concert on Taylor Swift’s official tour from January 1, 2010, to May 1, 2025, including the specific date, the concert’s English name, the country, the city, and the venue. Each show should be on its own line, in chronological order from earliest to latest.

Please organize the results in one Markdown table with the following columns:
Date, the Concert’s English Name,  Host Country,  Host City, Host Venue

Don't ask me any questions, just output the results according to the columns without omitting cells arbitrarily. The output format is a markdown code block.

### Output Requirements
- **Format**: Markdown table wrapped in triple backticks with markdown specifier
- **Required Columns** (5): date, theconcert’senglishname, hostcountry, hostcity, hostvenue
- **Unique Key Columns**: date
- **Expected Rows**: 534 rows

**IMPORTANT**: Write the markdown table to `answer.txt` in the workspace.

**IMPORTANT**: You must NOT read the `ground_truth.csv` file in the workspace. Use web search to find all information.

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

1. Use web search to find all required information
2. Organize the information into a markdown table
3. Write the table to `answer.txt`

## Grading Criteria

Official WideSearch metrics (see https://github.com/ByteDance-Seed/WideSearch):

- [ ] **success_rate**: Binary score (1.0 only if perfect match with ground truth)
- [ ] **f1_by_row**: Row-level F1 score (based on unique key matching)
- [ ] **f1_by_item**: Item/cell-level F1 score
- [ ] **precision_by_row**: Correct rows / predicted rows
- [ ] **recall_by_row**: Correct rows / ground truth rows

### Field-specific Evaluation
    - `date`: exact_match
    - `theconcert’senglishname`: exact_match
    - `hostcountry`: exact_match
    - `hostcity`: llm_judge
    - `hostvenue`: llm_judge

## Automated Checks

```python
def grade(transcript, workspace_path):
    """
    Official WideSearch evaluation based on ByteDance-Seed/WideSearch.
    Reference: https://github.com/ByteDance-Seed/WideSearch
    """
    import csv
    import re
    from difflib import SequenceMatcher
    from io import StringIO
    from pathlib import Path

    REQUIRED_COLUMNS = ['date', 'theconcert’senglishname', 'hostcountry', 'hostcity', 'hostvenue']
    UNIQUE_COLUMNS = ['date']
    FIELD_EVAL_CONFIG = {'date': 'exact_match', 'theconcert’senglishname': 'exact_match', 'hostcountry': 'exact_match', 'hostcity': 'llm_judge', 'hostvenue': 'llm_judge'}

    def _zeros():
        return {
            "success_rate": 0.0, "f1_by_row": 0.0, "f1_by_item": 0.0,
            "precision_by_row": 0.0, "recall_by_row": 0.0,
            "precision_by_item": 0.0, "recall_by_item": 0.0,
        }

    def _norm_col(col):
        col = col.lower().strip()
        col = col.replace("'", "").replace('"', "")
        col = col.replace(" ", "_").replace("_", "")
        return col

    def _norm_str(content):
        return str(content).lower().strip().replace(" ", "").replace("*", "")

    def _read_gt(path):
        with open(path, newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            rows = [{k: (v if v is not None else "") for k, v in row.items()} for row in reader]
        return rows

    def _parse_pipe(table_content):
        lines = [l.strip() for l in table_content.split("\n") if l.strip()]
        lines = [l for l in lines if not set(l.strip()).issubset(set("|- :"))]
        if len(lines) < 2: return None
        new_lines = []
        for line in lines:
            cells = [cell.strip() for cell in line.split("|")]
            new_lines.append("|".join(cells))
        reader = csv.reader(StringIO("\n".join(new_lines)), delimiter="|")
        rows_raw = list(reader)
        if not rows_raw: return None
        header = rows_raw[0]
        indices = [i for i, h in enumerate(header) if h and not str(h).startswith("Unnamed")]
        if not indices: return None
        header_norm = [_norm_col(str(header[i])) for i in indices]
        out = []
        for row in rows_raw[1:]:
            padded = list(row) + [""] * (max(indices) + 1 - len(row))
            cells = [padded[i] if i < len(padded) else "" for i in indices]
            out.append(dict(zip(header_norm, cells)))
        return out

    gt_path = Path(workspace_path) / "ground_truth.csv"
    answer_file = Path(workspace_path) / "answer.txt"
    if not answer_file.exists() or not gt_path.exists():
        return _zeros()
    gt_rows_raw = _read_gt(gt_path)
    if not gt_rows_raw: return _zeros()
    response = answer_file.read_text(encoding="utf-8", errors="replace")
    # Extract markdown table
    markdown_match = re.findall(r"`{3}\s*markdown(.*?)`{3}", response, re.DOTALL | re.IGNORECASE)
    if markdown_match:
        table_str = markdown_match[0].strip()
    else:
        lines = response.split("\n")
        table_lines = []
        in_table = False
        for line in lines:
            if "|" in line:
                in_table = True
                table_lines.append(line)
            elif in_table:
                break
        table_str = "\n".join(table_lines) if table_lines else ""
    if not table_str: return _zeros()
    try:
        response_rows = _parse_pipe(table_str)
        if response_rows is None: return _zeros()
    except Exception: return _zeros()
    if not response_rows: return _zeros()
    # Normalize and check columns
    gt_rows = [{_norm_col(k): str(v or "") for k, v in row.items()} for row in gt_rows_raw]
    resp_cols = set(response_rows[0].keys())
    if not all(c in resp_cols for c in REQUIRED_COLUMNS): return _zeros()
    # Select required columns
    gt_rows = [{c: str(r.get(c, "") or "") for c in REQUIRED_COLUMNS} for r in gt_rows]
    response_rows = [{c: str(r.get(c, "") or "") for c in REQUIRED_COLUMNS} for r in response_rows]
    # Deduplicate based on unique columns
    def _dedupe(rows, subset):
        seen = set()
        out = []
        for row in rows:
            key = tuple(str(row.get(c, "") or "").lower().strip() for c in subset)
            if key not in seen:
                seen.add(key)
                out.append(row)
        return out
    gt_rows = _dedupe(gt_rows, UNIQUE_COLUMNS)
    response_rows = _dedupe(response_rows, UNIQUE_COLUMNS)
    # Check perfect match (success_rate)
    score = 0.0
    if len(response_rows) == len(gt_rows):
        gt_sorted = sorted(gt_rows, key=lambda r: tuple(str(r.get(c, "")) for c in REQUIRED_COLUMNS))
        resp_sorted = sorted(response_rows, key=lambda r: tuple(str(r.get(c, "")) for c in REQUIRED_COLUMNS))
        if all(str(ga.get(c)) == str(ra.get(c)) for ga, ra in zip(gt_sorted, resp_sorted) for c in REQUIRED_COLUMNS):
            score = 1.0
    # Build key mappings for row matching
    gt_map = {}
    for r in gt_rows:
        key = tuple(str(r.get(c, "") or "").lower().strip() for c in UNIQUE_COLUMNS)
        gt_map[key] = r
    resp_map = {}
    for r in response_rows:
        key = tuple(str(r.get(c, "") or "").lower().strip() for c in UNIQUE_COLUMNS)
        resp_map[key] = r
    # Find matched rows
    matched_keys = set(resp_map.keys()) & set(gt_map.keys())
    if not matched_keys:
        result = _zeros()
        result["success_rate"] = score
        return result
    # Calculate item-level scores
    non_unique = [c for c in REQUIRED_COLUMNS if c not in UNIQUE_COLUMNS]
    def _eval_cell(pred, gt, metric):
        p = str(pred or "").lower().strip()
        g = str(gt or "").lower().strip()
        if metric == "exact_match": return 1.0 if p == g else 0.0
        if metric == "llm_judge":
            if p == g: return 1.0
            return 1.0 if SequenceMatcher(None, p, g).ratio() >= 0.8 else 0.0
        if metric == "number_near":
            import re as re_local
            pn = re_local.findall(r"[-+]?\d+\.?\d*", p.replace(",", ""))
            gn = re_local.findall(r"[-+]?\d+\.?\d*", g.replace(",", ""))
            if pn and gn:
                try:
                    return 1.0 if abs(float(pn[0]) - float(gn[0])) <= abs(float(gn[0])) * 0.05 else 0.0
                except: pass
            return 1.0 if p == g else 0.0
        if metric == "url_match":
            import re as re_local
            urls_p = re_local.findall(r"https?://[^/\s]+", p)
            urls_g = re_local.findall(r"https?://[^/\s]+", g)
            domains_p = set(u.lower().replace("www.", "") for u in urls_p)
            domains_g = set(u.lower().replace("www.", "") for u in urls_g)
            if not domains_p and not domains_g: return 1.0 if p == g else 0.0
            return 1.0 if domains_p == domains_g else 0.0
        return 1.0 if p == g else 0.0
    row_scores = []
    item_scores = []
    for key in matched_keys:
        gt_row = gt_map[key]
        resp_row = resp_map[key]
        items = [_eval_cell(resp_row.get(c), gt_row.get(c), FIELD_EVAL_CONFIG.get(c, "exact_match")) for c in non_unique]
        row_scores.append(min(items) if items else 1.0)
        item_scores.extend(items)
    tp_row = sum(row_scores)
    tp_item = sum(item_scores)
    n_pred, n_gt = len(response_rows), len(gt_rows)
    n_pred_items, n_gt_items = n_pred * len(REQUIRED_COLUMNS), n_gt * len(REQUIRED_COLUMNS)
    p_row = tp_row / n_pred if n_pred > 0 else 0.0
    r_row = tp_row / n_gt if n_gt > 0 else 0.0
    p_item = tp_item / n_pred_items if n_pred_items > 0 else 0.0
    r_item = tp_item / n_gt_items if n_gt_items > 0 else 0.0
    def calc_f1(p, r): return (2 * p * r / (p + r)) if (p + r) > 1e-9 else 0.0
    return {
        "success_rate": score,
        "f1_by_row": calc_f1(p_row, r_row),
        "f1_by_item": calc_f1(p_item, r_item),
        "precision_by_row": p_row,
        "recall_by_row": r_row,
        "precision_by_item": p_item,
        "recall_by_item": r_item,
    }
```

## Gold Answer Reference

Ground truth available at: `ground_truth.csv` (auto-loaded in workspace)

**Preview** (First 5 rows):

| Date | the Concert’s English Name |  Host Country |  Host City | Host Venue |
| --- | --- | --- | --- | --- |
| 4th February,2010 | Fearless Tour | Australia | Brisbane | Brisbane Entertainment Centre |
| 6th February,2010 | Fearless Tour | Australia | Sydney | Acer Arena |
| 7th February,2010 | Fearless Tour | Australia | Sydney | Acer Arena |
| 8th February,2010 | Fearless Tour | Australia | Newcastle | Newcastle Entertainment Centre |
| 10th February,2010 | Fearless Tour | Australia | Melbourne | Rod Laver Arena |
| ... (529 more rows) | ... | ... | ... | ... |

*Full gold answer contains 534 rows with 5 columns*
