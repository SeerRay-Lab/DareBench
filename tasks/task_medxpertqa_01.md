---
id: task_medxpertqa_01
name: 'MedXpertQA MM Sample 1 (ID: MM-130)'
category: medical_vqa
grading_type: automated
timeout_seconds: 180
workspace_files:
  - source: medxpertqa/MM-130-a.jpeg
    dest: MM-130-a.jpeg
---

## Prompt

A 44-year-old man comes to his primary care physician reporting persistent abdominal fullness and hematuria. His medical history includes chronic abdominal pain and ongoing alcohol consumption of six beers daily. He has a history of past marijuana use but denies current illicit drug or tobacco use. He is not taking any medications. Physical examination reveals temperature 98.7°F, blood pressure 124/86 mmHg, heart rate 84/min, and respiratory rate 16/min. Abdominal examination reveals a large, tender mass. Laboratory studies show elevated serum creatinine. A CT scan of the abdomen and pelvis is performed. What substance is most likely present within the abdominal mass identified on imaging?
Answer Choices: (A) Germinal centers (B) Ductal epithelium (C) Digestive enzymes (D) Compacted feces (E) Dysplastic cells

### Images

The medical image is located at: `MM-130-a.jpeg`.

Please examine the image(s) carefully and determine the correct answer choice.

**IMPORTANT**: Write your final answer to `answer.txt` in the workspace. Your answer must be exactly one uppercase letter: A, B, C, D, or E. Do not include any explanation.

**Note**: You may use available tools or skills in the system to complete this task.

You need to complete the task in 180s.

## Expected Behavior

1. Analyze the provided medical image(s) and clinical information.
2. Select the most appropriate answer from the given choices.
3. Write exactly one uppercase letter (A, B, C, D, or E) to `answer.txt` in the workspace.

## Grading Criteria

- [ ] answer_written: Agent wrote an answer to `answer.txt`
- [ ] answer_correct: The answer in `answer.txt` exactly matches the expected option (`C`)

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
            agent_answer = answer_file.read_text(encoding="utf-8").strip()
            # Extract the first uppercase letter A-E
            match = re.search(r'[A-E]', agent_answer)
            if match and match.group(0) == EXPECTED_ANSWER:
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

- Original dataset: MedXpertQA (MM subset)
- Question ID: MM-130
- Expected Answer: C
- Medical Task: Diagnosis
- Body System: Urinary
- Question Type: Understanding
