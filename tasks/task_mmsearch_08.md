---
id: task_mmsearch_08
name: MMSearch - general_37
category: multimodal_search
level: L2
grading_type: hybrid
grading_weights:
  automated: 0.1
  llm_judge: 0.9
timeout_seconds: 480
environment:
  type: sandbox
  requirements:
    - web_search
workspace_files:
  - source: mmsearch/08_query.png
    dest: image.png
  - source: mmsearch/08_image_search.png
    dest: image_search_result.png
---

## Prompt

You must answer the following multimodal question with the images in your workspace:

- `image.png` — image that the question refers to
- `image_search_result.png` — an image search result from google related to the image

The question is:

When will Indiana Jones and the Great Circle be released on PS5?

Write a **short, direct answer** to `answer.txt` in the workspace (plain text, no markdown required).

Write your complete response to 'answer.txt' in the workspace

**Note**: You may use available skills or tools in the system to complete this task.

You need to complete the task in **480s**.

## Expected Behavior

1. Inspect `image.png`, `image_search_result.png`, and the question.
2. Use tools as needed. Web-related tools are allowed and encouraged when helpful.
3. Put the final answer in `answer.txt` (plain text). For date-style answers, prefer **yyyy-mm-dd** when applicable. If the question rests on a false premise, answer exactly: `invalid question`

## Grading Criteria

- [ ] **answer_written** (automated): `answer.txt` exists and is non-empty
- [ ] **compliance_web_tool_used** (LLM, 0.2): Transcript shows the agent used at least one web-related tool
- [ ] **answer_correctness** (LLM, 0.8): `answer.txt` semantically matches the reference

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

**Question**: When will Indiana Jones and the Great Circle be released on PS5?

**Reference Answer (primary)**: 2025

**Acceptable alternative answers** (treat as correct if semantically equivalent): (none)

**Dataset meta**: sample_id=`general_37`, area=`news`, subfield=`general`

---

### Criterion 1: Web tool usage (compliance, weight 0.2)

Using the **Agent Transcript (summarized)** section, determine whether the agent used at least one **web-related tool**.

Web-related tools include tool calls that access online/web content, such as `web_search`, `browser_*` tools, `web_fetch`, or equivalent web-browsing/search tools in this environment.

**Score 1.0**: The transcript shows at least one invocation of a web-related tool.
**Score 0.0**: The transcript shows no invocation of any web-related tool.

### Criterion 2: Answer correctness (weight 0.8)

Read the agent's answer from **`answer.txt`** (if missing or empty, **0.0**).

Compare to the **Reference Answer** and **Acceptable alternative answers** for semantic equivalence.

**Score 1.0**: The answer is fully semantically correct vs the reference or acceptable alternatives; dates acceptable in yyyy-mm-dd or clearly equivalent forms.
**Score 0.0**: The answer is missing/empty, partially correct, incorrect, unrelated, or contradicts the reference.

### JSON output for the judge

Return a JSON object with:
- `"scores"`: { `"compliance_web_tool_used"`: <0..1>, `"answer_correctness"`: <0..1> }
- `"total"`: computed as `0.2 * compliance_web_tool_used + 0.8 * answer_correctness`.
  - Correct answer + used web-related tool(s): **1.0**
  - Correct answer + no web-related tool used: **0.8**
  - Incorrect answer (regardless of tool usage): **0.0**
- `"notes"`: brief justification (cite whether web-related tools were used and how `answer.txt` compares to the reference)

## Additional Notes

- Source: Hugging Face `CaraJ/MMSearch`, config `end2end`.
- Hybrid: per frontmatter `grading_weights` (automated file check + LLM judge). LLM judge `total` for this task is `0.2 * compliance_web_tool_used + 0.8 * answer_correctness`.
- Workspace images are staged from `assets/mmsearch/08_*.png` as `image.png` and `image_search_result.png`.
