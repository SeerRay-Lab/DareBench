---
id: task_gpqa_00
name: 'GPQA Sample 0 (ID: idx_0)'
category: reading_comprehension
level: L4
grading_type: hybrid
timeout_seconds: 480
environment:
  type: sandbox
  requirements: []
workspace_files: []
grading_weights:
  automated: 0.3
  llm_judge: 0.7
---

## Prompt

Astronomers are searching for exoplanets around two stars with exactly the same masses. Using the RV method, they detected one planet around each star, both with masses similar to that of Neptune. The stars themselves have masses similar to that of our Sun. Both planets were found to be in circular orbits.

Planet #1 was detected from the up to 5 miliangstrom periodic shift of a spectral line at a given wavelength. The periodic wavelength shift of the same spectral line in the spectrum of the host of planet #2 was 7 miliangstrom.

The question is: How many times is the orbital period of planet #2 longer than that of planet #1?

IMPORTANT:
1. Provide a detailed answer with reasoning
2. Write your response to 'answer.txt' in the workspace
3. Include your reasoning process, not just the final answer


**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

The agent should analyze the problem, work through the solution, and provide a clear, accurate answer.

## Grading Criteria

- [ ] answer_written: Agent wrote answer to answer.txt
- [ ] answer_correct: Answer matches expected ground truth
- [ ] reasoning_quality: Clear reasoning process shown
- [ ] completeness: Addresses all parts of the question

## Automated Checks

```python
def grade(transcript: list, workspace_path: str) -> dict:
    """
    Grade the task (automated checks only).
    LLM Judge will assess answer quality.
    """
    from pathlib import Path
    
    scores = {}
    workspace = Path(workspace_path)
    
    # Check file exists
    answer_file = workspace / "answer.txt"
    scores["answer_written"] = 1.0 if answer_file.exists() else 0.0
    
    # Check has content
    if answer_file.exists():
        try:
            content = answer_file.read_text(encoding="utf-8").strip()
            scores["has_content"] = min(1.0, len(content) / 100.0)
            scores["format_correct"] = 1.0  # LLM Judge assesses this
        except Exception:
            scores["has_content"] = 0.0
            scores["format_correct"] = 0.0
    else:
        scores["has_content"] = 0.0
        scores["format_correct"] = 0.0
    
    return scores
```

## LLM Judge Rubric

### Reference Information (For Judge Only)

**Question**: Astronomers are searching for exoplanets around two stars with exactly the same masses. Using the RV method, they detected one planet around each star, both with masses similar to that of Neptune. The...
**Expected Answer**: ~ 0.36

---

### Criterion 1: Answer Correctness (Weight: 50%)

Compare the agent's answer against the Expected Answer above.

**Score 1.0**: Answer is completely correct and matches the Expected Answer ("~ 0.36")
**Score 0.75**: Answer is mostly correct with minor errors or slightly different phrasing
**Score 0.5**: Answer is partially correct or contains the correct information but with significant errors
**Score 0.25**: Answer has major errors or is mostly wrong compared to Expected Answer
**Score 0.0**: Answer is completely wrong, missing, or unrelated to the Expected Answer

### Criterion 2: Reasoning Quality (Weight: 30%)

Evaluate the reasoning process shown in the answer, not just the final result.

**Score 1.0**: Clear, logical reasoning process shown with step-by-step explanation
**Score 0.75**: Good reasoning with minor gaps or unclear steps
**Score 0.5**: Some reasoning shown but unclear, incomplete, or with logical gaps
**Score 0.25**: Poor reasoning, significant logic flaws, or incorrect assumptions
**Score 0.0**: No reasoning provided, or reasoning is completely irrelevant

### Criterion 3: Completeness (Weight: 20%)

Check if the answer addresses all parts of the question.

**Score 1.0**: Addresses all parts of the question thoroughly
**Score 0.75**: Addresses most parts of the question
**Score 0.5**: Addresses some parts but misses notable aspects
**Score 0.25**: Addresses minimal parts, misses most of the question
**Score 0.0**: Misses the question entirely or provides no relevant information

## Additional Notes

- Original ID: idx_0
- Expected Answer (raw): '~ 0.36'
- Dataset: gpqa
