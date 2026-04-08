---
id: task_logiqa_06
name: 'LOGIQA Sample 6 (ID: idx_6)'
category: logic_reasoning
level: L3
grading_type: automated
timeout_seconds: 360
environment:
  type: sandbox
  requirements: []
workspace_files:
- path: context.txt
  content: Many colleges and universities in China held four job fairs in Toronto,
    New York, Boston, and San Francisco.The questionnaire survey for Chinese students
    attending the fair showed that 67% of people want to return to work, 33% of people
    will be serious Consider the option of returning home.It can be seen that the
    international students in the US task force have lost their attraction, and the
    popular feelings have become common practice.
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Read the context documents in context.txt and answer the following question.

Context: Many colleges and universities in China held four job fairs in Toronto, New York, Boston, and San Francisco.The questionnaire survey for Chinese students attending the fair showed that 67% of people want to return to work, 33% of people will be serious Consider the option of returning home.It can be seen that the international students in the US task force have lost their attraction, and the popular feelings have become common practice....

Question: If the following statement is true, which one would most strongly weaken the above argument?

Options:
A. A.Chinese students participating in the questionnaire survey may not express their best wishes
B. B.If Chinese students in North America cannot find a job when they return home, it will disappoint them
C. C.67 ﹪ and 33 ﹪ add up to 100 ﹪, which means zero people want to stay and work in North America
D. D.Among the Chinese students in North America, those who do not intend to return to work did not attend the job fair

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

- Original ID: idx_6
- Expected Answer (raw): 'D.Among the Chinese students in North America, those who do not intend to return to work did not at
- Dataset: logiqa
