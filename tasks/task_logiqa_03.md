---
id: task_logiqa_03
name: 'LOGIQA Sample 3 (ID: idx_3)'
category: logic_reasoning
level: L3
grading_type: automated
timeout_seconds: 360
environment:
  type: sandbox
  requirements: []
workspace_files:
- path: context.txt
  content: twenty two.Reasonable people will not resist the law violently, unless
    the consequences of resisting the law are no worse than obeying the law, thus
    desperate.
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Read the context documents in context.txt and answer the following question.

Context: twenty two.Reasonable people will not resist the law violently, unless the consequences of resisting the law are no worse than obeying the law, thus desperate....

Question: Which of the following expressions does not agree with the expression above?

Options:
A. A.Only if the consequences of violent resistance to the law are no worse than obedience to the law, rational people will desperately and violently resist the law.
B. B.If the consequences of violent resistance to the law are worse than obedience to the law, rational people will not desperately violently resist the law.
C. C.If the consequences of obeying the law are better than violent resistance, the rational person will not desperately violently resist the law.
D. D.Only the consequences of violent resistance to the law are worse than obedience to the law.Reasonable people will not desperately violently resist the law.

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
    EXPECTED_ANSWER = "d"  # Strict match: only letter
    
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

- Original ID: idx_3
- Expected Answer (raw): 'D.Only the consequences of violent resistance to the law are worse than obedience to the law.Reason
- Dataset: logiqa
