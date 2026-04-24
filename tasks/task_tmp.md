---
id: task_tmp
name: CharXiv - Cs Chart (20)
category: visual_qa
grading_type: llm_judge
timeout_seconds: 300
workspace_files:
  - source: charxiv/0.jpg
    dest: chart.jpg
---

## Prompt
你现在具备哪些工具，web_browser有嘛，如果有，帮我用这个工具搜一下小米今日股价；不准用web_search等其他工具

## Grading Criteria

- [ ] correct_answer: The answer in answer.txt correctly addresses the question based on the chart

## LLM Judge Rubric

### Reference Information (For Judge Only)

**Question**: Which model shows a greater decline in accuracy from Session 1 to Session 9 in the 5-way full-shot scenario?

**Expected Answer**: Joint-CNN

**Category**: cs
**Year**: 2020

---

### Criterion: Answer Correctness (Weight: 100%)

Compare the agent's answer with the Expected Answer above.

For this visual QA question based on an academic chart:
- The agent should provide a concise answer based on the chart content
- Equivalent forms of the answer are acceptable (e.g., "94" vs "94%", "(b)" vs "b" vs "option b")
- The answer should accurately reflect the information in the chart

**Score 1.0**: The agent's answer is correct and matches the Expected Answer (or an equivalent form).

**Score 0.0**: The agent's answer is incorrect, does not match the Expected Answer, or is unrelated to the question.
