---
id: task_longbench_06
name: "LongBench-v2 Sample 6 (Long In-context Learning)"
category: in_context_learning
grading_type: llm_judge
timeout_seconds: 480
workspace_files:
  - source: longbench/longbench_06_context.txt
    dest: context.txt
---

## Prompt

Read the following text and answer the question below.

The context is provided in the file 'context.txt' in your workspace.

Question: Recently, I bought a Casio scientific calculator, and its functions are quite complex. Which of the following features has an error?

Choices:
(A) The calculator is equipped with a large-capacity memory, allowing users to store a vast amount of data. However, when the battery is low, it may lead to the corruption or loss of the data in the memory.
(B) The calculator has a differentiation feature and uses the central difference method for differentiation. To improve accuracy, this calculator takes the average of the forward and backward differences as the derivative. This calculator also has a series function, where the data in the series can be used for mathematical or function calculations. It includes features such as defining the number of values, generating sequences, and calculating the sum of values in the series.
(C) This calculator has a series function, where the data in the series can be used for mathematical or function calculations. It also includes features such as defining the number of values, generating sequences, and calculating the sum of values in the series.
(D) This calculator has a data communication function that uses an SB-62 cable for communication. It can connect not only between two calculators but also between a calculator and a computer, or a calculator and a printer. During communication, if the connection is lost, the data will be temporarily saved, allowing transmission to continue once reconnected.

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

The correct answer is (D): This calculator has a data communication function that uses an SB-62 cable for communication. It can connect not only between two calculators but also between a calculator and a computer, or a calculator and a printer. During communication, if the connection is lost, the data will be temporarily saved, allowing transmission to continue once reconnected.

## Grading Criteria

- [ ] answer_written: Agent wrote a response to answer.txt
- [ ] answer_correct: The final answer matches the expected answer (D)

## LLM Judge Rubric

### Reference Information (For Judge Only)

**Question**: Recently, I bought a Casio scientific calculator, and its functions are quite complex. Which of the following features has an error?

**Choices**:
- (A) The calculator is equipped with a large-capacity memory, allowing users to store a vast amount of data. However, when the battery is low, it may lead to the corruption or loss of the data in the memory.
- (B) The calculator has a differentiation feature and uses the central difference method for differentiation. To improve accuracy, this calculator takes the average of the forward and backward differences as the derivative. This calculator also has a series function, where the data in the series can be used for mathematical or function calculations. It includes features such as defining the number of values, generating sequences, and calculating the sum of values in the series.
- (C) This calculator has a series function, where the data in the series can be used for mathematical or function calculations. It also includes features such as defining the number of values, generating sequences, and calculating the sum of values in the series.
- (D) This calculator has a data communication function that uses an SB-62 cable for communication. It can connect not only between two calculators but also between a calculator and a computer, or a calculator and a printer. During communication, if the connection is lost, the data will be temporarily saved, allowing transmission to continue once reconnected.

**Ground Truth Answer**: (D) This calculator has a data communication function that uses an SB-62 cable for communication. It can connect not only between two calculators but also between a calculator and a computer, or a calculator and a printer. During communication, if the connection is lost, the data will be temporarily saved, allowing transmission to continue once reconnected.

**Domain**: Long In-context Learning
**Sub-domain**: User guide QA
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

- Original LongBench-v2 ID: 66f56630821e116aacb3392b
- Domain: Long In-context Learning
- Sub-domain: User guide QA
- Difficulty: hard
- Length category: medium
- Context saved to: assets/longbench/longbench_06_context.txt
