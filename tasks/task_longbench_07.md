---
id: task_longbench_07
name: "LongBench-v2 Sample 7 (Single-Document QA)"
category: reading_comprehension
grading_type: llm_judge
timeout_seconds: 480
workspace_files:
  - source: longbench/longbench_07_context.txt
    dest: context.txt
---

## Prompt

Read the following text and answer the question below.

The context is provided in the file 'context.txt' in your workspace.

Question: Please try to deduce the true story based on the evidence currently known. In your deduction, who provided an alibi for the murderer?

Choices:
(A) Honoka Nishikawa
(B) Tokuro Shibaura
(C) Takahiro Funami
(D) Tomoka Takino

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

The correct answer is (A): Honoka Nishikawa

## Grading Criteria

- [ ] answer_written: Agent wrote a response to answer.txt
- [ ] answer_correct: The final answer matches the expected answer (A)

## LLM Judge Rubric

### Reference Information (For Judge Only)

**Question**: Please try to deduce the true story based on the evidence currently known. In your deduction, who provided an alibi for the murderer?

**Choices**:
- (A) Honoka Nishikawa
- (B) Tokuro Shibaura
- (C) Takahiro Funami
- (D) Tomoka Takino

**Ground Truth Answer**: (A) Honoka Nishikawa

**Domain**: Single-Document QA
**Sub-domain**: Detective
**Difficulty**: hard

---

### Criterion: Answer Correctness (Weight: 100%)

Compare the agent's final answer with the Ground Truth Answer above.

**Score 1.0**: The agent's answer matches the Ground Truth Answer (A). The agent correctly identified "(A)" as the answer.

**Score 0.0**: The agent's answer does NOT match the Ground Truth Answer. This includes:
- The agent selected a different option (not A)
- The agent did not provide a clear answer
- The answer is unrelated to the question

## Additional Notes

- Original LongBench-v2 ID: 670fbb1fbb02136c067d2ca4
- Domain: Single-Document QA
- Sub-domain: Detective
- Difficulty: hard
- Length category: medium
- Context saved to: assets/longbench/longbench_07_context.txt
