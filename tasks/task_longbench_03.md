---
id: task_longbench_03
name: "LongBench-v2 Sample 3 (Multi-Document QA)"
category: multi_doc_qa
grading_type: llm_judge
timeout_seconds: 480
workspace_files:
  - source: longbench/longbench_03_context.txt
    dest: context.txt
---

## Prompt

Read the following text and answer the question below.

The context is provided in the file 'context.txt' in your workspace.

Question: The main differences and improvements between Android World and AITW are

Choices:
(A) Android World utilizes open-source models to train a more powerful open-source Android agent model
(B) Android World has expanded the testing scope of AITW to include more difficult testing tasks that can be networked and vary with the environment
(C) Android World provides an interactive testing environment that allows models to be tested during the exploration process
(D) Android World has a larger training and testing set

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

The correct answer is (C): Android World provides an interactive testing environment that allows models to be tested during the exploration process

## Grading Criteria

- [ ] answer_written: Agent wrote a response to answer.txt
- [ ] answer_correct: The final answer matches the expected answer (C)

## LLM Judge Rubric

### Reference Information (For Judge Only)

**Question**: The main differences and improvements between Android World and AITW are

**Choices**:
- (A) Android World utilizes open-source models to train a more powerful open-source Android agent model
- (B) Android World has expanded the testing scope of AITW to include more difficult testing tasks that can be networked and vary with the environment
- (C) Android World provides an interactive testing environment that allows models to be tested during the exploration process
- (D) Android World has a larger training and testing set

**Ground Truth Answer**: (C) Android World provides an interactive testing environment that allows models to be tested during the exploration process

**Domain**: Multi-Document QA
**Sub-domain**: Academic
**Difficulty**: hard

---

### Criterion: Answer Correctness (Weight: 100%)

Compare the agent's final answer with the Ground Truth Answer above.

**Score 1.0**: The agent's answer matches the Ground Truth Answer (C). The agent correctly identified "(C)" as the answer.

**Score 0.0**: The agent's answer does NOT match the Ground Truth Answer. This includes:
- The agent selected a different option (not C)
- The agent did not provide a clear answer
- The answer is unrelated to the question

## Additional Notes

- Original LongBench-v2 ID: 66ec5af0821e116aacb1ce41
- Domain: Multi-Document QA
- Sub-domain: Academic
- Difficulty: hard
- Length category: short
- Context saved to: assets/longbench/longbench_03_context.txt
