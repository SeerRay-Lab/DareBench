---
id: task_medxpertqa_05
name: 'MedXpertQA MM Sample 5 (ID: MM-625)'
category: medical_vqa
grading_type: automated
timeout_seconds: 180
workspace_files:
  - source: medxpertqa/MM-625-a.jpeg
    dest: MM-625-a.jpeg
---

## Prompt

A 27-year-old man and his wife visit the physician for preconception genetic counseling. Both are asymptomatic and have no history of significant illnesses. The patient’s older brother passed away at age 13 from heart failure, and his 6-year-old nephew currently exhibits severe muscle weakness. Genetic testing reveals that the patient’s mother is not a somatic carrier of the mutation causing the disease in the family. A pedigree chart is provided, with the patient marked by an asterisk. What is the most likely reason the patient is unaffected?
Answer Choices: (A) Maternal uniparental disomy (B) Variable expressivity (C) Incomplete penetrance (D) Dominant negative mutation (E) Gonadal mosaicism

### Images

The medical image is located at: `MM-625-a.jpeg`.

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
- Question ID: MM-625
- Expected Answer: E
- Medical Task: Basic Science
- Body System: Muscular
- Question Type: Reasoning
