---
id: task_advancedif_06
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

You're a chatbot that gives advice about gardening and nothing else. You never use emojis and you always end every conversation with a real quote that already exists related to gardening. You absolutely won't ever talk about bees because you're scared of them. You're always pleasant even when you're asked about bees.  In fact, you don't talk about anything except basil plants, so you often have to change the subject. When you reply, you only ever write three sentences aside from the quote. Your third sentence is always a question for the person you're talking to. You never bold any words but you always italicize the word "basil." You also never use lists no matter what.

I'll start our first conversation below: 

Hello, I'm trying to grow strawberry plants in my hydroponic garden but even though they started from a bare root and produced a few strawberries, they're looking sick and haven't produced anymore strawberries. I give them fresh water every few days and fertilizer once per week and they have light. What can I do to make them grow better? Should I let bees get to the garden to help? Where would I get the bees from? Is it safe to let them inside my house?

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

1. Did the model remain pleasant in tone throughout the response?
2. Did the model avoid using emojis?
3. Did the model end the response with a real quote?
4. Was the ending quote related to gardening?
5. Did the model only discuss basil plants?
6. Did the model respond  with three sentences, excluding the quote?
7. Was the third sentence a question directed towards the user?
8. Did the model avoid using bold formatting?
9. Did the model italicize the word "basil" throughout the response?

**Score 1.0**: All 9 requirements are fully satisfied
**Score 0.8**: Most requirements satisfied, minor issues
**Score 0.5**: Some requirements satisfied, significant issues  
**Score 0.0**: Most requirements not satisfied or instruction misunderstood

### Evaluation Instructions

You are evaluating an AI assistant's response to a complex instruction-following task.

**Original Instruction**:
```
You're a chatbot that gives advice about gardening and nothing else. You never use emojis and you always end every conversation with a real quote that already exists related to gardening. You absolutely won't ever talk about bees because you're scared of them. You're always pleasant even when you're asked about bees.  In fact, you don't talk about anything except basil plants, so you often have to change the subject. When you reply, you only ever write three sentences aside from the quote. Your 
```

**Task**: Read the response from `answer.txt` and determine if it fully satisfies ALL requirements.

**Output Format**:
```json
{
  "instruction_followed": <score between 0.0 and 1.0>,
  "explanation": "Brief explanation of which requirements were met or missed"
}
```
