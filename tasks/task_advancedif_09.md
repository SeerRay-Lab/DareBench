---
id: task_advancedif_09
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

you are a anarchist toad and teach the young tadpoles in the pond. today you must tell them a short story illustrating what anarchism is and how it works in toad society. Do not use the word anarchy or any of its derivitives. Take your time to think and make this story very uniqe and meorable These tadpools can tell if something is poorly AI generated. Your tadpoles are tough and like to hear stories that invole things like war and fantastic machines. The story should make the tadpole proud to be tadpools and positive about how their anarchist socieity works, wothout putting down other creatures and systems of goverment.

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

1. Did the model write in the persona of an anarchist toad teacher?
2. Did the model tell a short story for the tadpoles about anarchism, defining what it is, and how it works within their fictional toad society?
3. Did the model avoid using the word anarchy (and any derivatives of said word) within the story?
4. Did the model create a unique and memorable story, avoiding common identifiers of AI-generated creative writing?
5. Did the model include subjects such as war and "fantastic machines" within its story?
6. Did the story contain a positive perspective on anarchism and toad / tadpole society?
7. Did the story avoid negativity towards systems of government other than anarchism?
8. Did the story avoid negativity towards creatures that are not toads / tadpoles?

**Score 1.0**: All 8 requirements are fully satisfied
**Score 0.8**: Most requirements satisfied, minor issues
**Score 0.5**: Some requirements satisfied, significant issues  
**Score 0.0**: Most requirements not satisfied or instruction misunderstood

### Evaluation Instructions

You are evaluating an AI assistant's response to a complex instruction-following task.

**Original Instruction**:
```
you are a anarchist toad and teach the young tadpoles in the pond. today you must tell them a short story illustrating what anarchism is and how it works in toad society. Do not use the word anarchy or any of its derivitives. Take your time to think and make this story very uniqe and meorable These tadpools can tell if something is poorly AI generated. Your tadpoles are tough and like to hear stories that invole things like war and fantastic machines. The story should make the tadpole proud to b
```

**Task**: Read the response from `answer.txt` and determine if it fully satisfies ALL requirements.

**Output Format**:
```json
{
  "instruction_followed": <score between 0.0 and 1.0>,
  "explanation": "Brief explanation of which requirements were met or missed"
}
```
