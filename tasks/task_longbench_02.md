---
id: task_longbench_02
name: "LongBench-v2 Sample 2 (Multi-Document QA)"
category: multi_doc_qa
grading_type: llm_judge
timeout_seconds: 480
workspace_files:
  - source: longbench/longbench_02_context.txt
    dest: context.txt
---

## Prompt

Read the following text and answer the question below.

The context is provided in the file 'context.txt' in your workspace.

Question: What is the message from the two cases?

Choices:
(A) Roe v. Wade gave women full abortion rights.
(B) The Fourteenth Amendment is unclear.
(C) With the conclusion of Roe v. Wade, the right to abortion was largely recognized by society.
(D) The interest in fetal life trumped the pregnant woman's interest in abortion, so the Supreme Court overturned Roe v. Wade.

Think step by step, then provide your answer.

IMPORTANT:
1. First explain your reasoning process
2. Then provide your final answer in the format: "The correct answer is (X)" where X is A, B, C, or D
3. Write your complete response to 'answer.txt' in the workspace

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

The agent should:
1. Read the context.txt file to understand the background information
2. Analyze the question and four choices carefully
3. Use reasoning to determine the correct answer
4. Write a response to answer.txt that includes:
   - Step-by-step reasoning process
   - Final answer in the format "The correct answer is (X)"

The correct answer is (B): The Fourteenth Amendment is unclear.

## Grading Criteria

- [ ] answer_written: Agent wrote a response to answer.txt
- [ ] answer_correct: The final answer matches the expected answer (B)

## LLM Judge Rubric

### Reference Information (For Judge Only)

**Question**: What is the message from the two cases?

**Choices**:
- (A) Roe v. Wade gave women full abortion rights.
- (B) The Fourteenth Amendment is unclear.
- (C) With the conclusion of Roe v. Wade, the right to abortion was largely recognized by society.
- (D) The interest in fetal life trumped the pregnant woman's interest in abortion, so the Supreme Court overturned Roe v. Wade.

**Ground Truth Answer**: (B) The Fourteenth Amendment is unclear.

**Domain**: Multi-Document QA
**Sub-domain**: Legal
**Difficulty**: easy

---

### Criterion: Answer Correctness (Weight: 100%)

Compare the agent's final answer with the Ground Truth Answer above.

**Score 1.0**: The agent's answer matches the Ground Truth Answer (B). The agent correctly identified "(B)" as the answer.

**Score 0.0**: The agent's answer does NOT match the Ground Truth Answer. This includes:
- The agent selected a different option (not B)
- The agent did not provide a clear answer
- The answer is unrelated to the question

## Additional Notes

- Original LongBench-v2 ID: 66f37eb9821e116aacb2d295
- Domain: Multi-Document QA
- Sub-domain: Legal
- Difficulty: easy
- Length category: short
- Context saved to: assets/longbench/longbench_02_context.txt
