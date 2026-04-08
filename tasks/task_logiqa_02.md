---
id: task_logiqa_02
name: 'LOGIQA Sample 2 (ID: idx_2)'
category: logic_reasoning
level: L3
grading_type: automated
timeout_seconds: 360
environment:
  type: sandbox
  requirements: []
workspace_files:
- path: context.txt
  content: In August 2014, more than 200 Russian trucks carrying relief supplies entered
    eastern Ukraine.If the Ukrainian government ’s military operations in the east
    directly or indirectly attacked the Russian convoy, it may trigger the Russian
    side to take strong measures; if the Ukrainian government army temporarily Stopping
    military operations in the east to ensure the safety of the Russian convoy will
    give the civilian armed forces in a disadvantage a breathing opportunity
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Read the context documents in context.txt and answer the following question.

Context: In August 2014, more than 200 Russian trucks carrying relief supplies entered eastern Ukraine.If the Ukrainian government ’s military operations in the east directly or indirectly attacked the Russian convoy, it may trigger the Russian side to take strong measures; if the Ukrainian government army temporarily Stopping military operations in the east to ensure the safety of the Russian convoy will give the civilian armed forces in a disadvantage a breathing opportunity...

Question: If the above statement is true, which of the following must be true?

Options:
A. A.If the Ukrainian government forces attack the Russian convoy, there will be no chance for the civilian armed forces to take a breather
B. B.If the Ukrainian government army does not give the civilian armed forces a breathing opportunity, it may trigger the Russian side to take strong measures
C. C.If civilian armed forces in eastern Ukraine take a breather, Russia will not take strong measures
D. D.The Russian convoy entered Ukraine to help civilian armed forces in eastern Ukraine

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
    EXPECTED_ANSWER = "b"  # Strict match: only letter
    
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

- Original ID: idx_2
- Expected Answer (raw): 'B.If the Ukrainian government army does not give the civilian armed forces a breathing opportunity,
- Dataset: logiqa
