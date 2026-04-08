---
id: task_logiqa_09
name: 'LOGIQA Sample 9 (ID: idx_9)'
category: logic_reasoning
level: L3
grading_type: automated
timeout_seconds: 360
environment:
  type: sandbox
  requirements: []
workspace_files:
- path: context.txt
  content: A company has six general manager assistants F, G, H, I, M and P, and three
    departments, each of which is in charge of three general manager assistants.Each
    assistant general manager is in charge of at least one department.The following
    conditions must be met? (1) There is only one assistant to the general manager
    in charge of three departments at the same time.(2) F and G are not in charge
    of the same department.(3) H and I are not in charge of the same department.
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Read the context documents in context.txt and answer the following question.

Context: A company has six general manager assistants F, G, H, I, M and P, and three departments, each of which is in charge of three general manager assistants.Each assistant general manager is in charge of at least one department.The following conditions must be met? (1) There is only one assistant to the general manager in charge of three departments at the same time.(2) F and G are not in charge of the same department.(3) H and I are not in charge of the same department....

Question: If F and M are not in charge of the same department, which of the following must be true?

Options:
A. A.F and H are in charge of the same department.
B. B.F and I are in charge of the same department.
C. C.I and P are in charge of the same department.
D. D.M and G are in charge of the same department.

IMPORTANT: You must ONLY output the option letter (A, B, C, or D) to 'answer.txt' in the workspace.

**CRITICAL**: Do NOT write the full text of the answer. Only write a single letter: A, B, C, or D.


**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 360s.

## Expected Behavior

The agent should analyze the problem, work through the solution, and provide a clear, accurate answer.

## Grading Criteria

- [ ] answer_written: Agent wrote answer to answer.txt
- [ ] answer_correct: Answer matches expected ground truth

## Automated Checks

```python
def grade(transcript: list, workspace_path: str) -> dict:
    """
    Grade the task based on answer correctness. Strict matching for option letter.
    """
    from pathlib import Path
    import re
    
    scores = {}
    workspace = Path(workspace_path)
    EXPECTED_ANSWER = "c"  # Strict match: only letter
    
    # Check answer file exists
    answer_file = workspace / "answer.txt"
    if answer_file.exists():
        scores["answer_written"] = 1.0
        
        # Check correctness - strict matching
        try:
            agent_answer = answer_file.read_text(encoding="utf-8").strip()
            # Normalize: lowercase, remove whitespace and punctuation
            normalized = agent_answer.lower().strip()
            normalized = re.sub(r'[^a-z]', '', normalized)  # Keep only letters
            
            # Strict match: must be exactly the expected letter
            if normalized == EXPECTED_ANSWER:
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

- Original ID: idx_9
- Expected Answer (raw): 'C.I and P are in charge of the same department.'
- Dataset: logiqa
