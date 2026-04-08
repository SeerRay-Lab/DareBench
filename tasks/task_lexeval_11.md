---
id: task_lexeval_11
name: LexEval Legal QA 11
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
请根据下列事实预测判决刑期。
景东县人民检察院指控：2014年12月2日18时许，王某3酒后在景东县景某2回寺村某背后岔路口阻拦过往车辆。被告人王某乘坐王某2驾驶的摩托车途经此处时，被王某3拦下辱骂，被告人王某便与王某3争吵并相互厮打摔倒在地。被告人王某站起来后，用脚踩了王某3的头部一脚。后被告人王某乘坐摩托车离开现场。景东县公安司法鉴定中心鉴定，王某3的头部损伤程度为轻伤一级。对上述指控事实，公诉机关当庭宣读和出示了相关证据予以证实。公诉机关认为，被告人王某故意侵害他人身体健康权，致一人轻伤，其行为触犯《中华人民共和国刑法》××××的规定，应以××罪追究其刑事责任。为此，公诉机关建议本院判处被告人王某六个月至一年六个月××。被告人王某在××考验期间再犯新罪，依照《中华人民共和国刑法》××、××之规定，应当撤销××，数罪并罚。
A: 46个月
B: 44个月
C: 27个月
D: 96个月

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
