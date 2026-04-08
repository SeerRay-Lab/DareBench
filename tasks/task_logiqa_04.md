---
id: task_logiqa_04
name: 'LOGIQA Sample 4 (ID: idx_4)'
category: logic_reasoning
level: L3
grading_type: automated
timeout_seconds: 360
environment:
  type: sandbox
  requirements: []
workspace_files:
- path: context.txt
  content: It is wrong to say that foods with a high content of refined sugar will
    not cause acquired diabetes, because foods with a high content of refined sugar
    will cause obesity, and obesity is an important cause of acquired diabetes.
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Read the context documents in context.txt and answer the following question.

Context: It is wrong to say that foods with a high content of refined sugar will not cause acquired diabetes, because foods with a high content of refined sugar will cause obesity, and obesity is an important cause of acquired diabetes....

Question: Which of the following is most similar to the above argument?

Options:
A. A.It is wrong to say that Alexander is a Plato student.In fact, Alexander was a student of Aristotle, and Aristotle was a student of Plato.
B. B.It is true that excessive fertilization is the main cause of lawn diseases and insect pests.Because excessive fertilization can cause the grass to grow madly, and the grass that grows madly has little resistance to diseases and insect pests.
C. C.It is wrong for people who frequently participate in strenuous exercise to cause sudden death.Because the violent cause is cardiovascular and cerebrovascular diseases, and vigorous exercise does not necessarily cause cardiovascular and cerebrovascular diseases.
D. D.It is wrong to say that inferior gasoline will not cause abnormal fuel consumption.Because inferior gasoline can cause very normal aging of engine valves, and abnormal aging of motive valves can cause abnormal fuel consumption.

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

- Original ID: idx_4
- Expected Answer (raw): 'D.It is wrong to say that inferior gasoline will not cause abnormal fuel consumption.Because inferi
- Dataset: logiqa
