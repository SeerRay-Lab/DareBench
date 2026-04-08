---
id: task_medxpertqa_02
name: 'MedXpertQA MM Sample 2 (ID: MM-259)'
category: medical_vqa
grading_type: automated
timeout_seconds: 180
workspace_files:
  - source: medxpertqa/MM-259-a.jpeg
    dest: MM-259-a.jpeg
---

## Prompt

An investigator is examining the impact of various drugs on cardiomyocyte contraction. Maximal contractility is achieved with the use of drug A. The response observed after administering drug B is illustrated in the accompanying graph. Which of the following drugs is most likely to produce a response similar to that of drug B?
Answer Choices: (A) Albuterol (B) Phenoxybenzamine (C) Propranolol (D) Pindolol (E) Isoproterenol

### Images

The medical image is located at: `MM-259-a.jpeg`.

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
- [ ] answer_correct: The answer in `answer.txt` exactly matches the expected option (`D`)

## Automated Checks

```python
def grade(transcript: list, workspace_path: str) -> dict:
    from pathlib import Path
    import re

    scores = {}
    workspace = Path(workspace_path)
    EXPECTED_ANSWER = "D"

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
- Question ID: MM-259
- Expected Answer: D
- Medical Task: Basic Science
- Body System: Cardiovascular
- Question Type: Reasoning
