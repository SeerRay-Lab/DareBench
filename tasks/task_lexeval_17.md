---
id: task_lexeval_17
name: LexEval Legal QA 17
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
请根据从给定的输入中抽取所有的实体并确定实体类型。实体类型列表有犯罪嫌疑人，受害人，被盗货币，物品价值，盗窃获利，被盗物品，作案工具，时间，地点，组织机构。输入文本：3、2018年3月10日晚，被告人廖某某在建德市**街道**花园**幢**大厅内，发现被害人虞某某停放在该处的摩托车车钥匙未拔走，遂趁人不备，窃得该摩托车的车钥匙。选项如下:
A:（犯罪嫌疑人:虞某某）,（受害人:虞某某）,（被盗物品:车钥匙,车钥匙）,（时间:2018年3月10日晚）,（地点:建德市**街道**花园**幢**大厅内） 
B:（犯罪嫌疑人:廖某某）,（受害人:虞某某）,（被盗物品:车钥匙,车钥匙）,（时间:2018年3月10日晚）,（地点:建德市**街道**花园**幢**大厅内） 
C:（犯罪嫌疑人:车钥匙,车钥匙）,（受害人:虞某某）,（被盗物品:车钥匙,车钥匙）,（时间:2018年3月10日晚）,（地点:建德市**街道**花园**幢**大厅内） 
D:（组织机构:建德市**街道**花园**幢**大厅内）,（受害人:虞某某）,（被盗物品:车钥匙,车钥匙）,（时间:2018年3月10日晚）,（地点:建德市**街道**花园**幢**大厅内）

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
