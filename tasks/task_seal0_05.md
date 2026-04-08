---
id: task_seal0_05
name: SEAL-0 - Science & Technology Question
category: search_qa
level: L3
grading_type: llm_judge
timeout_seconds: 360
environment:
  type: sandbox
  requirements:
    - web_search
workspace_files: []
---

## Prompt

What is the sum of all three-letter Roman numerals that read the same forwards and backwards?

Write your answer to `answer.txt` in the workspace. Provide a concise, factual answer.

## Expected Behavior

1. Analyze the question to understand what information is needed
2. Use web search to find relevant information
3. Evaluate search results critically (they may be conflicting or noisy)
4. Provide a concise, accurate answer written to answer.txt

## Grading Criteria

- [ ] correct_answer: The answer is factually correct (CORRECT) or at least not contradictory (NOT_ATTEMPTED)

## LLM Judge Rubric

### Criterion 1: Answer Correctness (Weight: 100%)

Grade the predicted answer as one of: **CORRECT**, **INCORRECT**, or **NOT_ATTEMPTED**.

**Definitions:**

- **CORRECT (Score 1.0)**: The answer fully contains the important information in the reference answer and contains no information that contradicts it. 
  - Semantic meaning matters; capitalization, punctuation, grammar, and order don't matter.
  - Hedging is permissible (e.g., "I'm not sure, but I think...") provided the reference answer is fully included and the response contains no incorrect information.
  - The answer may contain additional information as long as it doesn't contradict the reference.

- **NOT_ATTEMPTED (Score 0.5)**: The important information in the reference answer is not included in the answer, BUT no statements in the answer contradict the reference.
  - Examples: "I don't know", "I need more context", partial answers that don't contradict.

- **INCORRECT (Score 0.0)**: A factual statement in the answer contradicts the reference answer.
  - Even hedged incorrect statements (e.g., "it's possible that...") are considered incorrect if they contradict the reference.

**Special Rules:**
- For people's names: Do not punish for typos if it's clearly the same name (e.g., "Kazakhstan" vs "Kazakstan").
- For numerical answers: Allow for minor rounding differences (e.g., "18" matches "18 countries").
- The reference answer may contain more information than the question asks; the predicted answer only needs to contain the information that is in the question.
- Omitting information that would be clearly inferred from the question is acceptable (e.g., answering "San Francisco" when reference is "San Francisco, California" for "What city..." question).

**Reference Answer**: "5442"

**Scoring Mapping:**
- Grade as CORRECT → Score: 1.0
- Grade as NOT_ATTEMPTED → Score: 0.5  
- Grade as INCORRECT → Score: 0.0
