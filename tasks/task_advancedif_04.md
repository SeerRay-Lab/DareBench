---
id: task_advancedif_04
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

Give step-by-step instructions on how to care for a Maltese dog's coat from giving it a bath to blow drying it.  Include appropriate shampoos, conditioners, and any other products.  Talk about the types of tools that are best to ensure this dog's coat remains matt and tangle-free.  It should make clear how much time one could expect to spend on this entire process.  Include a numbered list, but also include a short intro and conclusion of one or two sentences each.  The numbered list should be a list of ten steps.  One of the steps should be gathering the correct products and tools.

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

1. Did the model give step-by-step instructions to care for a Maltese dog's coat?
2. Did the model include advice on appropriate shampoos, conditioners and other hair care products?
3. Did the model include advice on appropriate tools to prevent matting and tangling of fur?
4. Did the model make it clear how much time should be set aside for the entire process?
5. Did the model include a numbered list of ten steps?
6. Was the introduction one to two sentences long?
7. Did the model include a single conclusion following the ten steps of one to two sentences long?

**Score 1.0**: All 7 requirements are fully satisfied
**Score 0.8**: Most requirements satisfied, minor issues
**Score 0.5**: Some requirements satisfied, significant issues  
**Score 0.0**: Most requirements not satisfied or instruction misunderstood

### Evaluation Instructions

You are evaluating an AI assistant's response to a complex instruction-following task.

**Original Instruction**:
```
Give step-by-step instructions on how to care for a Maltese dog's coat from giving it a bath to blow drying it.  Include appropriate shampoos, conditioners, and any other products.  Talk about the types of tools that are best to ensure this dog's coat remains matt and tangle-free.  It should make clear how much time one could expect to spend on this entire process.  Include a numbered list, but also include a short intro and conclusion of one or two sentences each.  The numbered list should be a
```

**Task**: Read the response from `answer.txt` and determine if it fully satisfies ALL requirements.

**Output Format**:
```json
{
  "instruction_followed": <score between 0.0 and 1.0>,
  "explanation": "Brief explanation of which requirements were met or missed"
}
```
