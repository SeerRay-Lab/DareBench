---
id: task_longbench_08
name: "LongBench-v2 Sample 8 (Single-Document QA)"
category: reading_comprehension
grading_type: llm_judge
timeout_seconds: 480
workspace_files:
  - source: longbench/longbench_08_context.txt
    dest: context.txt
---

## Prompt

Read the following text and answer the question below.

The context is provided in the file 'context.txt' in your workspace.

Question: Analyzing the implementation and potential limitations of the Inference-Time Intervention (ITI) technique as discussed in the "Inference-Time Intervention: Eliciting Truthful Answers from a Language Model" paper, what could be a significant challenge in adapting ITI for broader application across various types of language models, especially considering the discussions about model architectures and intervention specificity?

Choices:
(A) ITI’s ability to maintain stylistic and computational baselines while enhancing truthfulness might lead to its adoption as a default feature in commercial language model platforms, potentially reducing the need for frequent retraining cycles.
(B) The computational overhead introduced by ITI, despite being minimal, could accumulate significantly when applied to large-scale models in continuous real-time applications, possibly negating the benefits of truthfulness enhancement in high-throughput environments.
(C) ITI’s reliance on the existing pre-trained biases and configurations of language models might lead to inconsistent performance in multilingual settings where linguistic nuances significantly impact the interpretation of truthfulness.
(D) As ITI adjusts activations based on predefined truth-correlated directions, it might inadvertently suppress creative and novel output generation in tasks requiring high levels of innovation and flexibility, such as poetry or fiction writing.

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

The correct answer is (A): ITI’s ability to maintain stylistic and computational baselines while enhancing truthfulness might lead to its adoption as a default feature in commercial language model platforms, potentially reducing the need for frequent retraining cycles.

## Grading Criteria

- [ ] answer_written: Agent wrote a response to answer.txt
- [ ] answer_correct: The final answer matches the expected answer (A)

## LLM Judge Rubric

### Reference Information (For Judge Only)

**Question**: Analyzing the implementation and potential limitations of the Inference-Time Intervention (ITI) technique as discussed in the "Inference-Time Intervention: Eliciting Truthful Answers from a Language Model" paper, what could be a significant challenge in adapting ITI for broader application across various types of language models, especially considering the discussions about model architectures and intervention specificity?

**Choices**:
- (A) ITI’s ability to maintain stylistic and computational baselines while enhancing truthfulness might lead to its adoption as a default feature in commercial language model platforms, potentially reducing the need for frequent retraining cycles.
- (B) The computational overhead introduced by ITI, despite being minimal, could accumulate significantly when applied to large-scale models in continuous real-time applications, possibly negating the benefits of truthfulness enhancement in high-throughput environments.
- (C) ITI’s reliance on the existing pre-trained biases and configurations of language models might lead to inconsistent performance in multilingual settings where linguistic nuances significantly impact the interpretation of truthfulness.
- (D) As ITI adjusts activations based on predefined truth-correlated directions, it might inadvertently suppress creative and novel output generation in tasks requiring high levels of innovation and flexibility, such as poetry or fiction writing.

**Ground Truth Answer**: (A) ITI’s ability to maintain stylistic and computational baselines while enhancing truthfulness might lead to its adoption as a default feature in commercial language model platforms, potentially reducing the need for frequent retraining cycles.

**Domain**: Single-Document QA
**Sub-domain**: Academic
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

- Original LongBench-v2 ID: 66ebc3165a08c7b9b35deb38
- Domain: Single-Document QA
- Sub-domain: Academic
- Difficulty: hard
- Length category: medium
- Context saved to: assets/longbench/longbench_08_context.txt
