---
id: task_agentvista_07
name: AgentVista - geography / Thematic Map Interpretation
category: multimodal_agent
level: L2
grading_type: hybrid
grading_weights:
  automated: 0.2
  llm_judge: 0.8
timeout_seconds: 480
environment:
  type: sandbox
  requirements:
    - web_search
workspace_files:
  - source: agentvista/23_0.png
    dest: image.png
---

## Prompt

You must answer the following multimodal question. The workspace contains these images:

- `image.png` — visual input for this question

The question is:

In this map of UK election results, which single labeled area has the highest number of Labour Party (red) seats per 100,000 residents?

Write a **short, direct answer** to `answer.txt` in the workspace (plain text, no markdown required).

Write your complete response to `answer.txt` in the workspace.

**Note**: You may use available tools or skills in the system to complete this task.

You need to complete the task in **480s**.

## Expected Behavior

1. Open the image(s) listed above and read the question carefully.
2. Use additional tools (e.g. web search) when needed to verify facts.
3. Write only the final answer in `answer.txt`.

## Grading Criteria

- [ ] **answer_written** (automated, contributes via hybrid weight 0.2): `answer.txt` exists and is non-empty
- [ ] **answer_correctness** (LLM judge, contributes via hybrid weight 0.8): binary 0 or 1 vs reference; semantic match allowed (synonyms / paraphrase), per AgentVista verifier style

## Automated Checks

```python
def grade(transcript: list, workspace_path: str) -> dict:
    """Automated: answer.txt exists and is non-empty (hybrid weight 0.2)."""
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

You are an intelligent chatbot designed for evaluating the correctness of generative outputs for question-answer pairs. Compare the predicted answer with the correct answer and determine if they match meaningfully. Consider synonyms or paraphrases as valid matches.

1. **Question**: In this map of UK election results, which single labeled area has the highest number of Labour Party (red) seats per 100,000 residents?
2. **Ground Truth Answer**: Norwich

Evaluate the model's prediction against the ground truth. Output an integer score: 1 for correct, 0 for incorrect.
Respond using exactly: Score: 1 or Score: 0. No partial credit.


### JSON output (required)

Respond with ONLY:

```json
{"scores": {"answer_correctness": 0.0}, "total": 0.0, "notes": "brief justification"}
```

Set `"total"` equal to `answer_correctness` (**0.0 or 1.0** only).

## Additional Notes

- Dataset: [Warrieryes/AgentVista](https://huggingface.co/datasets/Warrieryes/AgentVista); code: [hkust-nlp/AgentVista](https://github.com/hkust-nlp/AgentVista).
- Domain: `geography`; subdomain: `Thematic Map Interpretation`.
- Source row: parquet `train-00001-of-00002.parquet` row 2, domain=geography, subdomain=Thematic Map Interpretation
- Hybrid final score: **0.2 × automated(answer file) + 0.8 × LLM total**.
