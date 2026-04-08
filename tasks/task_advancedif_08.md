---
id: task_advancedif_08
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

I'm writing a paper for school about traditional movies, television, and music and show their influence on anime. The topic is fun but needs to be academic to show proper homage and tropes. I need brainstorm ideas and organization. The anime I'm focusing on is Cowboy Bebop. The topic should cover the show as a whole, as well as focus on the 6 main characters: Spike, Jet, Faye, Ed, Vicious, and Julia. For each character, list movie and television references for design. Each item on the list should have a paragraph-long summary showing the connection in detail. After the list and summary, I need another list and summary in the same format for the music and soundtrack of Cowboy Bebop. Finally, I need that list and summary format repeated a 3rd time, this time focusing on general, overarching references and homage from themes of the show as a whole. Conclude the response with a list of anime that pay homage to Cowboy Bebop with a numbered list and a quick 1 sentence synopsis of how they paid homage.

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

1. Is the response about Cowboy Bebop?
2. Did the response create a list of references about the 6 main characters?
3. Was each character summary paragraph-long?
4. Did the response repeat the instruction set for music?
5. Did the response repeat the instruction set for overarching details and themes?
6. Did the response create a numbered list of animes that paid homage to Cowboy Bebop?
7. Did the anime numbered list include a 1 sentence synopsis?

**Score 1.0**: All 7 requirements are fully satisfied
**Score 0.8**: Most requirements satisfied, minor issues
**Score 0.5**: Some requirements satisfied, significant issues  
**Score 0.0**: Most requirements not satisfied or instruction misunderstood

### Evaluation Instructions

You are evaluating an AI assistant's response to a complex instruction-following task.

**Original Instruction**:
```
I'm writing a paper for school about traditional movies, television, and music and show their influence on anime. The topic is fun but needs to be academic to show proper homage and tropes. I need brainstorm ideas and organization. The anime I'm focusing on is Cowboy Bebop. The topic should cover the show as a whole, as well as focus on the 6 main characters: Spike, Jet, Faye, Ed, Vicious, and Julia. For each character, list movie and television references for design. Each item on the list shoul
```

**Task**: Read the response from `answer.txt` and determine if it fully satisfies ALL requirements.

**Output Format**:
```json
{
  "instruction_followed": <score between 0.0 and 1.0>,
  "explanation": "Brief explanation of which requirements were met or missed"
}
```
