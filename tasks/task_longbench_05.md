---
id: task_longbench_05
name: "LongBench-v2 Sample 5 (Long In-context Learning)"
category: in_context_learning
grading_type: llm_judge
timeout_seconds: 480
workspace_files:
  - source: longbench/longbench_05_context.txt
    dest: context.txt
---

## Prompt

Read the following text and answer the question below.

The context is provided in the file 'context.txt' in your workspace.

Question: You are given a grammar book of Kalamang language, how to translate the following Kalamang sentence into English: Ladan yumet masarura ba donselet tan yuonyuon paruoret ?

Choices:
(A) Even though the blouse is torn, we can still mend it and wear it again.
(B) That blouse may have gotten torn, but the sleeves can be made into rags.
(C) The torn blouse is useless now, but we could buy some fabric to make new sleeves.
(D) The blouse is damaged beyond repair, so we should throw it away completely.

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

The correct answer is (B): That blouse may have gotten torn, but the sleeves can be made into rags.

## Grading Criteria

- [ ] answer_written: Agent wrote a response to answer.txt
- [ ] answer_correct: The final answer matches the expected answer (B)

## LLM Judge Rubric

### Reference Information (For Judge Only)

**Question**: You are given a grammar book of Kalamang language, how to translate the following Kalamang sentence into English: Ladan yumet masarura ba donselet tan yuonyuon paruoret ?

**Choices**:
- (A) Even though the blouse is torn, we can still mend it and wear it again.
- (B) That blouse may have gotten torn, but the sleeves can be made into rags.
- (C) The torn blouse is useless now, but we could buy some fabric to make new sleeves.
- (D) The blouse is damaged beyond repair, so we should throw it away completely.

**Ground Truth Answer**: (B) That blouse may have gotten torn, but the sleeves can be made into rags.

**Domain**: Long In-context Learning
**Sub-domain**: New language translation
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

- Original LongBench-v2 ID: 66fcfbbcbb02136c067c93d3
- Domain: Long In-context Learning
- Sub-domain: New language translation
- Difficulty: easy
- Length category: long
- Context saved to: assets/longbench/longbench_05_context.txt
