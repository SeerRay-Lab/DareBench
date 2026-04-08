---
id: task_medxpertqa_15
name: 'MedXpertQA MM Sample 15 (ID: MM-1875)'
category: medical_vqa
grading_type: automated
timeout_seconds: 180
workspace_files:
  - source: medxpertqa/MM-1875-a.jpeg
    dest: MM-1875-a.jpeg
  - source: medxpertqa/MM-1875-b.jpeg
    dest: MM-1875-b.jpeg
---

## Prompt

A 10-year-old boy presents with proptosis and strabismus. On physical examination, there is notable enlargement of the optic nerve foramen. Following surgical excision, the gross examination of the mass reveals a fusiform appearance. Which histological feature is demonstrated in image 2?
Answer Choices: (A) Rosenthal fibers (B) Mucinous degeneration (C) Hyalinized blood vessels with perivascular fibrosis (D) Microcystic degeneration (E) Reactive proliferation of arachnoid cells

### Images

The medical images are located at:
- `MM-1875-a.jpeg`
- `MM-1875-b.jpeg`

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
- Question ID: MM-1875
- Expected Answer: A
- Medical Task: Basic Science
- Body System: Nervous
- Question Type: Understanding
