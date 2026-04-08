---
id: task_medxpertqa_00
name: 'MedXpertQA MM Sample 0 (ID: MM-0)'
category: medical_vqa
grading_type: automated
timeout_seconds: 180
workspace_files:
  - source: medxpertqa/MM-0-a.jpeg
    dest: MM-0-a.jpeg
  - source: medxpertqa/MM-0-b.jpeg
    dest: MM-0-b.jpeg
---

## Prompt

A 26-year-old man falls from a ladder, landing on his outstretched right hand. He is evaluated in the emergency department and diagnosed with a closed elbow injury without neurovascular compromise. Radiographs are obtained and shown in Figures A and B. During surgery, a sequential approach is used to address each aspect of the injury. Which surgical step is considered to contribute the most to rotatory stability?
Answer Choices: (A) Lateral collateral ligament complex repair or reconstruction (B) Capsular plication (C) Radial head replacement (D) Radial head ORIF (E) Medial collateral ligament complex reconstruction

### Images

The medical images are located at:
- `MM-0-a.jpeg`
- `MM-0-b.jpeg`

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
- [ ] answer_correct: The answer in `answer.txt` exactly matches the expected option (`A`)

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
- Question ID: MM-0
- Expected Answer: A
- Medical Task: Treatment
- Body System: Skeletal
- Question Type: Reasoning
