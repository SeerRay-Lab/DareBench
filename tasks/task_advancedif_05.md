---
id: task_advancedif_05
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

I need help establishing a company that provides in-depth analyses using only a person's birth date, time, and location. Can you outline a template for generating these types of reports? I need it to start with a section explaining the importance of the "top three" (Sun, Moon, Rising). Then, it should go into a detailed description of planetary placements and their meanings in each house. The outline must be a balance between a birth chart (personality overview), synastry report (what to look for in a partner) and transit report (personalized predictions based on today's astrology) for the next year. Conclude the birth chart report section with an overview on the four elements found within the person's chart and what this could mean if there's a lot or a lack of a specific element. Make sure the synastry report section places equal emphasis on what to look for in friends as it does for partners. The transit section with the predictions needs to be written in weekly increments for the upcoming year.

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

1. Does the model provide an outline for a template to create an in-depth birth chart report?
2. Does the model begin the outline with a section explaining the importance of the top three (Sun, Moon, Rising)?
3. Is this section followed by a spot for detailed descriptions of planetary placements and the meanings they hold in each house?
4. Is the outline a balance between a personality overview, what to look for in a partner, and personalized predictions for the next year?
5. Does the first section (neonatal birth chart) conclude with an overview of the four elements found in the birth chart and what this could mean?
6. Does the second section (synastry report) put as much emphasis on what to look for in a friend than it does what to look for in a partner?
7. Is the third section (transit report) formatted into 52 one-week portions?

**Score 1.0**: All 7 requirements are fully satisfied
**Score 0.8**: Most requirements satisfied, minor issues
**Score 0.5**: Some requirements satisfied, significant issues  
**Score 0.0**: Most requirements not satisfied or instruction misunderstood

### Evaluation Instructions

You are evaluating an AI assistant's response to a complex instruction-following task.

**Original Instruction**:
```
I need help establishing a company that provides in-depth analyses using only a person's birth date, time, and location. Can you outline a template for generating these types of reports? I need it to start with a section explaining the importance of the "top three" (Sun, Moon, Rising). Then, it should go into a detailed description of planetary placements and their meanings in each house. The outline must be a balance between a birth chart (personality overview), synastry report (what to look fo
```

**Task**: Read the response from `answer.txt` and determine if it fully satisfies ALL requirements.

**Output Format**:
```json
{
  "instruction_followed": <score between 0.0 and 1.0>,
  "explanation": "Brief explanation of which requirements were met or missed"
}
```
