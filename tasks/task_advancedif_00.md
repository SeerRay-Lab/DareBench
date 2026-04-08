---
id: task_advancedif_00
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

Write a short story that follows fairytale themes. However, the tone of the story should be for young adults. Make sure the moral is something wholesome like sharing is caring. the story should only be two paragraphs long. Include two metaphors in each paragraph. highlight the metaphors so they stand out in the text. Finally, explain each metaphor separately.

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

1. Did the model write a short story that follows fairy tale themes?
2. Is the tone of the story for young adults?
3. Is there a wholesome moral to the story?
4. Is the story two paragraphs long?
5. Are there two metaphors in each paragraph?
6. Did the model highlight the metaphors?
7. Are the metaphors explained in a separate section?

**Score 1.0**: All 7 requirements are fully satisfied
**Score 0.8**: Most requirements satisfied, minor issues
**Score 0.5**: Some requirements satisfied, significant issues  
**Score 0.0**: Most requirements not satisfied or instruction misunderstood

### Evaluation Instructions

You are evaluating an AI assistant's response to a complex instruction-following task.

**Original Instruction**:
```
Write a short story that follows fairytale themes. However, the tone of the story should be for young adults. Make sure the moral is something wholesome like sharing is caring. the story should only be two paragraphs long. Include two metaphors in each paragraph. highlight the metaphors so they stand out in the text. Finally, explain each metaphor separately.
```

**Task**: Read the response from `answer.txt` and determine if it fully satisfies ALL requirements.

**Output Format**:
```json
{
  "instruction_followed": <score between 0.0 and 1.0>,
  "explanation": "Brief explanation of which requirements were met or missed"
}
```
