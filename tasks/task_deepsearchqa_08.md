---
id: task_deepsearchqa_08
name: 'DEEPSEARCHQA Sample 8 (ID: idx_8)'
category: deepsearch_qa
level: L2
grading_type: llm_judge
timeout_seconds: 480
environment:
  type: browser
  requirements: []
workspace_files: []
grading_weights:
  automated: 0.0
  llm_judge: 1.0
---

## Prompt

Look only at the SEC quarterly financial statements from 2023 for Tesla Inc. Tell me in which quarters (if any) did Tesla report quarterly data that shows net profit margin percentages of over 10.5 percent? Use the formula: net income divided by total revenues times 100 to calculate the net profit margin percentage. To break down the quarters, Q1 would be for the quarterly period ended March 31, 2023. Q2 would be for the quarterly period ended June 30, 2023. Q3 would be for the quarterly period ended September 30, 2023, and Q4 would be for the quarterly period ended December 31, 2023. Use the 10-Qs and 10-Ks filed by Tesla with the SEC. Answer with the set of financial quarters (like Q1, Q2, Q3, and Q4) where Tesla reported quarterly data that shows net profit margin percentages of over 10.5 percent.

Answer Type: unknown

IMPORTANT: Write your answer to 'answer.txt' in the workspace.
Your answer should be concise (a single word, number, or short phrase).


### Output Format
Provide your answer as a comma-separated list (e.g., "xxx, xxx, xxx"). 
Do not include any additional text, explanations, or markdown formatting.

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

The agent should:
1. Analyze the question and determine what information is needed
2. Use available tools/skills to search for and retrieve the required information
3. Process and verify the information to ensure accuracy
4. Write the final answer to 'answer.txt' in the workspace

Expected Answer: "Q1, Q4"

The answer should be concise and directly address the question without extra explanations or formatting.

## Grading Criteria

- [ ] answer_written: Agent wrote answer to answer.txt
- [ ] answer_correct: Answer matches expected ground truth

## LLM Judge Rubric

```markdown
### Criterion 1: Answer Correctness (Weight: 100%)

**Score 1.0**: The answer is completely correct and matches the expected answer. The agent correctly answered: "Q1, Q4"

**Score 0.0**: The answer is incorrect or does not match the expected answer.

**Note**: For partially correct answers, you may award partial credit with any value between 0.0 and 1.0 (e.g., 0.25, 0.33, 0.5, 0.75) based on your judgment of how much of the answer is correct.
```

## Additional Notes

- Original ID: idx_8
- Expected Answer (raw): 'Q1, Q4'
- Dataset: deepsearchqa
