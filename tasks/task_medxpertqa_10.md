---
id: task_medxpertqa_10
name: 'MedXpertQA MM Sample 10 (ID: MM-1288)'
category: medical_vqa
grading_type: automated
timeout_seconds: 180
workspace_files:
  - source: medxpertqa/MM-1288-a.jpeg
    dest: MM-1288-a.jpeg
---

## Prompt

A 25-year-old female presents to the emergency department with arm spasms and perioral numbness that has progressively worsened over several days. Her medical history includes patellofemoral syndrome and plantar fasciitis, which persist due to her refusal to reduce her intensive jogging regimen (5 miles daily plus 3 additional miles per meal consumed). Her vital signs show: temperature 97.6°F (36.4°C), blood pressure 114/77 mmHg, pulse 80/min, respirations 12/min, and oxygen saturation 98% on room air. Physical examination reveals thinning hair, BMI 24 kg/m^2, regular heart rate, and clear breath sounds. Initial ECG shows U-waves, and serum potassium is 2.7 mEq/L. After administration of 2L normal saline and potassium repletion, follow-up laboratory results are:

Hemoglobin: 10 g/dL
Hematocrit: 33%
Leukocyte count: 6,600/mm^3 with normal differential
Platelet count: 297,000/mm^3 
Serum:
Na+: 137 mEq/L
Cl-: 99 mEq/L
K+: 2.9 mEq/L
HCO3-: 28 mEq/L
Blood urea nitrogen (BUN): 20 mg/dL
Glucose: 99 mg/dL
Creatinine: 1.1 mg/dL
Ca2+: 8.0 mg/dL

What is the most appropriate initial management step for this patient?
Answer Choices: (A) Potassium chloride (B) Calcium gluconate (C) Fluoxetine (D) Cognitive behavioral therapy (E) Magnesium sulfate

### Images

The medical image is located at: `MM-1288-a.jpeg`.

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
- Question ID: MM-1288
- Expected Answer: E
- Medical Task: Treatment
- Body System: Endocrine
- Question Type: Reasoning
