---
id: task_advancedif_01
name: AdvancedIF - complex_if_single_turn_v5
category: instruction_following
level: L3
grading_type: llm_judge
timeout_seconds: 480
environment:
  type: sandbox
  requirements: []
---

## Prompt

List the 5 most deadly cancers, and indicate the 5-year survival rate in brackets. In another, separate list, list 5 uncommon cancers, and give a rough indication (or specific numbers if possible) of how many cases of each there are per year in the United States.  Make sure no cancer appears in both lists. 

Order the deadliest cancers list from most to least deadly, and order the uncommon cancers list by cases per year (ascending). List the uncommon cancers first, and begin with a short paragraph about cancer survival rates in the US. Don't include pancreatic cancer in the deadliest cancers list (it's already accounted for in my presentation). Don't give the lists any headings or introductions but do give the response as a whole one.

**IMPORTANT**: Write your response to `answer.txt` in the workspace.

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

Please provide a response that fully addresses all requirements in the instruction, and save it to `answer.txt`.

## Grading Criteria

- [ ] instruction_followed: The response in answer.txt satisfies all criteria

## LLM Judge Rubric

### Criterion: Instruction Following (Weight: 100%)

The response must satisfy ALL of the following requirements:

1. Did the model list the 5 most deadly cancers, and did the model indicate the 5 year survival rate of the deadly cancers in brackets?
2. Did the model list 5 uncommon cancers, and did the model indicate the approximate cases per year for the uncommon cancers?
3. Did the model ensure no cancer appeared in both lists?
4. Was the deadliest cancer list ordered from most to least deadly?
5. Was the uncommon cancer list ordered from least to most cases per year?
6. Did the uncommon cancers list appear before the deadly cancers list?
7. Did the response begin with a short paragraph about cancer survival rates in the US?
8. Did the deadly cancer list not include pancreatic cancer?
9. Did the two lists not have headings?

**Score 1.0**: All 9 requirements are fully satisfied
**Score 0.8**: Most requirements satisfied, minor issues
**Score 0.5**: Some requirements satisfied, significant issues  
**Score 0.0**: Most requirements not satisfied or instruction misunderstood

### Evaluation Instructions

You are evaluating an AI assistant's response to a complex instruction-following task.

**Original Instruction**:
```
List the 5 most deadly cancers, and indicate the 5-year survival rate in brackets. In another, separate list, list 5 uncommon cancers, and give a rough indication (or specific numbers if possible) of how many cases of each there are per year in the United States.  Make sure no cancer appears in both lists. 

Order the deadliest cancers list from most to least deadly, and order the uncommon cancers list by cases per year (ascending). List the uncommon cancers first, and begin with a short paragra
```

**Task**: Read the response from `answer.txt` and determine if it fully satisfies ALL requirements.

**Output Format**:
```json
{
  "instruction_followed": <score between 0.0 and 1.0>,
  "explanation": "Brief explanation of which requirements were met or missed"
}
```
