---
id: task_longbench_09
name: "LongBench-v2 Sample 9 (Multi-Document QA)"
category: multi_doc_qa
grading_type: llm_judge
timeout_seconds: 480
workspace_files:
  - source: longbench/longbench_09_context.txt
    dest: context.txt
---

## Prompt

Read the following text and answer the question below.

The context is provided in the file 'context.txt' in your workspace.

Question: What future trends do these two reports mainly show?

Choices:
(A) Governments will pay more attention to the challenges of information security and privacy protection
(B) The role of the library will change from the traditional physical publication storage and distribution to the intermediary and manager of electronic information
(C) Increased public trust in government transparency and information
(D) Electronic information distribution will become the mainstream of information dissemination in the future

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

The correct answer is (D): Electronic information distribution will become the mainstream of information dissemination in the future

## Grading Criteria

- [ ] answer_written: Agent wrote a response to answer.txt
- [ ] answer_correct: The final answer matches the expected answer (D)

## LLM Judge Rubric

### Reference Information (For Judge Only)

**Question**: What future trends do these two reports mainly show?

**Choices**:
- (A) Governments will pay more attention to the challenges of information security and privacy protection
- (B) The role of the library will change from the traditional physical publication storage and distribution to the intermediary and manager of electronic information
- (C) Increased public trust in government transparency and information
- (D) Electronic information distribution will become the mainstream of information dissemination in the future

**Ground Truth Answer**: (D) Electronic information distribution will become the mainstream of information dissemination in the future

**Domain**: Multi-Document QA
**Sub-domain**: Governmental
**Difficulty**: hard

---

### Criterion: Answer Correctness (Weight: 100%)

Compare the agent's final answer with the Ground Truth Answer above.

**Score 1.0**: The agent's answer matches the Ground Truth Answer (D). The agent correctly identified "(D)" as the answer.

**Score 0.0**: The agent's answer does NOT match the Ground Truth Answer. This includes:
- The agent selected a different option (not D)
- The agent did not provide a clear answer
- The answer is unrelated to the question

## Additional Notes

- Original LongBench-v2 ID: 66f3c081821e116aacb2e9fa
- Domain: Multi-Document QA
- Sub-domain: Governmental
- Difficulty: hard
- Length category: medium
- Context saved to: assets/longbench/longbench_09_context.txt
