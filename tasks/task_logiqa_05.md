---
id: task_logiqa_05
name: 'LOGIQA Sample 5 (ID: idx_5)'
category: logic_reasoning
level: L3
grading_type: automated
timeout_seconds: 360
environment:
  type: sandbox
  requirements: []
workspace_files:
- path: context.txt
  content: Researchers recently discovered that there is an area called the thalamus
    pillow deep in the human brain, which is like an information desk operator, responsible
    for sorting out the external stimulus information and focusing human attention
    on the most important for behavior and survival Information.The researchers pointed
    out that this discovery is expected to bring new treatments for disorders such
    as attention deficit hyperactivity disorder and schizophrenia caused by lack of
    attention.
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Read the context documents in context.txt and answer the following question.

Context: Researchers recently discovered that there is an area called the thalamus pillow deep in the human brain, which is like an information desk operator, responsible for sorting out the external stimulus information and focusing human attention on the most important for behavior and survival Information.The researchers pointed out that this discovery is expected to bring new treatments for disorders such as attention deficit hyperactivity disorder and schizophrenia caused by lack of attention....

Question: Which of the following is assumed by the above argument

Options:
A. A.Some schizophrenia are not caused by lack of attention
B. B.Visual information is only transmitted through the visual cortex to obtain a neural network to transmit
C. C.Researchers have developed a new technology that can directly track the communication between the nerve cortex in the visual cortex and thalamus occipital region
D. D.The brain cannot process too much information in detail at the same time, and will only selectively focus on the things most relevant to the behavior

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

- Original ID: idx_5
- Expected Answer (raw): 'D.The brain cannot process too much information in detail at the same time, and will only selective
- Dataset: logiqa
