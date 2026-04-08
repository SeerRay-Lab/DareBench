---
id: task_medxpertqa_08
name: 'MedXpertQA MM Sample 8 (ID: MM-1003)'
category: medical_vqa
grading_type: automated
timeout_seconds: 180
workspace_files:
  - source: medxpertqa/MM-1003-a.jpeg
    dest: MM-1003-a.jpeg
---

## Prompt

An 82-year-old man with a residual right-sided hemiparesis (from a stroke one year ago) and a history of chronic obstructive pulmonary disease presents to the emergency department with dyspnea. His family began to worry when, 24 hours earlier, his breathing suddenly became labored. He has a 40-pack-year history of cigarette smoking but quit 20 years ago.


On examination, the patient’s respiratory rate is 22 breaths per minute, with an oxygen saturation of 92% while he is breathing ambient air. He has a monophonic wheeze that predominates on the mid-right lung field.


He is up to date with Covid-19 vaccinations, and testing for SARS-CoV-2 is negative. A chest radiograph is obtained (figure).


Which one of the following diagnostic modalities is most appropriate for this patient?
Answer Choices: (A) CT of the chest (B) Measurement of maximum inspiratory pressure (C) Barium swallow study (D) Spirometry (E) Fiberoptic bronchoscopy

### Images

The medical image is located at: `MM-1003-a.jpeg`.

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
- [ ] answer_correct: The answer in `answer.txt` exactly matches the expected option (`E`)

## Automated Checks

```python
def grade(transcript: list, workspace_path: str) -> dict:
    from pathlib import Path
    import re

    scores = {}
    workspace = Path(workspace_path)
    EXPECTED_ANSWER = "E"

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
- Question ID: MM-1003
- Expected Answer: E
- Medical Task: Diagnosis
- Body System: Respiratory
- Question Type: Reasoning
