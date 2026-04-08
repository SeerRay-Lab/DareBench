---
id: task_advancedif_07
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

I've just landed in Chiang Mai, I'm here for 10 days. Please provide some things to do within an hours drive of Chiang Mai, focusing on the most impressive mountains, waterfalls, temples and anything other popular attraction that I might enjoy.

From there, I'm unsure of the exact route, but I have a few in mind:
Chiang Mai>Chiang Rai>Luang Prabang>Vienviete>Bangkok>Phuket
Chiang Mai>Bangkok>Khiri Khan>Ranong>Phuket

Give me a viable transport route for both of these and a rough amount of hours or days each one might take.

I want you to act as the worlds leading expert in Thailand travel, so keep a professional but enthusiastic tone.
I'm a client of yours paying a lot of money so make such it's rich in detail but not overly verbose, keep it over 400 words but under 700.

I want the route in a JSON format but the rest can be in a regular conversational manner.

I'm a newbie when it comes to Thailand, so at the bottom of your response, provide 5 MUST-SEE attractions across the whole of Thailand, only the best fo the best!

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

1. Did the model provide multiple suggestions of things to do within an hour's drive of Chiang Mai?
2. Did the model provide a viable transport route for both of the suggested routes, Chiang Mai>Chiang Rai>Luang Prabang>Vienviete>Bangkok>Phuket and
Chiang Mai>Bangkok>Khiri Khan>Ranong>Phuket?
3. Did the model use a professional yet enthusiastic tone?
4. Did the model keep the response between 400 and 700 words?
5. Did the model use a JSON format for the route data?
6. Did the model suggest 5 highly popular attractions in Thailand?
7. Did the model include estimated transport times in the JSON?
8. Did the model suggest the 5 must-see attractions of Thailand at the end of the response?

**Score 1.0**: All 8 requirements are fully satisfied
**Score 0.8**: Most requirements satisfied, minor issues
**Score 0.5**: Some requirements satisfied, significant issues  
**Score 0.0**: Most requirements not satisfied or instruction misunderstood

### Evaluation Instructions

You are evaluating an AI assistant's response to a complex instruction-following task.

**Original Instruction**:
```
I've just landed in Chiang Mai, I'm here for 10 days. Please provide some things to do within an hours drive of Chiang Mai, focusing on the most impressive mountains, waterfalls, temples and anything other popular attraction that I might enjoy.

From there, I'm unsure of the exact route, but I have a few in mind:
Chiang Mai>Chiang Rai>Luang Prabang>Vienviete>Bangkok>Phuket
Chiang Mai>Bangkok>Khiri Khan>Ranong>Phuket

Give me a viable transport route for both of these and a rough amount of hours 
```

**Task**: Read the response from `answer.txt` and determine if it fully satisfies ALL requirements.

**Output Format**:
```json
{
  "instruction_followed": <score between 0.0 and 1.0>,
  "explanation": "Brief explanation of which requirements were met or missed"
}
```
