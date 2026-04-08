---
id: task_logiqa_07
name: 'LOGIQA Sample 7 (ID: idx_7)'
category: logic_reasoning
level: L3
grading_type: automated
timeout_seconds: 360
environment:
  type: sandbox
  requirements: []
workspace_files:
- path: context.txt
  content: Since the Axka Exxon tanker disaster in 1989 and the 1991 Middle East war,
    the price of aviation fuel has risen dramatically.During the same period, the
    prices of several petroleum derivatives also rose sharply.These two facts indicate
    that aviation fuel is a petroleum derivative.
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Read the context documents in context.txt and answer the following question.

Context: Since the Axka Exxon tanker disaster in 1989 and the 1991 Middle East war, the price of aviation fuel has risen dramatically.During the same period, the prices of several petroleum derivatives also rose sharply.These two facts indicate that aviation fuel is a petroleum derivative....

Question: Which of the following statements best evaluates the above argument?

Options:
A. A.Good thinking, because aviation fuel is a petroleum derivative.
B. B.Bad thinking does not accurately state all the facts.
C. C.Bad thinking, food prices have risen during the same period, but this does not prove that aviation fuel is food.
D. D.Bad thinking, given the facts about petroleum derivatives, cannot draw any conclusions about aviation fuel.

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

- Original ID: idx_7
- Expected Answer (raw): 'C.Bad thinking, food prices have risen during the same period, but this does not prove that aviatio
- Dataset: logiqa
