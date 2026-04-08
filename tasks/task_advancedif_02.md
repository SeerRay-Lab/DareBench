---
id: task_advancedif_02
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

I want 2-4 science idea experiments suitable for my 5 yr old nieces who I'm babysitting Sat afternoon (they'll each pick one). I would like to use stuff I already have around the house as much as possible but I have a small budget for other stuff (include prices for things I may need to buy). Please use numbered instructions for easy following and make them sound fun as my nieces will be hands on. Let's aim for less than 10 steps each. They're into glitter and slime respectively.

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

1. Did the model provide 2-4 science experiments suitable for 5-year-olds?
2. Are the experiments short enough so that 2 can be completed in one afternoon?
3. Do the experiments utilize common household ingredients?
4. Do non-household items have an approximate price listed?
5. Do the Instructions utilize numbered formatting?
6. Do the instructions have a fun and child-friendly tone?
7. Are the Instructions less than 10 steps each?
8. Do some of the experiment ideas include glitter and slime?

**Score 1.0**: All 8 requirements are fully satisfied
**Score 0.8**: Most requirements satisfied, minor issues
**Score 0.5**: Some requirements satisfied, significant issues  
**Score 0.0**: Most requirements not satisfied or instruction misunderstood

### Evaluation Instructions

You are evaluating an AI assistant's response to a complex instruction-following task.

**Original Instruction**:
```
I want 2-4 science idea experiments suitable for my 5 yr old nieces who I'm babysitting Sat afternoon (they'll each pick one). I would like to use stuff I already have around the house as much as possible but I have a small budget for other stuff (include prices for things I may need to buy). Please use numbered instructions for easy following and make them sound fun as my nieces will be hands on. Let's aim for less than 10 steps each. They're into glitter and slime respectively.
```

**Task**: Read the response from `answer.txt` and determine if it fully satisfies ALL requirements.

**Output Format**:
```json
{
  "instruction_followed": <score between 0.0 and 1.0>,
  "explanation": "Brief explanation of which requirements were met or missed"
}
```
