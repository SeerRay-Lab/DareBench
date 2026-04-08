---
id: task_advancedif_03
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

What are some ideas for hobbies for birdwatchers who want to meet people who aren't birders? Don't use related hobbies, like butterfly raising or building nest boxes, but do make sure the hobbies have at least some outdoors aspect. Put the list in order of most expensive start-up cost to least expensive and include the estimated cost. Don't use a bulleted or numbered list.

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

1. Did the model suggest hobbies that facilitate meeting people?
2. Did the model give ideas for hobbies with an outdoor component?
3. Did the model avoid suggesting hobbies that are a natural extension of birdwatching?
4. Did the model list the hobbies in order of most to least expensive start-up costs?
5. Did the model avoid using a bulleted list?
6. Did the model avoid using a numbered list?
7. Did the model include estimated costs for each hobby?

**Score 1.0**: All 7 requirements are fully satisfied
**Score 0.8**: Most requirements satisfied, minor issues
**Score 0.5**: Some requirements satisfied, significant issues  
**Score 0.0**: Most requirements not satisfied or instruction misunderstood

### Evaluation Instructions

You are evaluating an AI assistant's response to a complex instruction-following task.

**Original Instruction**:
```
What are some ideas for hobbies for birdwatchers who want to meet people who aren't birders? Don't use related hobbies, like butterfly raising or building nest boxes, but do make sure the hobbies have at least some outdoors aspect. Put the list in order of most expensive start-up cost to least expensive and include the estimated cost. Don't use a bulleted or numbered list.
```

**Task**: Read the response from `answer.txt` and determine if it fully satisfies ALL requirements.

**Output Format**:
```json
{
  "instruction_followed": <score between 0.0 and 1.0>,
  "explanation": "Brief explanation of which requirements were met or missed"
}
```
