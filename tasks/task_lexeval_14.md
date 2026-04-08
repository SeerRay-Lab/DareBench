---
id: task_lexeval_14
name: LexEval Legal QA 14
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
公诉机关指控：2012年10月30日21时许，被告人方某、被害人宋某因与魏某之间的感情纠葛问题在宁波市北仑区霞浦街道天兴嘉园小区13幢楼的单元门附近发生口角。后因围观群众众多，被告人方某、被害人宋某及魏某随即至天兴嘉园小区消防通道处进行商谈，期间被告人方某与被害人宋某之间又产生口角，被告人方某受到言语刺激后用拳头击打被害人宋某左下颚部位，被害人宋某受击打后晕厥倒地，致使其左侧颞枕骨、右侧额颞叶等多处部位受伤，并累及左侧面神经、听神经，伤后出现左侧周围性面瘫及左某听力丧失（听力减退在97分贝以上）。后经鉴定，被害人宋某的损伤程度为重伤。案发后，被告人方某已支付被害人医疗费用共计人民币13800元。被告人涉及的案由是： 
A: 故意伤害罪 
B: 组织出卖人体器官罪 
C: 故意杀人罪 
D: 过失致人死亡罪

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
