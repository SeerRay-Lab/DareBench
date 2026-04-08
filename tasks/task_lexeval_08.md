---
id: task_lexeval_08
name: LexEval Legal QA 8
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
请根据给定的诉方观点，选择与诉方论点相对应的辩方论点。
诉方观点：附带民事诉讼原告人张某诉称，被告人刘某甲为其母亲办丧事时，被告人刘某甲操纵刘某乙、郄某、刘某戊将原告人打倒在地，被告人刘某甲见原告人张某躺在地上，遂上前踹了原告人几脚。
A: 因刘某甲的伤害行为给原告人张某造成近六万元的损失，刘某甲并未积极赔偿原告人任何损失，没有取得原告人的谅解，其情节恶劣，原告方要求对被告人从重处罚，以法定的最高刑对其处罚。
B: 被告人刘某甲对指控其犯故意伤害罪的事实无异议。
C: 对附带民事赔偿部分认为赔偿数额太高，没有经济能力。
D: 原告人张某的辩护人的主要辩护意见是，被告人刘某甲犯罪事实清楚证据确实充分，且在案发后有两个月之久，刘某甲才经公安机关传唤至公安机关。
E: 原告人张某没有上过班，张某称住院期间有女婿丁某护理，在情理上不合适，其外孙输液与本案无关联性。

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
    EXPECTED_ANSWER = "B"

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

- Expected answer (raw): 'B'
- Dataset: LexEval
