---
id: task_lexeval_04
name: LexEval Legal QA 4
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
中华人民共和国民法第二百八十三条的内容是:
A: 建筑物及其附属设施的费用分摊、收益分配等事项，有约定的，按照约定；没有约定或者约定不明确的，按照业主专有部分面积所占比例确定
B: 当事人采用信件、数据电文等形式订立合同要求签订确认书的，签订确认书时合同成立
C: 业主依照法定程序共同决定解聘物业服务人的，可以解除物业服务合同
D: 营利法人的权力机构、执行机构作出决议的会议召集程序、表决方式违反法律、行政法规、法人章程，或者决议内容违反法人章程的，营利法人的出资人可以请求人民法院撤销该决议

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
    EXPECTED_ANSWER = "A"

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

- Expected answer (raw): 'A'
- Dataset: LexEval
