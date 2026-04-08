---
id: task_longbench_01
name: "LongBench-v2 Sample 1 (Multi-Document QA)"
category: multi_doc_qa
grading_type: llm_judge
timeout_seconds: 480
workspace_files:
  - source: longbench/longbench_01_context.txt
    dest: context.txt
---

## Prompt

Read the following text and answer the question below.

The context is provided in the file 'context.txt' in your workspace.

Question: A developing African nation, rich in fossil fuel resources and dependent on their export for over 60% of its GDP, aims to meet its 2050 carbon-neutrality pledge. The country faces significant challenges, including limited fiscal space, an underdeveloped transport infrastructure, and a workforce heavily reliant on fossil fuel industries. To meet its sustainability targets, the government is considering integrating both Carbon Capture and Storage (CCS) technologies and transportation decarbonisation strategies. However, the country must balance its short-term economic stability with long-term sustainability and avoid the risk of stranded assets in fossil fuel industries.

Given the technological advancements in CCS and the financial and infrastructural constraints around transport decarbonisation, which of the following integrated policy strategies would best support this country in balancing economic growth, job security, and decarbonisation?

Choices:
(A) Leverage fossil fuel revenues to build renewable energy infrastructure rapidly while using CCS to decarbonise fossil fuel power plants and heavy industries. Simultaneously, impose stringent emissions standards and tariffs on imported fossil-fuel-powered vehicles to accelerate the adoption of electric vehicles (EVs). Redirect fossil fuel profits into public transportation electrification and infrastructure development in urban areas.
(B) Use international climate finance to fund the broad implementation of CCS across the energy and transportation sectors, with priority on capturing emissions from road and rail transport. Simultaneously, implement a gradual phase-out of fossil fuel subsidies and allocate those savings to workforce retraining programs that transition workers from fossil fuel industries into the renewable energy sector and EV infrastructure projects.
(C) Invest heavily in CCS for the energy and industrial sectors to capture emissions from fossil fuel production and power generation, while delaying the full electrification of the transport sector until renewable energy capacity and grid stability are improved. In parallel, use fossil fuel revenues to establish a sovereign wealth fund dedicated to future investments in green technologies, such as domestic EV production.
(D) Establish a comprehensive green bond initiative, leveraging international capital markets to fund both large-scale CCS and public transport electrification projects. Focus on developing CCS primarily for the industrial sector (cement, steel, and chemicals) while incentivising private sector investment in electric vehicle infrastructure. Maintain current levels of fossil fuel exports, using revenues for sovereign wealth investment in future green energy transitions.

Think step by step, then provide your answer.

IMPORTANT:
1. First explain your reasoning process
2. Then provide your final answer in the format: "The correct answer is (X)" where X is A, B, C, or D
3. Write your complete response to 'answer.txt' in the workspace

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

The agent should:
1. Read the context.txt file to understand the background information
2. Analyze the question and four choices carefully
3. Use reasoning to determine the correct answer
4. Write a response to answer.txt that includes:
   - Step-by-step reasoning process
   - Final answer in the format "The correct answer is (X)"

The correct answer is (C): Invest heavily in CCS for the energy and industrial sectors to capture emissions from fossil fuel production and power generation, while delaying the full electrification of the transport sector until renewable energy capacity and grid stability are improved. In parallel, use fossil fuel revenues to establish a sovereign wealth fund dedicated to future investments in green technologies, such as domestic EV production.

## Grading Criteria

- [ ] answer_written: Agent wrote a response to answer.txt
- [ ] answer_correct: The final answer matches the expected answer (C)

## LLM Judge Rubric

### Reference Information (For Judge Only)

**Question**: A developing African nation, rich in fossil fuel resources and dependent on their export for over 60% of its GDP, aims to meet its 2050 carbon-neutrality pledge. The country faces significant challenges, including limited fiscal space, an underdeveloped transport infrastructure, and a workforce heavily reliant on fossil fuel industries. To meet its sustainability targets, the government is considering integrating both Carbon Capture and Storage (CCS) technologies and transportation decarbonisation strategies. However, the country must balance its short-term economic stability with long-term sustainability and avoid the risk of stranded assets in fossil fuel industries.

Given the technological advancements in CCS and the financial and infrastructural constraints around transport decarbonisation, which of the following integrated policy strategies would best support this country in balancing economic growth, job security, and decarbonisation?

**Choices**:
- (A) Leverage fossil fuel revenues to build renewable energy infrastructure rapidly while using CCS to decarbonise fossil fuel power plants and heavy industries. Simultaneously, impose stringent emissions standards and tariffs on imported fossil-fuel-powered vehicles to accelerate the adoption of electric vehicles (EVs). Redirect fossil fuel profits into public transportation electrification and infrastructure development in urban areas.
- (B) Use international climate finance to fund the broad implementation of CCS across the energy and transportation sectors, with priority on capturing emissions from road and rail transport. Simultaneously, implement a gradual phase-out of fossil fuel subsidies and allocate those savings to workforce retraining programs that transition workers from fossil fuel industries into the renewable energy sector and EV infrastructure projects.
- (C) Invest heavily in CCS for the energy and industrial sectors to capture emissions from fossil fuel production and power generation, while delaying the full electrification of the transport sector until renewable energy capacity and grid stability are improved. In parallel, use fossil fuel revenues to establish a sovereign wealth fund dedicated to future investments in green technologies, such as domestic EV production.
- (D) Establish a comprehensive green bond initiative, leveraging international capital markets to fund both large-scale CCS and public transport electrification projects. Focus on developing CCS primarily for the industrial sector (cement, steel, and chemicals) while incentivising private sector investment in electric vehicle infrastructure. Maintain current levels of fossil fuel exports, using revenues for sovereign wealth investment in future green energy transitions.

**Ground Truth Answer**: (C) Invest heavily in CCS for the energy and industrial sectors to capture emissions from fossil fuel production and power generation, while delaying the full electrification of the transport sector until renewable energy capacity and grid stability are improved. In parallel, use fossil fuel revenues to establish a sovereign wealth fund dedicated to future investments in green technologies, such as domestic EV production.

**Domain**: Multi-Document QA
**Sub-domain**: Financial
**Difficulty**: hard

---

### Criterion: Answer Correctness (Weight: 100%)

Compare the agent's final answer with the Ground Truth Answer above.

**Score 1.0**: The agent's answer matches the Ground Truth Answer (C). The agent correctly identified "(C)" as the answer.

**Score 0.0**: The agent's answer does NOT match the Ground Truth Answer. This includes:
- The agent selected a different option (not C)
- The agent did not provide a clear answer
- The answer is unrelated to the question

## Additional Notes

- Original LongBench-v2 ID: 66fa0d88bb02136c067c5a8a
- Domain: Multi-Document QA
- Sub-domain: Financial
- Difficulty: hard
- Length category: long
- Context saved to: assets/longbench/longbench_01_context.txt
