---
id: task_bamboogle_05
name: 'BAMBOOGLE Sample 5 (ID: idx_5)'
category: planning
level: L3
grading_type: automated
timeout_seconds: 480
environment:
  type: browser
  requirements: []
workspace_files: []
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Who is the predecessor of the longest-reigning British monarch?

IMPORTANT: Write your answer to 'answer.txt' in the workspace.
Your answer should be concise (a single word, number, or short phrase).


**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

The agent should analyze the problem, work through the solution, and provide a clear, accurate answer.

## Grading Criteria

- [ ] answer_written: Agent wrote answer to answer.txt
- [ ] answer_correct: Answer matches expected ground truth

## Automated Checks

```python
def grade(transcript: list, workspace_path: str) -> dict:
    """
    Grade the task based on answer correctness.
    """
    from pathlib import Path
    import re
    
    scores = {}
    workspace = Path(workspace_path)
    EXPECTED_ANSWER = 'george vi'
    
    # Check answer file exists
    answer_file = workspace / "answer.txt"
    if answer_file.exists():
        scores["answer_written"] = 1.0
        
        # Check correctness
        try:
            agent_answer = answer_file.read_text(encoding="utf-8").strip()
            # Normalize
            normalized = agent_answer.lower()
            normalized = re.sub(r'^(answer|ans)[:\s]+', '', normalized)
            normalized = re.sub(r'\s+', ' ', normalized)
            normalized = normalized.strip()
            
            # Check match
            if EXPECTED_ANSWER in normalized or normalized in EXPECTED_ANSWER:
                scores["answer_correct"] = 1.0
            else:
                # Word overlap scoring
                exp_words = set(EXPECTED_ANSWER.split())
                ans_words = set(normalized.split())
                if exp_words and ans_words:
                    overlap = len(exp_words & ans_words)
                    scores["answer_correct"] = min(1.0, overlap / (len(exp_words) * 0.8))
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

- Original ID: idx_5
- Expected Answer (raw): 'George VI\n'
- Dataset: bamboogle
