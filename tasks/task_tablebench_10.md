---
id: task_tablebench_10
name: TableBench DP — DataAnalysis / AnomalyDetection
category: tablebench
grading_type: llm_judge
timeout_seconds: 480
workspace_files: []
grading_weights:
  automated: 0.0
  llm_judge: 1.0
---

## Prompt

~~~text
You are a table analyst. Your task is to answer questions based on the table content.


The answer should follow the format below as in examples:
[Answer Format]
Final Answer: Answer.

[Answer Examples]
Final Answer: The three anomalies are row 5 with Tom having an unusually high score 101 in the Math column, row 7 with an unusually low score 3 in the English column, and row 9 with an unusually high score 200 in the Science column.
Final Answer: No anomalies are detected in the table.

Ensure the final answer format is the last output line and the answer should point out the abnormal data with total number then explain why for each anomaly as short as possible. If no anomaly is detected, the answer should be "No anomalies are detected in the table."


Give the final answer to the question directly without any explanation.

Read the table below in JSON format:
[TABLE] 
{'columns': ['place', 'code', 'area (km 2 )', 'population', 'most spoken language'], 'data': [['alldays', 90901, 11.75, 385, 'northern sotho'], ['bahanawa', 90902, 390.17, 19068, 'northern sotho'], ['bahanawa - ba - kibi', 90903, 163.78, 7763, 'northern sotho'], ['bochum part 1', 90912, 4.33, 8501, 'northern sotho'], ['bochum part 2', 90905, 182.33, 15911, 'northern sotho'], ['dichoeng', 90906, 100000.0, 17347, 'northern sotho'], ['manthata', 90907, 1335.47, 72175, 'northern sotho'], ['matlala', 90908, 180.83, 8697, 'northern sotho'], ['pietersburg', 90909, 1.33, 3818, 'northern sotho'], ['ramutla', 90910, 7.81, 1, 'northern sotho'], ['seshego', 90911, 6.0, 1058, 'northern sotho'], ['remainder of the municipality', 90904, 2198.72, 5539, 'northern sotho']]}

Let's get start!
Question: Can you identify any locations within the table whose area or population values significantly deviate from the patterns observed in other locations?

~~~


**Output format:** Write your **entire** answer to `answer.txt` in the workspace. Keep the same answer format as in the instruction above (including the final line `Final Answer: ...` where applicable).

## Expected Behavior

The agent should follow the TableBench DP instruction. It must write the required output to `answer.txt` in the workspace so automated grading can parse it. The file should contain a line matching `Final Answer: ...` as required by the instruction.

## Grading Criteria

- [ ] answer_written: `answer.txt` exists and is non-empty
- [ ] answer_correctness: The answer is semantically correct compared to the reference answer. Award 1.0 if the meaning matches, 0.0 if completely different, and partial credit (0.0–1.0) if partially correct.

## LLM Judge Rubric

### Criterion 1: Answer Correctness (Weight: 100%)

Evaluate the model's answer against the reference answer below. Focus on semantic meaning, not exact word overlap. Award 1.0 if the answer is correct and 0.0 if it is wrong; you may also assign a partial score between 0.0 and 1.0 based on your judgment.

**Reference Answer:** The two anomalies are the extremely large area for 'dichoeng' (100000.0) and the extremely small population for 'ramutla' (1).

**Score 1.0**: The answer's meaning matches the reference answer — the same key facts, numbers, and conclusions are present.
**Score 0.0**: The answer is completely wrong, irrelevant, or contradicts the reference answer.


## Additional Notes

- Source: `datasets/tablebench/data/TableBench_DP.jsonl`, row id `04107a8b454ee9c6a334cfcbbbd4d1e5`, `qtype=DataAnalysis`, `qsubtype=AnomalyDetection`.
- Grading is performed by an LLM judge comparing semantic similarity to the reference answer.
