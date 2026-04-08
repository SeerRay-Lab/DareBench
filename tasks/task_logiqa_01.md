---
id: task_logiqa_01
name: 'LOGIQA Sample 1 (ID: idx_1)'
category: logic_reasoning
level: L3
grading_type: automated
timeout_seconds: 360
environment:
  type: sandbox
  requirements: []
workspace_files:
- path: context.txt
  content: Critics? Officials prohibit fireworks in the city on the grounds of firecrackers
    hurting people and causing fires, instead of trying to guide them to seek benefits
    and avoid harm, which implies conscious or unconscious cultural discrimination.Every
    year, smoking causes more diseases or fires than there are injuries caused by
    fireworks.Why can't you help? The ban on fireworks not only implies cultural discrimination,
    but also wipes out the last festive atmosphere of the Spring Festival.
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Read the context documents in context.txt and answer the following question.

Context: Critics? Officials prohibit fireworks in the city on the grounds of firecrackers hurting people and causing fires, instead of trying to guide them to seek benefits and avoid harm, which implies conscious or unconscious cultural discrimination.Every year, smoking causes more diseases or fires than there are injuries caused by fireworks.Why can't you help? The ban on fireworks not only implies cultural discrimination, but also wipes out the last festive atmosphere of the Spring Festival....

Question: Which of the following statements is the hypothesis on which this critic ’s conclusion relies?

Options:
A. A.Customs such as sticking couplets, offering ancestors, and welcoming the gods of wealth, etc., which have added a festive atmosphere, have disappeared during the Spring Festival in the city.
B. B.Traditional festivals such as eating dumplings and giving out New Year's money are still flourishing during the Spring Festival in the city.
C. C.Purely rational crowds such as "Ideal Country" and "The Matrix" do not need to have a romantic holiday.
D. D.Traditional Chinese festivals such as the Dragon Boat Festival, Mid-Autumn Festival, Chongyang, etc.are not officially official festivals.

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
    EXPECTED_ANSWER = "a"  # Strict match: only letter
    
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

- Original ID: idx_1
- Expected Answer (raw): 'A.Customs such as sticking couplets, offering ancestors, and welcoming the gods of wealth, etc., wh
- Dataset: logiqa
