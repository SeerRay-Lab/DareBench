---
id: task_mmsearchplus_01
name: MMSearch-Plus - Music (01)
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
  - source: mmsearch-plus/01_image_1.png
    dest: image_1.png
  - source: mmsearch-plus/01_image_2.png
    dest: image_2.png
---

## Prompt

You must answer the following multimodal question with the images in your workspace:

- `image_1.png` — input image for this task
- `image_2.png` — input image for this task

The question is:

Who is the drummer in the band to which the band member in the picture belongs?

Write a **short, direct answer** to `answer.txt` in the workspace (plain text, no markdown required).

Write your complete response to 'answer.txt' in the workspace

**Note**: You may use any available tools or skills (including `web_search`, browser, or other retrieval) as needed.

You need to complete the task in **480s**.

## Expected Behavior

1. Inspect `image_1.png`, `image_2.png` and the question.
2. Use tools as needed to find information; rely on the workspace images and any allowed tools.
3. Put the final answer in `answer.txt` (plain text). For date-style answers, prefer **yyyy-mm-dd** when applicable. If the question rests on a false premise, answer exactly: `invalid question`

## Grading Criteria

- [ ] **answer_written** (automated): `answer.txt` exists and is non-empty
- [ ] **answer_correctness** (LLM): `answer.txt` is semantically correct vs the reference (see rubric; LLM judge **total** is this score only)

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

**Question**: Who is the drummer in the band to which the band member in the picture belongs?

**Reference Answer (primary)**: Chris Brown

**Acceptable alternative answers** (treat as correct if semantically equivalent): (none)

**Dataset meta**: global_row=`38`, category=`Music`, subtask=`Artists And Bands`, difficulty=`difficult`, video_url=`https://www.bilibili.com/video/BV1rr4y1w76H/?spm_id_from=333.337.search-card.all.click&vd_source=2bdff8606e707f1e0357458d29b96431`

---

### Answer correctness

Read the agent's answer from **`answer.txt`** (if missing or empty, **0.0**).

Compare to the **Reference Answer** and **Acceptable alternative answers** for semantic equivalence.

**Score 1.0**: The answer is fully semantically correct vs the reference or acceptable alternatives; dates acceptable in yyyy-mm-dd or clearly equivalent forms.
**Score 0.0**: The answer is missing/empty, partially correct, incorrect, unrelated, or contradicts the reference.

### JSON output for the judge

Return a JSON object with:
- `"scores": { "answer_correctness": <0..1> }`
- `"total"`: **1.0** if `answer_correctness` is **1.0**; otherwise **0.0** (binary correctness; tool usage is not graded).
- `"notes"`: brief justification (how `answer.txt` compares to the reference)

## Additional Notes

- Source: Hugging Face `Cie1/MMSearch-Plus` (decrypted with dataset canary; images exported from local arrow shards).
- Hybrid: per frontmatter `grading_weights` (automated file check + LLM judge). LLM judge **`total`** equals **`answer_correctness`** only (which tools were used is not graded).
- Workspace images are staged from `assets/mmsearch-plus/01_*.png` per the `workspace_files` list above.
