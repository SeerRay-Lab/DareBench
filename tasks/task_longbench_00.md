---
id: task_longbench_00
name: "LongBench-v2 Sample 0 (Long In-context Learning)"
category: in_context_learning
grading_type: llm_judge
timeout_seconds: 480
workspace_files:
  - source: longbench/longbench_00_context.txt
    dest: context.txt
---

## Prompt

Read the following text and answer the question below.

The context is provided in the file 'context.txt' in your workspace.

Question: In a Tesla Model 3, if the touchscreen becomes completely unresponsive while driving and you need to perform an emergency stop, what should you do?

Choices:
(A) Press and hold the parking button (P) until the vehicle comes to a slow stop.
(B) Press the two scroll wheels on the steering wheel to reboot the screen and wait for it to recover.
(C) Use the shift buttons on the overhead console to switch to Park (P).
(D) Turn off the vehicle's power and restart it to attempt to fix the unresponsive screen.

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

The correct answer is (A): Press and hold the parking button (P) until the vehicle comes to a slow stop.

## Grading Criteria

- [ ] answer_written: Agent wrote a response to answer.txt
- [ ] answer_correct: The final answer matches the expected answer (A)

## LLM Judge Rubric

### Reference Information (For Judge Only)

**Question**: In a Tesla Model 3, if the touchscreen becomes completely unresponsive while driving and you need to perform an emergency stop, what should you do?

**Choices**:
- (A) Press and hold the parking button (P) until the vehicle comes to a slow stop.
- (B) Press the two scroll wheels on the steering wheel to reboot the screen and wait for it to recover.
- (C) Use the shift buttons on the overhead console to switch to Park (P).
- (D) Turn off the vehicle's power and restart it to attempt to fix the unresponsive screen.

**Ground Truth Answer**: (A) Press and hold the parking button (P) until the vehicle comes to a slow stop.

**Domain**: Long In-context Learning
**Sub-domain**: User guide QA
**Difficulty**: easy

---

### Criterion: Answer Correctness (Weight: 100%)

Compare the agent's final answer with the Ground Truth Answer above.

**Score 1.0**: The agent's answer matches the Ground Truth Answer (A). The agent correctly identified "(A)" as the answer.

**Score 0.0**: The agent's answer does NOT match the Ground Truth Answer. This includes:
- The agent selected a different option (not A)
- The agent did not provide a clear answer
- The answer is unrelated to the question

## Additional Notes

- Original LongBench-v2 ID: 66f4eff3821e116aacb31bc8
- Domain: Long In-context Learning
- Sub-domain: User guide QA
- Difficulty: easy
- Length category: long
- Context saved to: assets/longbench/longbench_00_context.txt
