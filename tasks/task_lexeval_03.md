---
id: task_lexeval_03
name: LexEval Legal QA 3
category: reasoning
level: L3
grading_type: automated
timeout_seconds: 480
environment:
  type: sandbox
  requirements: []
workspace_files: []
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Please answer the following legal multiple-choice question. Write your answer to `answer.txt` in the workspace.

**IMPORTANT**: `answer.txt` should contain ONLY the option letter(s) (e.g., `A`, `BC`, `ABCD`). Do not include any explanations, numbering, or extra text.

**Question**:
中华人民共和国民法第四百六十七条的内容是:
A: 行为人可以明示或者默示作出意思表示
B: 无民事行为能力人实施的民事法律行为无效
C: 建设用地使用权抵押后，该土地上新增的建筑物不属于抵押财产
D: 本法或者其他法律没有明文规定的合同，适用本编通则的规定，并可以参照适用本编或者其他法律最相类似合同的规定

**Note**: You may use available tools or skills in the system to complete this task, and you need to complete the task in 480s.

## Expected Behavior

The agent should analyze the question, select the correct option(s), and save only the answer letters to `answer.txt`.

## Grading Criteria

- [ ] answer_written: Agent wrote answer to answer.txt
- [ ] answer_correct: Answer matches expected option(s)

## Automated Checks

```python
def grade(transcript: list, workspace_path: str) -> dict:
    from pathlib import Path
    import re

    scores = {}
    workspace = Path(workspace_path)
    EXPECTED_ANSWER = "D"

    answer_file = workspace / "answer.txt"
    if answer_file.exists():
        scores["answer_written"] = 1.0
        try:
            content = answer_file.read_text(encoding="utf-8").strip()
            # Remove prefix like "1.", "A:", "Answer:", etc.
            content = re.sub(r'^[\d\s\.\-:\)\(]+', '', content)
            content = re.sub(r'^(answer|ans)[\s:\-]+', '', content, flags=re.IGNORECASE)
            # Keep only uppercase A-E letters and sort/dedupe
            cleaned = ''.join(sorted(set(re.findall(r'[A-E]', content))))
            
            if cleaned == EXPECTED_ANSWER:
                scores["answer_correct"] = 1.0
            else:
                scores["answer_correct"] = 0.0
        except Exception:
            scores["answer_correct"] = 0.0
    else:
        scores["answer_written"] = 0.0
        scores["answer_correct"] = 0.0

    return scores
```

## Additional Notes

- Expected answer (raw): 'D'
- Dataset: LexEval
