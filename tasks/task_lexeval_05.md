---
id: task_lexeval_05
name: LexEval Legal QA 5
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
关于司法职业，下列哪一选项是错误的?
A: 检察官不得兼任人民代表大会常务委员会的组成人员，不得兼任行政机关、审判机关以及企业、事业单位的职务，不得兼任律师。
B: 担任最高人民法院法官应当从事法律工作满3年。
C: 犯罪嫌疑人被侦查机关第一次讯问或者采取强制措施之日起，受委托的律师凭律师执业证书、律师事务所证明和委托书或者法律援助公函，有权会见犯罪嫌疑人并了解有关案件情况。律师会见犯罪嫌疑人时，侦查机关可以监听。
D: 公证机构不得以诋毁其他公证机构、公证员或者支付回扣、佣金等不正当手段争揽公证业务

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
