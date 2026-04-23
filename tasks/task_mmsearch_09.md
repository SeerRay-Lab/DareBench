---
id: task_mmsearch_09
name: MMSearch - architecture_0
category: multimodal_search
level: L2
grading_type: hybrid
grading_weights:
  automated: 0.2
  llm_judge: 0.7
timeout_seconds: 480
environment:
  type: sandbox
  requirements:
    - web_search
workspace_files:
  - source: mmsearch/09_query.png
    dest: image.png
---

## Prompt

You must answer the following multimodal question with the image in your workspace:

- `image.png` — image that the question refers to

The question is:

When was this building started being used? Answer up to the month.

Write a **short, direct answer** to `answer.txt` in the workspace (plain text, no markdown required).

Write your complete response to 'answer.txt' in the workspace

**Note**: Please use agent browser skill for web search if you need, web_search tool is not allowed to use.

You need to complete the task in **480s**.

## Expected Behavior

1. Inspect `image.png` and the question.
2. Use tools as needed **except** the `web_search` tool (forbidden for this task); rely on the workspace image and any other allowed tools.
3. Put the final answer in `answer.txt` (plain text). For date-style answers, prefer **yyyy-mm-dd** when applicable. If the question rests on a false premise, answer exactly: `invalid question`

## Grading Criteria

- [ ] **answer_written** (automated): `answer.txt` exists and is non-empty
- [ ] **compliance_no_web_search** (LLM): Transcript shows the agent did **not** invoke the `web_search` tool (other tools or no tools are acceptable)
- [ ] **answer_correctness** (LLM): `answer.txt` semantically matches the reference **and** the agent did not use `web_search` (see rubric; LLM judge **total** is all-or-nothing on these two conditions)

## Automated Checks

```python
def grade(transcript: list, workspace_path: str) -> dict:
    """Automated: only verify answer.txt exists and is non-empty."""
    from pathlib import Path

    workspace = Path(workspace_path)
    answer_file = workspace / "answer.txt"
    answer_written = 0.0
    if answer_file.exists():
        try:
            txt = answer_file.read_text(encoding="utf-8", errors="replace").strip()
            answer_written = 1.0 if len(txt) > 0 else 0.0
        except OSError:
            answer_written = 0.0

    return {"answer_written": answer_written}
```


## LLM Judge Rubric

### Reference Information (For Judge Only)

**Question**: When was this building started being used? Answer up to the month.

**Reference Answer (primary)**: 2018-09

**Acceptable alternative answers** (treat as correct if semantically equivalent): (none)

**Dataset meta**: sample_id=`architecture_0`, area=`knowledge`, subfield=`architecture`

---

### Criterion 1: No `web_search` tool (compliance)

Using the **Agent Transcript (summarized)** section, determine whether the agent invoked the **`web_search`** tool (match the tool name literally as used in the agent environment).

**Score 1.0**: The transcript shows **no** use of the `web_search` tool. Using **other** tools (e.g. browser/fetch/read_file/bash/vision) or using **no** tools at all is **acceptable** and should still score **1.0** here.
**Score 0.0**: The transcript shows **any** invocation of the `web_search` tool.

Do **not** treat generic "search/browse/fetch" wording in the transcript as a failure unless it is specifically the **`web_search`** tool.

### Criterion 2: Answer correctness (gated)

Read the agent's answer from **`answer.txt`** (if missing or empty, **0.0**).

Compare to the **Reference Answer** and **Acceptable alternative answers** for semantic equivalence.

**Score 1.0**: **Only if** (a) **Criterion 1 is 1.0** (no `web_search` tool), **and** (b) the answer is fully semantically correct vs the reference or acceptable alternatives; dates acceptable in yyyy-mm-dd or clearly equivalent forms.
**Score 0.0**: **Criterion 1 is 0.0** ( `web_search` was used ), **or** the answer is missing/empty, partially correct, incorrect, unrelated, or contradicts the reference.

### JSON output for the judge

Return a JSON object with:
- `"scores": { "compliance_no_web_search": <0..1>, "answer_correctness": <0..1> }`
- `"total"`: **1.0** if **both** `compliance_no_web_search` and `answer_correctness` are **1.0**; otherwise **0.0** (this task's LLM judge is all-or-nothing: no `web_search` **and** a correct answer).
- `"notes"`: brief justification (cite whether `web_search` appeared and how `answer.txt` compares to the reference)

## Additional Notes

- Source: Hugging Face `CaraJ/MMSearch`, config `end2end`.
- Hybrid: per frontmatter `grading_weights` (automated file check + LLM judge). LLM judge **`total`** follows this task's rubric: **1.0** only when **both** `compliance_no_web_search` and `answer_correctness` are **1.0**; otherwise **0.0** (not a 30/70 weighted blend).
- Workspace image is staged from `assets/mmsearch/09_query.png` as `image.png`.
