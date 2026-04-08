---
id: task_lexeval_15
name: LexEval Legal QA 15
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
中华人民共和国刑法第二百五十八条的内容是:
A: 被假释的犯罪分子，在假释考验期限内犯新罪，应当撤销假释，依照本法第七十一条的规定实行数罪并罚
B: 组织、领导恐怖活动组织的，处十年以上有期徒刑或者无期徒刑，并处没收财产；积极参加的，处三年以上十年以下有期徒刑，并处罚金；其他参加的，处三年以下有期徒刑、拘役、管制或者剥夺政治权利，可以并处罚金
C: 有配偶而重婚的，或者明知他人有配偶而与之结婚的，处二年以下有期徒刑或者拘役
D: 违反武器装备管理规定，擅自改变武器装备的编配用途，造成严重后果的，处三年以下有期徒刑或者拘役；造成特别严重后果的，处三年以上七年以下有期徒刑

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
    EXPECTED_ANSWER = "C"

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

- Expected answer (raw): 'C'
- Dataset: LexEval
