---
id: task_deepsearchqa_01
name: 'DEEPSEARCHQA Sample 1 (ID: idx_1)'
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

Out of exoplanets found using the radial velocity method, with a mass of no more than 5 times that of Earth, an orbital period of at least 100 days, and discovered before 2020, find the exoplanet with the largest eccentricity and provide the name of the country that the facility that discovered this exoplanet is located in. Only provide the name of the country and nothing else.

Answer Type: unknown

IMPORTANT: Write your answer to 'answer.txt' in the workspace.
Your answer should be concise (a single word, number, or short phrase).


### Output Format
Provide a concise answer (single word or short phrase only).
Do not include any additional text, explanations, or markdown formatting.

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

The agent should:
1. Analyze the question and determine what information is needed
2. Use available tools/skills to search for and retrieve the required information
3. Process and verify the information to ensure accuracy
4. Write the final answer to 'answer.txt' in the workspace

Expected Answer: "Chile"

The answer should be concise and directly address the question without extra explanations or formatting.

## Grading Criteria

- [ ] answer_written: Agent wrote answer to answer.txt
- [ ] answer_correct: Answer matches expected ground truth

## LLM Judge Rubric

```markdown
### Criterion 1: Answer Correctness (Weight: 100%)

**Score 1.0**: The answer is completely correct and matches the expected answer. The agent correctly answered: "Chile"

**Score 0.0**: The answer is incorrect or does not match the expected answer.

**Note**: For partially correct answers, you may award partial credit with any value between 0.0 and 1.0 (e.g., 0.25, 0.33, 0.5, 0.75) based on your judgment of how much of the answer is correct.
```

## Additional Notes

- Original ID: idx_1
- Expected Answer (raw): 'Chile'
- Dataset: deepsearchqa
