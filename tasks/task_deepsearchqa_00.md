---
id: task_deepsearchqa_00
name: 'DEEPSEARCHQA Sample 0 (ID: idx_0)'
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

Using EPA data, in which years from 2000 to 2010, did Portland-Vancouver-Hillsboro, OR-WA, Wichita, KS, and San Diego-Carlsbad, CA all have Carbon Monoxide Daily AQI Values in the Good (<=4.4 ppm) range for every day in the entire year, when looking across all monitor sites for each area?

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

Expected Answer: "2008, 2009, 2010"

The answer should be concise and directly address the question without extra explanations or formatting.

## Grading Criteria

- [ ] answer_written: Agent wrote answer to answer.txt
- [ ] answer_correct: Answer matches expected ground truth

## LLM Judge Rubric

```markdown
### Criterion 1: Answer Correctness (Weight: 100%)

**Score 1.0**: The answer is completely correct and matches the expected answer. The agent correctly answered: "2008, 2009, 2010"

**Score 0.0**: The answer is incorrect or does not match the expected answer.

**Note**: For partially correct answers, you may award partial credit with any value between 0.0 and 1.0 (e.g., 0.25, 0.33, 0.5, 0.75) based on your judgment of how much of the answer is correct.
```

## Additional Notes

- Original ID: idx_0
- Expected Answer (raw): '2008, 2009, 2010'
- Dataset: deepsearchqa
