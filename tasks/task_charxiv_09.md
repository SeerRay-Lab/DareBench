---
id: task_charxiv_09
name: CharXiv - Cs Chart (20)
category: visual_qa
grading_type: llm_judge
timeout_seconds: 300
workspace_files:
  - source: charxiv/9.jpg
    dest: chart.jpg
---

## Prompt

You are given an academic chart/image from an arXiv paper. Please analyze the chart and answer the question.

### Chart Information
- Category: cs
- Year: 20
- Image ID: 9

### Question

How many data points have a DAVIS-2017 J & F Mean score of less than 50?

### Image

The chart image is located at: `chart.jpg`

Please examine the chart carefully and provide a concise answer.

**IMPORTANT**: Write your answer to `answer.txt` in the workspace. Provide a concise answer (a single word or short phrase if possible).

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 300s.

## Expected Behavior

1. Examine the chart image carefully
2. Identify relevant data, trends, or information
3. Write a concise answer to `answer.txt`

## Grading Criteria

- [ ] correct_answer: The answer in answer.txt correctly addresses the question based on the chart

## LLM Judge Rubric

### Reference Information (For Judge Only)

**Question**: How many data points have a DAVIS-2017 J & F Mean score of less than 50?

**Expected Answer**: 3

**Category**: cs
**Year**: 2020

---

### Criterion: Answer Correctness (Weight: 100%)

Compare the agent's answer with the Expected Answer above.

For this visual QA question based on an academic chart:
- The agent should provide a concise answer based on the chart content
- Equivalent forms of the answer are acceptable (e.g., "94" vs "94%", "(b)" vs "b" vs "option b")
- The answer should accurately reflect the information in the chart

**Score 1.0**: The agent's answer is correct and matches the Expected Answer (or an equivalent form).

**Score 0.0**: The agent's answer is incorrect, does not match the Expected Answer, or is unrelated to the question.
