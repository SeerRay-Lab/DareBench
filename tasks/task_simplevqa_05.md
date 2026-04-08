---
id: task_simplevqa_05
name: SimpleVQA - CN Visual QA
category: visual_qa
level: L2
grading_type: llm_judge
timeout_seconds: 300
environment:
  type: sandbox
  requirements: []
workspace_files:
  - source: simplevqa/5.jpg
    dest: image.jpg
---

## Prompt

You are given an image and a question about it. Please analyze the image and provide a concise answer.

### Question
图中描绘的是哪一场战役？

### Image

The image is located at: `image.jpg`

**IMPORTANT**: Write your answer to `answer.txt` in the workspace. Provide a concise, accurate answer.

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 300s.

## Expected Behavior

1. Carefully examine the image
2. Identify the relevant visual information
3. Write the answer to `answer.txt`

## Grading Criteria

- [ ] correct_answer: The answer in answer.txt correctly addresses the question

## LLM Judge Rubric

### Criterion: Answer Correctness (Weight: 100%)

**Question**: 图中描绘的是哪一场战役？

**Reference Answer**: 卡塞罗斯战役

Read the answer from `answer.txt` and evaluate.

**Evaluation Guidelines**:

1. **Semantic Equivalence**: The answer should convey the same meaning as the reference answer
   - Exact word match is NOT required
   - Different phrasing with same meaning is acceptable
   
2. **Factual Correctness**: The answer should be factually correct based on the image

**Score 1.0**: Answer is semantically equivalent to reference and factually correct
**Score 0.5**: Answer is partially correct or related but not fully accurate
**Score 0.0**: Answer is incorrect or unrelated
