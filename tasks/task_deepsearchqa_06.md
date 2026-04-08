---
id: task_deepsearchqa_06
name: 'DEEPSEARCHQA Sample 6 (ID: idx_6)'
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

According to the American Library Association, which books that have appeared at least twice on their "Top 10 Most Challenged Books" lists for the years 2015-2020 are not present on any of their Frequently Challenged Books lists under "Classics", "Young Adult Books", "Children's Books", or "Books with Diverse Content"?

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

Expected Answer: "The Hate U Give, A Day in the Life of Marlon Bundo, Sex is a Funny Word"

The answer should be concise and directly address the question without extra explanations or formatting.

## Grading Criteria

- [ ] answer_written: Agent wrote answer to answer.txt
- [ ] answer_correct: Answer matches expected ground truth

## LLM Judge Rubric

```markdown
### Criterion 1: Answer Correctness (Weight: 100%)

**Score 1.0**: The answer is completely correct and matches the expected answer. The agent correctly answered: "The Hate U Give, A Day in the Life of Marlon Bundo, Sex is a Funny Word"

**Score 0.0**: The answer is incorrect or does not match the expected answer.

**Note**: For partially correct answers, you may award partial credit with any value between 0.0 and 1.0 (e.g., 0.25, 0.33, 0.5, 0.75) based on your judgment of how much of the answer is correct.
```

## Additional Notes

- Original ID: idx_6
- Expected Answer (raw): 'The Hate U Give, A Day in the Life of Marlon Bundo, Sex is a Funny Word'
- Dataset: deepsearchqa
