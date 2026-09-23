/*
 * DAREBench project page — single source of truth for every number and paper text.
 * Paper is authoritative (arXiv 2609.06059v1). Built by homepage/tools/data_build/build_data.py
 * from paper.html (tables parsed programmatically) + the read-only DareBench repo.
 *
 *   meta         title, authors {name, affils[], equalContribution, corresponding}, affiliations, links, bibtex, abstract, taglines, why (3 questions)
 *   stats        headline counts (233 tasks, 22 sources, 35 models, 7,587 runs, 3,340 judge calls, 182 flagged, 143 removed, MAE), runtime
 *   groupOrder   fixed order of the 6 workload groups: text-ss, text-ms, text-mt, mm-ss, mm-ms, mm-mt
 *   groups       {key, label, longLabel, modality, form, count, scoring{auto,judge,hybrid} (Table 8), sources[], best}
 *   sources      22 source benchmarks (Table 9 + §F.3): {key, name, fullName, capability, count, group, scoring, scoringModes, description, citation, repoCount, repoScoring}
 *   vendors      fixed vendor order (fold into labels; do not use as >8 colors)
 *   models       35 models (Table 1 order): acc{group}, textAvg, mmAvg, overall (+overallSource), tokens{..} in k, cost{..} USD,
 *                costText (paper strings, e.g. '<0.001'), price (Table 7), ctx (Table 6, local only), errors (Table 5), fig1/paretoFig1 flags
 *   pareto       Fig. 1 frontiers exactly as captioned + models plotted per panel
 *   audit        Table 3 hallucination patterns + funnel + MAE
 *   errorTaxonomy Table 4 codes + Table 5 per-model counts
 *   findings     faithful statements of the paper's findings with supporting numbers
 *   caseStudy    figure files in shared/img with verbatim captions + alt text; appendix cases
 *   quickstart   README commands (verbatim), skills, CLI flag table; paperSkills = the 9 skills in §A.2
 *   taskAnatomy  one real task file (answer redacted) mapped to tau = (p, W0, T, C, G, t_max)
 *   tasks        metadata of all 233 repo tasks (no prompts); group/scoring from the PAPER's source mapping
 *   examples     12 prompt excerpts (2 per group), no answers; images copied to shared/img/examples/
 *   discrepancies  paper-vs-paper / paper-vs-code notes for maintainers — NEVER display
 *   provenance   units, rules, and the list of passed cross-checks
 */
window.DARE = {
 "meta": {
  "title": "DAREBench: Deployment-Aware and Reliable Evaluation of Models as Agents",
  "shortName": "DAREBench",
  "expansion": "Deployment-Aware and Reliable Evaluation of Models as Agents",
  "taglines": [
   "A workload- and deployment-aware benchmark for evaluating models as agents.",
   "233 agent tasks from 22 source benchmarks, organized into a 2×3 workload matrix and run in one shared OpenClaw environment.",
   "No single model dominates all workload groups.",
   "Model selection should consider workload profiles, deployment mode, and accuracy–cost trade-offs rather than a single aggregate score."
  ],
  "taglineSources": [
   "§5 Conclusion",
   "§1 / Abstract",
   "Abstract",
   "Abstract"
  ],
  "arxivId": "2609.06059",
  "arxivVersion": "v1",
  "arxivCategory": "cs.AI",
  "arxivDate": "5 Sep 2026",
  "arxivUrl": "https://arxiv.org/abs/2609.06059",
  "pdfUrl": "https://arxiv.org/pdf/2609.06059",
  "htmlUrl": "https://arxiv.org/html/2609.06059v1",
  "github": "https://github.com/SeerRay-Lab/DareBench",
  "authors": [
   {
    "name": "Yu Liu",
    "affils": [
     1,
     2,
     3
    ],
    "equalContribution": true,
    "corresponding": true
   },
   {
    "name": "Zhilin Liu",
    "affils": [
     3
    ],
    "equalContribution": true,
    "corresponding": false
   },
   {
    "name": "Zhiwei Yang",
    "affils": [
     1,
     2,
     3
    ],
    "equalContribution": true,
    "corresponding": false
   },
   {
    "name": "Shaojie Zhang",
    "affils": [
     3
    ],
    "equalContribution": true,
    "corresponding": false
   },
   {
    "name": "Zheyuan Deng",
    "affils": [
     4
    ],
    "equalContribution": false,
    "corresponding": false
   },
   {
    "name": "Tingwei Huang",
    "affils": [
     3
    ],
    "equalContribution": false,
    "corresponding": false
   },
   {
    "name": "Zhenbo Luo",
    "affils": [
     3
    ],
    "equalContribution": false,
    "corresponding": false
   },
   {
    "name": "Lei Jiang",
    "affils": [
     1,
     2
    ],
    "equalContribution": false,
    "corresponding": false
   },
   {
    "name": "Yanbing Liu",
    "affils": [
     2
    ],
    "equalContribution": false,
    "corresponding": false
   },
   {
    "name": "Pei Fu",
    "affils": [
     3
    ],
    "equalContribution": false,
    "corresponding": true
   }
  ],
  "authorNotes": {
   "equalContribution": "These authors contributed equally.",
   "corresponding": "Corresponding author.",
   "equalSymbol": "∗",
   "correspondingSymbol": "†"
  },
  "affiliations": [
   {
    "id": 1,
    "name": "Institute of Information Engineering, Chinese Academy of Sciences"
   },
   {
    "id": 2,
    "name": "School of Cyber Security, University of Chinese Academy of Sciences"
   },
   {
    "id": 3,
    "name": "MiLM Plus, Xiaomi Inc."
   },
   {
    "id": 4,
    "name": "Department of Computer Science, Brown University"
   }
  ],
  "bibtex": "@article{liu2026darebench,\n  title   = {DAREBench: Deployment-Aware and Reliable Evaluation of Models as Agents},\n  author  = {Liu, Yu and Liu, Zhilin and Yang, Zhiwei and Zhang, Shaojie and Deng, Zheyuan and Huang, Tingwei and Luo, Zhenbo and Jiang, Lei and Liu, Yanbing and Fu, Pei},\n  journal = {arXiv preprint arXiv:2609.06059},\n  year    = {2026}\n}",
  "abstract": "As large language models evolve from question-answering systems into general-purpose agents, evaluation must move beyond static answer correctness to assess multimodal perception, multi-step execution, tool use, and artifact delivery. However, existing benchmarks are often tied to specific task types, execution environments, or scoring protocols, limiting their comparability, interpretability, and reliability for deployment decisions. We introduce DAREBench (Deployment-Aware and Reliable Evaluation of Models as Agents), a benchmark designed to capture workload variation and support reliable agent evaluation. Built on a shared OpenClaw execution environment, DAREBench organizes 233 tasks selected and adapted from 22 source benchmarks into a 2×3 workload matrix defined by input modality and execution form, and evaluates them under a unified contract-based protocol with evidence-based score auditing. We evaluate 23 commercial API models and 12 locally deployed open-weight models over 7,587 model–task runs, reporting accuracy and token consumption alongside reference costs for API models. Results show that no single model dominates all workload groups, text and multimodal tasks exhibit distinct accuracy–cost trade-offs, and local open-weight models are competitive in several groups but still trail frontier commercial models overall. These findings suggest that agent deployment and model selection should consider workload profiles, deployment mode, and accuracy–cost trade-offs rather than rely on a single aggregate score.",
  "abstractLinkSentence": "The benchmark details can be found at https://github.com/SeerRay-Lab/DAREBench.",
  "why": [
   {
    "key": "interpretable",
    "question": "Are the results interpretable?",
    "problem": "Agent tasks differ substantially in input modality, execution process, and tool dependence; a single aggregate score can obscure model strengths and weaknesses across workloads.",
    "answer": "A 2×3 workload matrix (text / multimodal × single-step / multi-step / multi-step+tools) with per-group reporting."
   },
   {
    "key": "attributable",
    "question": "Are comparisons attributable?",
    "problem": "When tasks rely on different agent frameworks, tool interfaces, and execution protocols, observed differences conflate model capability with runtime compatibility.",
    "answer": "One shared OpenClaw runtime (common agent loop, tool interface, workspace abstraction, logging) plus task contracts specifying workspace, tools, artifacts, scorer, and time budget."
   },
   {
    "key": "trustworthy",
    "question": "Are the scores trustworthy?",
    "problem": "Matching only the final text cannot verify completion, and an LLM judge may award credit when tools were not executed, the task timed out, or required artifacts were missing.",
    "answer": "Evidence-based audit: deterministic post-hoc rules flag suspicious positive scores and a meta-judge from a different model family checks them against trajectories and artifacts."
   }
  ],
  "whySource": "§1 Introduction (three questions) and §3.3"
 },
 "stats": {
  "tasks": 233,
  "textTasks": 162,
  "mmTasks": 71,
  "sources": 22,
  "groups": 6,
  "models": 35,
  "apiModels": 23,
  "localModels": 12,
  "apiFamilies": 10,
  "textOnlyModels": 8,
  "multimodalModels": 27,
  "runs": 7587,
  "judgeCalls": 3340,
  "flagged": 182,
  "unsupportedRemoved": 143,
  "flaggedUpheld": 39,
  "maeJudge": 0.098,
  "maeMeta": 0.049,
  "maeN": 100,
  "primaryJudge": "Qwen3.5-VL-Plus",
  "metaJudge": "Claude-Opus-4.6",
  "scoring": {
   "auto": 125,
   "judge": 73,
   "hybrid": 35,
   "autoPct": 53.6,
   "judgePct": 31.3,
   "hybridPct": 15.0
  },
  "runtime": {
   "openclaw": "2026.3.20",
   "vllm": "0.19.0",
   "cuda": "13.1",
   "os": "Ubuntu 24.04.4 LTS",
   "seed": 42,
   "gpu": "NVIDIA RTX PRO 6000",
   "gpuVramGB": 96,
   "localPrecision": "FP16",
   "localContext": "32K",
   "localServing": "vLLM, single GPU, no quantization or tensor parallelism, prefix caching enabled",
   "apiAccess": "OpenRouter",
   "webSearch": "web_search (Brave Search)",
   "webFetch": "web_fetch (URL-to-markdown)",
   "clawhubSkillsInPaper": 9
  },
  "notes": {
   "flaggedUpheld": "derived: 182 flagged - 143 confirmed (retained after meta-judge review); not stated as a number in the paper",
   "textTasks": "Text-SS+Text-MS+Text-MT = 20+87+55",
   "mmTasks": "MM-SS+MM-MS+MM-MT = 20+26+25"
  }
 },
 "groupOrder": [
  "text-ss",
  "text-ms",
  "text-mt",
  "mm-ss",
  "mm-ms",
  "mm-mt"
 ],
 "groups": [
  {
   "key": "text-ss",
   "label": "Text-SS",
   "longLabel": "Text · Single-Step",
   "paperHeading": "Text Single-Step (Text-SS)",
   "modality": "text",
   "form": "single-step",
   "count": 20,
   "scoring": {
    "auto": 10,
    "judge": 0,
    "hybrid": 10
   },
   "sources": [
    "logiqa",
    "gpqa"
   ],
   "applicableModels": 35,
   "best": {
    "model": "Claude-Opus-4.8",
    "acc": 98.8
   }
  },
  {
   "key": "text-ms",
   "label": "Text-MS",
   "longLabel": "Text · Multi-Step",
   "paperHeading": "Text Multi-Step (Text-MS)",
   "modality": "text",
   "form": "multi-step",
   "count": 87,
   "scoring": {
    "auto": 64,
    "judge": 23,
    "hybrid": 0
   },
   "sources": [
    "advancedif",
    "bamboogle",
    "simpleqa",
    "longbench",
    "lexeval",
    "tablebench",
    "finqa"
   ],
   "applicableModels": 35,
   "best": {
    "model": "GPT-5.5",
    "acc": 83.6
   }
  },
  {
   "key": "text-mt",
   "label": "Text-MT",
   "longLabel": "Text · Multi-Step+Tools",
   "paperHeading": "Text Multi-Step+Tools (Text-MT)",
   "modality": "text",
   "form": "multi-step+tools",
   "count": 55,
   "scoring": {
    "auto": 35,
    "judge": 20,
    "hybrid": 0
   },
   "sources": [
    "deepsearchqa",
    "widesearch",
    "seal0",
    "terminalbench2",
    "openagentsafety",
    "osworld"
   ],
   "applicableModels": 35,
   "best": {
    "model": "Claude-Opus-4.8",
    "acc": 65.3
   }
  },
  {
   "key": "mm-ss",
   "label": "MM-SS",
   "longLabel": "Multi-Modal · Single-Step",
   "paperHeading": "Multi-Modal Single-Step (MM-SS)",
   "modality": "multimodal",
   "form": "single-step",
   "count": 20,
   "scoring": {
    "auto": 0,
    "judge": 20,
    "hybrid": 0
   },
   "sources": [
    "simplevqa",
    "hle"
   ],
   "applicableModels": 27,
   "best": {
    "model": "GPT-5.5",
    "acc": 90.0
   }
  },
  {
   "key": "mm-ms",
   "label": "MM-MS",
   "longLabel": "Multi-Modal · Multi-Step",
   "paperHeading": "Multi-Modal Multi-Step (MM-MS)",
   "modality": "multimodal",
   "form": "multi-step",
   "count": 26,
   "scoring": {
    "auto": 16,
    "judge": 10,
    "hybrid": 0
   },
   "sources": [
    "charxiv",
    "medxpertqa"
   ],
   "applicableModels": 27,
   "best": {
    "model": "Gemini-3.1-Pro",
    "acc": 88.5
   }
  },
  {
   "key": "mm-mt",
   "label": "MM-MT",
   "longLabel": "Multi-Modal · Multi-Step+Tools",
   "paperHeading": "Multi-Modal Multi-Step+Tools (MM-MT)",
   "modality": "multimodal",
   "form": "multi-step+tools",
   "count": 25,
   "scoring": {
    "auto": 0,
    "judge": 0,
    "hybrid": 25
   },
   "sources": [
    "agentvista",
    "mmsearch",
    "mmsearchplus"
   ],
   "applicableModels": 27,
   "best": {
    "model": "Claude-Opus-4.8",
    "acc": 61.8
   }
  }
 ],
 "sources": [
  {
   "key": "logiqa",
   "name": "LogiQA",
   "capability": "Reading comprehension with logical reasoning",
   "count": 10,
   "group": "text-ss",
   "scoring": "Auto",
   "scoringModes": {
    "auto": 10,
    "judge": 0,
    "hybrid": 0
   },
   "fullName": "LogiQA",
   "description": "LogiQA is a reading-comprehension benchmark for logical reasoning, where each instance provides a short passage and a multiple-choice question whose correct answer requires identifying the logical structure (premise, conclusion, assumption) of the argument.",
   "citation": {
    "text": "Liu et al. 2020",
    "title": "LogiQA: a challenge dataset for machine reading comprehension with logical reasoning",
    "authors": "J. Liu, L. Cui, H. Liu, D. Huang, Y. Wang, and Y. Zhang",
    "venue": "In Proceedings of the Twenty-Ninth International Joint Conference on Artificial Intelligence, IJCAI-20",
    "url": null
   },
   "repoCount": 10,
   "repoScoring": {
    "auto": 10,
    "judge": 0,
    "hybrid": 0
   },
   "repoWithImage": 0
  },
  {
   "key": "gpqa",
   "name": "GPQA",
   "capability": "Graduate-level science multiple-choice",
   "count": 10,
   "group": "text-ss",
   "scoring": "Hybrid",
   "scoringModes": {
    "auto": 0,
    "judge": 0,
    "hybrid": 10
   },
   "fullName": "GPQA (Graduate-Level Google-Proof Q&A)",
   "description": "GPQA (Graduate-Level Google-Proof Q&A) contains Ph.D.-level science questions in biology, chemistry, and physics that are resistant to web search; answering them correctly requires expert-level domain knowledge and multi-step reasoning rather than retrieval.",
   "citation": {
    "text": "Rein et al. 2024",
    "title": "GPQA: a graduate-level google-proof Q&A benchmark",
    "authors": "D. Rein, B. L. Hou, A. C. Stickland, J. Petty, R. Y. Pang, J. Dirani, J. Michael, and S. R. Bowman",
    "venue": "In First Conference on Language Modeling",
    "url": null
   },
   "repoCount": 10,
   "repoScoring": {
    "auto": 0,
    "judge": 0,
    "hybrid": 10
   },
   "repoWithImage": 0
  },
  {
   "key": "advancedif",
   "name": "AdvancedIF",
   "capability": "Complex multi-constraint instruction following",
   "count": 10,
   "group": "text-ms",
   "scoring": "Judge",
   "scoringModes": {
    "auto": 0,
    "judge": 10,
    "hybrid": 0
   },
   "fullName": "AdvancedIF",
   "description": "AdvancedIF targets complex instruction following with dozens of verifiable constraints per instruction (e.g., length, keyword, formatting, and structural requirements), testing a model’s ability to satisfy all constraints simultaneously in a single response.",
   "citation": {
    "text": "He et al. 2025",
    "title": "Advancedif: rubric-based benchmarking and reinforcement learning for advancing llm instruction following",
    "authors": "Y. He, W. Li, H. Zhang, S. Li, K. Mandyam, S. Khosla, Y. Xiong, N. Wang, X. Peng, B. Li, et al.",
    "venue": "arXiv preprint arXiv:2511.10507",
    "url": null
   },
   "repoCount": 10,
   "repoScoring": {
    "auto": 0,
    "judge": 10,
    "hybrid": 0
   },
   "repoWithImage": 0
  },
  {
   "key": "bamboogle",
   "name": "Bamboogle",
   "capability": "Multi-hop question answering",
   "count": 10,
   "group": "text-ms",
   "scoring": "Auto",
   "scoringModes": {
    "auto": 10,
    "judge": 0,
    "hybrid": 0
   },
   "fullName": "Bamboogle",
   "description": "Bamboogle is a multi-hop question-answering dataset in which each question requires chaining two or more Wikipedia facts; the answer is not directly retrievable and demands cross-document reasoning.",
   "citation": {
    "text": "Press et al. 2023",
    "title": "Measuring and narrowing the compositionality gap in language models",
    "authors": "O. Press, M. Zhang, S. Min, L. Schmidt, N. A. Smith, and M. Lewis",
    "venue": "In Findings of the Association for Computational Linguistics: EMNLP 2023",
    "url": null
   },
   "repoCount": 10,
   "repoScoring": {
    "auto": 10,
    "judge": 0,
    "hybrid": 0
   },
   "repoWithImage": 0
  },
  {
   "key": "simpleqa",
   "name": "SimpleQA",
   "capability": "Short-form fact-seeking QA",
   "count": 10,
   "group": "text-ms",
   "scoring": "Auto",
   "scoringModes": {
    "auto": 10,
    "judge": 0,
    "hybrid": 0
   },
   "fullName": "SimpleQA",
   "description": "SimpleQA is a short-form fact-seeking benchmark where each question has a single, unambiguous answer; it emphasizes precision and resistance to confabulation on entities, dates, and numerical facts.",
   "citation": {
    "text": "Wei et al. 2024",
    "title": "Measuring short-form factuality in large language models",
    "authors": "J. Wei, K. Nguyen, H. W. Chung, Y. J. Jiao, S. Papay, A. Glaese, J. Schulman, and W. Fedus",
    "venue": "arXiv preprint arXiv:2411.04368",
    "url": null
   },
   "repoCount": 10,
   "repoScoring": {
    "auto": 10,
    "judge": 0,
    "hybrid": 0
   },
   "repoWithImage": 0
  },
  {
   "key": "longbench",
   "name": "LongBench",
   "capability": "Long-context understanding and retrieval",
   "count": 10,
   "group": "text-ms",
   "scoring": "Judge",
   "scoringModes": {
    "auto": 0,
    "judge": 10,
    "hybrid": 0
   },
   "fullName": "LongBench",
   "description": "LongBench is a long-context benchmark covering summarization, retrieval, and reasoning over documents of up to tens of thousands of tokens; it evaluates a model’s ability to locate and synthesize information dispersed across long inputs.",
   "citation": {
    "text": "Bai et al. 2025c",
    "title": "Longbench v2: towards deeper understanding and reasoning on realistic long-context multitasks",
    "authors": "Y. Bai, S. Tu, J. Zhang, H. Peng, X. Wang, X. Lv, S. Cao, J. Xu, L. Hou, Y. Dong, et al.",
    "venue": "In Proceedings of the 63rd Annual Meeting of the Association for Computational Linguistics",
    "url": null
   },
   "repoCount": 10,
   "repoScoring": {
    "auto": 0,
    "judge": 10,
    "hybrid": 0
   },
   "repoWithImage": 0
  },
  {
   "key": "lexeval",
   "name": "LexEval",
   "capability": "Legal-domain evaluation",
   "count": 20,
   "group": "text-ms",
   "scoring": "Auto",
   "scoringModes": {
    "auto": 20,
    "judge": 0,
    "hybrid": 0
   },
   "fullName": "LexEval",
   "description": "LexEval is a comprehensive legal-domain evaluation suite covering legal knowledge, statute comprehension, and legal reasoning; it tests domain-specific terminology and normative reasoning ability.",
   "citation": {
    "text": "Li et al. 2024",
    "title": "Lexeval: a comprehensive chinese legal benchmark for evaluating large language models",
    "authors": "H. Li, Y. Chen, Q. Ai, Y. Wu, R. Zhang, and Y. Liu",
    "venue": "Advances in Neural Information Processing Systems",
    "url": null
   },
   "repoCount": 20,
   "repoScoring": {
    "auto": 20,
    "judge": 0,
    "hybrid": 0
   },
   "repoWithImage": 0
  },
  {
   "key": "tablebench",
   "name": "TableBench",
   "capability": "Table understanding and numerical reasoning",
   "count": 17,
   "group": "text-ms",
   "scoring": "Auto (14) / Judge (3)",
   "scoringModes": {
    "auto": 14,
    "judge": 3,
    "hybrid": 0
   },
   "fullName": "TableBench",
   "description": "TableBench is a table-understanding benchmark with diverse table structures and question types (lookup, aggregation, comparison, trend analysis), requiring both precise cell localization and multi-step numerical reasoning.",
   "citation": {
    "text": "Wu et al. 2025",
    "title": "TableBench: a comprehensive and complex benchmark for table question answering",
    "authors": "X. Wu, J. Yang, L. Chai, G. Zhang, J. Liu, X. Du, D. Liang, D. Shu, X. Cheng, T. Sun, T. Li, Z. Li, and G. Niu",
    "venue": "Proceedings of the AAAI Conference on Artificial Intelligence",
    "url": null
   },
   "repoCount": 17,
   "repoScoring": {
    "auto": 14,
    "judge": 3,
    "hybrid": 0
   },
   "repoWithImage": 0
  },
  {
   "key": "finqa",
   "name": "FinQA",
   "capability": "Financial question answering over tables",
   "count": 10,
   "group": "text-ms",
   "scoring": "Auto",
   "scoringModes": {
    "auto": 10,
    "judge": 0,
    "hybrid": 0
   },
   "fullName": "FinQA",
   "description": "FinQA is a financial question-answering dataset over earnings reports and financial tables; answering requires programmatic reasoning (e.g., computing ratios, growth rates) over tabular data accompanied by natural-language context.",
   "citation": {
    "text": "Chen et al. 2021",
    "title": "FinQA: a dataset of numerical reasoning over financial data",
    "authors": "Z. Chen, W. Chen, C. Smiley, S. Shah, I. Borova, D. Langdon, R. Moussa, M. Beane, T. Huang, B. Routledge, and W. Y. Wang",
    "venue": "In Proceedings of the 2021 Conference on Empirical Methods in Natural Language Processing",
    "url": null
   },
   "repoCount": 10,
   "repoScoring": {
    "auto": 10,
    "judge": 0,
    "hybrid": 0
   },
   "repoWithImage": 0
  },
  {
   "key": "deepsearchqa",
   "name": "DeepSearchQA",
   "capability": "Deep multi-step search-grounded QA",
   "count": 10,
   "group": "text-mt",
   "scoring": "Judge",
   "scoringModes": {
    "auto": 0,
    "judge": 10,
    "hybrid": 0
   },
   "fullName": "DeepSearchQA",
   "description": "DeepSearchQA is a deep search benchmark featuring hand-crafted, multi-step information-seeking tasks across 17 fields; unlike single-answer retrieval, it evaluates comprehensiveness and the ability to synthesize evidence from multiple retrieved sources.",
   "citation": {
    "text": "Gupta et al. 2026",
    "title": "DeepSearchQA: bridging the comprehensiveness gap for deep research agents",
    "authors": "N. Gupta, R. Chatterjee, L. Haas, C. Tao, A. Wang, C. Liu, H. Oiwa, E. Gribovskaya, J. Ackermann, J. Blitzer, et al.",
    "venue": "arXiv preprint arXiv:2601.20975",
    "url": null
   },
   "repoCount": 10,
   "repoScoring": {
    "auto": 0,
    "judge": 10,
    "hybrid": 0
   },
   "repoWithImage": 0
  },
  {
   "key": "widesearch",
   "name": "WideSearch",
   "capability": "Broad-scope information aggregation search",
   "count": 10,
   "group": "text-mt",
   "scoring": "Auto",
   "scoringModes": {
    "auto": 10,
    "judge": 0,
    "hybrid": 0
   },
   "fullName": "WideSearch",
   "description": "WideSearch probes broad-scope information aggregation: each task requires gathering and reconciling information from many independent sources, testing the breadth and coverage of a search-augmented agent.",
   "citation": {
    "text": "Wong et al. 2025",
    "title": "Widesearch: benchmarking agentic broad info-seeking",
    "authors": "R. Wong, J. Wang, J. Zhao, L. Chen, Y. Gao, L. Zhang, X. Zhou, Z. Wang, K. Xiang, G. Zhang, et al.",
    "venue": "arXiv preprint arXiv:2508.07999",
    "url": null
   },
   "repoCount": 10,
   "repoScoring": {
    "auto": 10,
    "judge": 0,
    "hybrid": 0
   },
   "repoWithImage": 0
  },
  {
   "key": "seal0",
   "name": "Seal0",
   "capability": "Search-augmented reasoning on ambiguous queries",
   "count": 10,
   "group": "text-mt",
   "scoring": "Judge",
   "scoringModes": {
    "auto": 0,
    "judge": 10,
    "hybrid": 0
   },
   "fullName": "Seal0",
   "description": "Seal0 is drawn from the SealQA benchmark for search-augmented language models; its core subset (Seal-0) contains questions specifically curated to be challenging for frontier models, often involving ambiguity, conflicting evidence, or noisy search results.",
   "citation": {
    "text": "Pham et al. 2026",
    "title": "SealQA: raising the bar for reasoning in search-augmented language models",
    "authors": "T. Pham, N. Nguyen, P. Zunjare, W. Chen, Y. Tseng, and T. Vu",
    "venue": "In The Fourteenth International Conference on Learning Representations",
    "url": null
   },
   "repoCount": 10,
   "repoScoring": {
    "auto": 0,
    "judge": 10,
    "hybrid": 0
   },
   "repoWithImage": 0
  },
  {
   "key": "terminalbench2",
   "name": "TerminalBench2",
   "capability": "Realistic CLI / shell task execution",
   "count": 10,
   "group": "text-mt",
   "scoring": "Auto",
   "scoringModes": {
    "auto": 10,
    "judge": 0,
    "hybrid": 0
   },
   "fullName": "TerminalBench2",
   "description": "TerminalBench2 is a command-line interface benchmark in which the agent must accomplish realistic system-administration, data-processing, and development tasks in a Linux terminal, requiring correct sequencing of shell commands and file operations.",
   "citation": {
    "text": "Merrill et al. 2026",
    "title": "Terminal-bench: benchmarking agents on hard, realistic tasks in command line interfaces",
    "authors": "M. A. Merrill, A. G. Shaw, N. Carlini, B. Li, H. Raj, I. Bercovich, L. Shi, J. Y. Shin, T. Walshe, E. K. Buchanan, et al.",
    "venue": "arXiv preprint arXiv:2601.11868",
    "url": null
   },
   "repoCount": 10,
   "repoScoring": {
    "auto": 10,
    "judge": 0,
    "hybrid": 0
   },
   "repoWithImage": 1
  },
  {
   "key": "openagentsafety",
   "name": "OpenAgentSafety",
   "capability": "Open-world agent safety scenarios",
   "count": 6,
   "group": "text-mt",
   "scoring": "Auto",
   "scoringModes": {
    "auto": 6,
    "judge": 0,
    "hybrid": 0
   },
   "fullName": "OpenAgentSafety",
   "description": "OpenAgentSafety evaluates open-world agent safety through scenarios in which an unconstrained agent may take harmful, reckless, or policy-violating actions; tasks test whether the agent completes the goal while respecting safety constraints.",
   "citation": {
    "text": "Vijayvargiya et al. 2026",
    "title": "OpenAgentSafety: a comprehensive framework for evaluating real-world AI agent safety",
    "authors": "S. Vijayvargiya, A. B. Soni, X. Zhou, Z. Z. Wang, N. Dziri, G. Neubig, and M. Sap",
    "venue": "In The Fourteenth International Conference on Learning Representations",
    "url": null
   },
   "repoCount": 6,
   "repoScoring": {
    "auto": 6,
    "judge": 0,
    "hybrid": 0
   },
   "repoWithImage": 0
  },
  {
   "key": "osworld",
   "name": "OSWorld",
   "capability": "Desktop automation and control",
   "count": 9,
   "group": "text-mt",
   "scoring": "Auto",
   "scoringModes": {
    "auto": 9,
    "judge": 0,
    "hybrid": 0
   },
   "fullName": "OSWorld",
   "description": "OSWorld is a desktop-environment benchmark where the agent controls a virtual operating system (files, applications) to accomplish real-world computer tasks; it demands pixel-level perception, cross-application planning, and long-horizon tool use.",
   "citation": {
    "text": "Xie et al. 2024",
    "title": "OSWorld: benchmarking multimodal agents for open-ended tasks in real computer environments",
    "authors": "T. Xie, D. Zhang, J. Chen, X. Li, S. Zhao, R. Cao, T. J. Hua, Z. Cheng, D. Shin, F. Lei, Y. Liu, Y. Xu, S. Zhou, S. Savarese, C. Xiong, V. Zhong, and T. Yu",
    "venue": "In Advances in Neural Information Processing Systems",
    "url": null
   },
   "repoCount": 9,
   "repoScoring": {
    "auto": 9,
    "judge": 0,
    "hybrid": 0
   },
   "repoWithImage": 1
  },
  {
   "key": "simplevqa",
   "name": "SimpleVQA",
   "capability": "Short-form visual fact-seeking QA",
   "count": 10,
   "group": "mm-ss",
   "scoring": "Judge",
   "scoringModes": {
    "auto": 0,
    "judge": 10,
    "hybrid": 0
   },
   "fullName": "SimpleVQA",
   "description": "SimpleVQA is a short-form visual fact-seeking benchmark in which each question is grounded in a single image and has one correct answer; it isolates visual entity recognition and fine-grained perception from multi-hop reasoning.",
   "citation": {
    "text": "Wang et al. 2025",
    "title": "VisualSimpleQA: a benchmark for decoupled evaluation of large vision-language models in fact-seeking question answering",
    "authors": "Y. Wang, Y. Zhao, X. Chen, S. Guo, L. Liu, H. Li, Y. Xiao, J. Zhang, Q. Li, and K. Xu",
    "venue": "arXiv preprint arXiv:2503.06492",
    "url": null
   },
   "repoCount": 10,
   "repoScoring": {
    "auto": 0,
    "judge": 10,
    "hybrid": 0
   },
   "repoWithImage": 10
  },
  {
   "key": "hle",
   "name": "HLE",
   "capability": "Humanity’s Last Exam (cross-discipline)",
   "count": 10,
   "group": "mm-ss",
   "scoring": "Judge",
   "scoringModes": {
    "auto": 0,
    "judge": 10,
    "hybrid": 0
   },
   "fullName": "HLE (Humanity’s Last Exam)",
   "description": "HLE (Humanity’s Last Exam) is a cross-discipline expert-level benchmark spanning mathematics, humanities, science, and professional domains; questions are designed to be resistant to web search and require deep reasoning, often grounded in images, diagrams, or specialized notation.",
   "citation": {
    "text": "Center for AI Safety et al. 2026",
    "title": "A benchmark of expert-level academic questions to assess AI capabilities",
    "authors": "Center for AI Safety, Scale AI, and HLE Contributors Consortium",
    "venue": "Nature",
    "url": null,
    "textPdf": "Center for AI Safety, Scale AI, and HLE Contributors Consortium 2026"
   },
   "repoCount": 10,
   "repoScoring": {
    "auto": 0,
    "judge": 10,
    "hybrid": 0
   },
   "repoWithImage": 2
  },
  {
   "key": "charxiv",
   "name": "CharXiv",
   "capability": "Academic figure and chart understanding",
   "count": 10,
   "group": "mm-ms",
   "scoring": "Judge",
   "scoringModes": {
    "auto": 0,
    "judge": 10,
    "hybrid": 0
   },
   "fullName": "CharXiv",
   "description": "CharXiv is a chart-understanding benchmark built from real arXiv figures; it asks questions that require reading legends, curves, axes, and annotations, testing fine-grained visual reasoning beyond simple OCR or caption matching.",
   "citation": {
    "text": "Wang et al. 2024",
    "title": "CharXiv: charting gaps in realistic chart understanding in multimodal llms",
    "authors": "Z. Wang, M. Xia, L. He, H. Chen, Y. Liu, R. Zhu, K. Liang, X. Wu, H. Liu, S. Malladi, et al.",
    "venue": "arXiv preprint arXiv:2406.18521",
    "url": null
   },
   "repoCount": 10,
   "repoScoring": {
    "auto": 0,
    "judge": 10,
    "hybrid": 0
   },
   "repoWithImage": 10
  },
  {
   "key": "medxpertqa",
   "name": "MedXpertQA",
   "capability": "Medical expert-level multimodal QA",
   "count": 16,
   "group": "mm-ms",
   "scoring": "Auto",
   "scoringModes": {
    "auto": 16,
    "judge": 0,
    "hybrid": 0
   },
   "fullName": "MedXpertQA",
   "description": "MedXpertQA is a medical expert-level multimodal QA benchmark covering clinical cases, pathology images, and diagnostic reasoning; it evaluates whether a model can reach expert-level conclusions from multimodal medical evidence.",
   "citation": {
    "text": "Zuo et al. 2025",
    "title": "MedXpertQA: benchmarking expert-level medical reasoning and understanding",
    "authors": "Y. Zuo, S. Qu, Y. Li, Z. Chen, X. Zhu, E. Hua, K. Zhang, N. Ding, and B. Zhou",
    "venue": "In Proceedings of the 42nd International Conference on Machine Learning",
    "url": null
   },
   "repoCount": 16,
   "repoScoring": {
    "auto": 16,
    "judge": 0,
    "hybrid": 0
   },
   "repoWithImage": 16
  },
  {
   "key": "agentvista",
   "name": "AgentVista",
   "capability": "Ultra-challenging multimodal agent tasks",
   "count": 10,
   "group": "mm-mt",
   "scoring": "Hybrid",
   "scoringModes": {
    "auto": 0,
    "judge": 0,
    "hybrid": 10
   },
   "fullName": "AgentVista",
   "description": "AgentVista is a benchmark for generalist multimodal agents on realistic, ultra-challenging tasks spanning 25 sub-domains; each task requires long-horizon, interleaved tool use grounded in rich visual evidence, testing perception, planning, and tool-use integration jointly.",
   "citation": {
    "text": "Su et al. 2026",
    "title": "Agentvista: evaluating multimodal agents in ultra-challenging realistic visual scenarios",
    "authors": "Z. Su, J. Gao, H. Guo, Z. Liu, L. Zhang, X. Geng, S. Huang, P. Xia, G. Jiang, C. Wang, et al.",
    "venue": "arXiv preprint arXiv:2602.23166",
    "url": null
   },
   "repoCount": 10,
   "repoScoring": {
    "auto": 0,
    "judge": 0,
    "hybrid": 10
   },
   "repoWithImage": 10
  },
  {
   "key": "mmsearch",
   "name": "MMSearch",
   "capability": "End-to-end multimodal search",
   "count": 10,
   "group": "mm-mt",
   "scoring": "Hybrid",
   "scoringModes": {
    "auto": 0,
    "judge": 0,
    "hybrid": 10
   },
   "fullName": "MMSearch",
   "description": "MMSearch is an end-to-end multimodal search benchmark in which the agent must query, retrieve, and synthesize information that is distributed across both text and images, requiring multimodal query formulation and cross-modal evidence aggregation.",
   "citation": {
    "text": "Jiang et al. 2025",
    "title": "MMSearch: unveiling the potential of large models as multi-modal search engines",
    "authors": "D. Jiang, R. Zhang, Z. Guo, Y. Wu, J. Lei, P. Qiu, P. Lu, Z. Chen, G. Song, P. Gao, Y. Liu, C. Li, and H. Li",
    "venue": "In The Thirteenth International Conference on Learning Representations",
    "url": null
   },
   "repoCount": 10,
   "repoScoring": {
    "auto": 0,
    "judge": 0,
    "hybrid": 10
   },
   "repoWithImage": 10
  },
  {
   "key": "mmsearchplus",
   "name": "MMSearchPlus",
   "capability": "Provenance-aware multimodal search",
   "count": 5,
   "group": "mm-mt",
   "scoring": "Hybrid",
   "scoringModes": {
    "auto": 0,
    "judge": 0,
    "hybrid": 5
   },
   "fullName": "MMSearchPlus",
   "description": "MMSearchPlus extends multimodal search with a provenance-aware evaluation: each task demands fine-grained multimodal reasoning while preventing shortcut answers, and correctness is judged by whether the agent cites and correctly interprets the originating evidence.",
   "citation": {
    "text": "Tao et al. 2026",
    "title": "MMSearch-Plus: benchmarking provenance-aware search for multimodal browsing agents",
    "authors": "X. Tao, Y. Teng, X. Su, X. Fu, J. Wu, C. Tao, Z. Liu, H. Bai, R. Liu, and L. Kong",
    "venue": "In The Fourteenth International Conference on Learning Representations",
    "url": null
   },
   "repoCount": 5,
   "repoScoring": {
    "auto": 0,
    "judge": 0,
    "hybrid": 5
   },
   "repoWithImage": 5
  }
 ],
 "vendors": [
  "Anthropic",
  "OpenAI",
  "Google",
  "Xiaomi",
  "Alibaba Qwen",
  "ByteDance",
  "Moonshot AI",
  "MiniMax",
  "Z.ai",
  "DeepSeek"
 ],
 "models": [
  {
   "name": "Claude-Opus-4.8",
   "deployment": "api",
   "citation": {
    "text": "Anthropic 2026b",
    "title": "Claude Opus 4.8 System Card",
    "url": "https://www.anthropic.com/claude-opus-4-8-system-card",
    "venue": null
   },
   "acc": {
    "text-ss": 98.8,
    "text-ms": 78.1,
    "text-mt": 65.3,
    "mm-ss": 85.0,
    "mm-ms": 69.2,
    "mm-mt": 61.8
   },
   "textAvg": 76.3,
   "mmAvg": 71.1,
   "textOnly": false,
   "shortName": "Claude-Opus-4.8",
   "vendor": "Anthropic",
   "tokens": {
    "text-ss": 52,
    "text-ms": 85,
    "text-mt": 301,
    "textAvg": 154,
    "mm-ss": 77,
    "mm-ms": 98,
    "mm-mt": 147,
    "mmAvg": 109,
    "overall": 141
   },
   "cost": {
    "text-ss": 0.075,
    "text-ms": 0.184,
    "text-mt": 0.417,
    "textAvg": 0.25,
    "mm-ss": 0.06,
    "mm-ms": 0.132,
    "mm-mt": 0.164,
    "mmAvg": 0.123,
    "overall": 0.211
   },
   "costText": {
    "text-ss": "0.075",
    "text-ms": "0.184",
    "text-mt": "0.417",
    "textAvg": "0.250",
    "mm-ss": "0.060",
    "mm-ms": "0.132",
    "mm-mt": "0.164",
    "mmAvg": "0.123",
    "overall": "0.211"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Anthropic",
    "pool": "API",
    "input": 5.0,
    "output": 25.0,
    "cacheRead": 0.5,
    "cacheWrite": 6.25,
    "officialRate": false
   },
   "priceText": {
    "input": "5.00",
    "output": "25.00",
    "cacheRead": "0.50",
    "cacheWrite": "6.25"
   },
   "errors": {
    "sampled": 3,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 0,
    "FCR": 0,
    "VEB": 1,
    "VCS": 0,
    "OTH": 1
   },
   "overallTasks": 233,
   "overall": 74.7,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11)",
   "overallDerivedExact": 74.715,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": true,
    "mm": true
   },
   "paretoFig1": {
    "text": false,
    "mm": true
   },
   "overallDerivedFromGroups": 74.706
  },
  {
   "name": "GPT-5.5",
   "deployment": "api",
   "citation": {
    "text": "OpenAI 2026c",
    "title": "GPT-5.5 System Card",
    "url": "https://openai.com/index/gpt-5-5-system-card/",
    "venue": null
   },
   "acc": {
    "text-ss": 94.1,
    "text-ms": 83.6,
    "text-mt": 59.8,
    "mm-ss": 90.0,
    "mm-ms": 75.0,
    "mm-mt": 42.4
   },
   "textAvg": 76.8,
   "mmAvg": 67.7,
   "textOnly": false,
   "shortName": "GPT-5.5",
   "vendor": "OpenAI",
   "tokens": {
    "text-ss": 41,
    "text-ms": 104,
    "text-mt": 190,
    "textAvg": 125,
    "mm-ss": 41,
    "mm-ms": 69,
    "mm-mt": 317,
    "mmAvg": 148,
    "overall": 132
   },
   "cost": {
    "text-ss": 0.051,
    "text-ms": 0.139,
    "text-mt": 0.217,
    "textAvg": 0.155,
    "mm-ss": 0.045,
    "mm-ms": 0.103,
    "mm-mt": 0.365,
    "mmAvg": 0.179,
    "overall": 0.162
   },
   "costText": {
    "text-ss": "0.051",
    "text-ms": "0.139",
    "text-mt": "0.217",
    "textAvg": "0.155",
    "mm-ss": "0.045",
    "mm-ms": "0.103",
    "mm-mt": "0.365",
    "mmAvg": "0.179",
    "overall": "0.162"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "OpenAI",
    "pool": "API",
    "input": 5.0,
    "output": 30.0,
    "cacheRead": 0.5,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "5.00",
    "output": "30.00",
    "cacheRead": "0.50",
    "cacheWrite": null
   },
   "errors": {
    "sampled": 4,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 0,
    "VEB": 0,
    "VCS": 0,
    "OTH": 2
   },
   "overallTasks": 233,
   "overall": 74.0,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11)",
   "overallDerivedExact": 74.027,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": true,
    "mm": true
   },
   "paretoFig1": {
    "text": true,
    "mm": false
   },
   "overallDerivedFromGroups": 74.052
  },
  {
   "name": "Claude-Opus-4.6",
   "deployment": "api",
   "citation": {
    "text": "Anthropic 2026a",
    "title": "Claude Opus 4.6 System Card",
    "url": "https://www.anthropic.com/claude-opus-4-6-system-card",
    "venue": null
   },
   "acc": {
    "text-ss": 91.5,
    "text-ms": 83.4,
    "text-mt": 58.3,
    "mm-ss": 75.0,
    "mm-ms": 76.2,
    "mm-mt": 48.1
   },
   "textAvg": 75.9,
   "mmAvg": 65.9,
   "textOnly": false,
   "shortName": "Claude-Opus-4.6",
   "vendor": "Anthropic",
   "tokens": {
    "text-ss": 35,
    "text-ms": 112,
    "text-mt": 605,
    "textAvg": 270,
    "mm-ss": 49,
    "mm-ms": 110,
    "mm-mt": 251,
    "mmAvg": 143,
    "overall": 231
   },
   "cost": {
    "text-ss": 0.175,
    "text-ms": 0.245,
    "text-mt": 0.784,
    "textAvg": 0.419,
    "mm-ss": 0.062,
    "mm-ms": 0.362,
    "mm-mt": 0.406,
    "mmAvg": 0.293,
    "overall": 0.381
   },
   "costText": {
    "text-ss": "0.175",
    "text-ms": "0.245",
    "text-mt": "0.784",
    "textAvg": "0.419",
    "mm-ss": "0.062",
    "mm-ms": "0.362",
    "mm-mt": "0.406",
    "mmAvg": "0.293",
    "overall": "0.381"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Anthropic",
    "pool": "API",
    "input": 5.0,
    "output": 25.0,
    "cacheRead": 0.5,
    "cacheWrite": 6.25,
    "officialRate": false
   },
   "priceText": {
    "input": "5.00",
    "output": "25.00",
    "cacheRead": "0.50",
    "cacheWrite": "6.25"
   },
   "errors": {
    "sampled": 3,
    "SRU": 0,
    "TUIE": 0,
    "PPPA": 0,
    "FCR": 0,
    "VEB": 1,
    "VCS": 0,
    "OTH": 2
   },
   "overallTasks": 233,
   "overall": 72.9,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11)",
   "overallDerivedExact": 72.853,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": true,
    "mm": true
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 72.858
  },
  {
   "name": "Gemini-3.1-Pro",
   "deployment": "api",
   "citation": {
    "text": "Google DeepMind 2026a",
    "title": "Gemini 3.1 Pro Model Card",
    "url": "https://deepmind.google/models/model-cards/gemini-3-1-pro/",
    "venue": null
   },
   "acc": {
    "text-ss": 96.4,
    "text-ms": 80.7,
    "text-mt": 56.1,
    "mm-ss": 85.0,
    "mm-ms": 88.5,
    "mm-mt": 32.7
   },
   "textAvg": 74.3,
   "mmAvg": 67.9,
   "textOnly": false,
   "shortName": "Gemini-3.1-Pro",
   "vendor": "Google",
   "tokens": {
    "text-ss": 33,
    "text-ms": 123,
    "text-mt": 505,
    "textAvg": 241,
    "mm-ss": 43,
    "mm-ms": 115,
    "mm-mt": 128,
    "mmAvg": 99,
    "overall": 198
   },
   "cost": {
    "text-ss": 0.083,
    "text-ms": 0.107,
    "text-mt": 0.283,
    "textAvg": 0.164,
    "mm-ss": 0.055,
    "mm-ms": 0.138,
    "mm-mt": 0.136,
    "mmAvg": 0.114,
    "overall": 0.149
   },
   "costText": {
    "text-ss": "0.083",
    "text-ms": "0.107",
    "text-mt": "0.283",
    "textAvg": "0.164",
    "mm-ss": "0.055",
    "mm-ms": "0.138",
    "mm-mt": "0.136",
    "mmAvg": "0.114",
    "overall": "0.149"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Google AI Studio",
    "pool": "API",
    "input": 2.0,
    "output": 12.0,
    "cacheRead": 0.2,
    "cacheWrite": 0.375,
    "officialRate": false
   },
   "priceText": {
    "input": "2.00",
    "output": "12.00",
    "cacheRead": "0.20",
    "cacheWrite": "0.375"
   },
   "errors": {
    "sampled": 2,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 0,
    "FCR": 0,
    "VEB": 0,
    "VCS": 0,
    "OTH": 1
   },
   "overallTasks": 233,
   "overall": 72.3,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11)",
   "overallDerivedExact": 72.35,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": true,
    "mm": true
   },
   "paretoFig1": {
    "text": false,
    "mm": true
   },
   "overallDerivedFromGroups": 72.33
  },
  {
   "name": "GPT-5.4",
   "deployment": "api",
   "citation": {
    "text": "OpenAI 2026a",
    "title": "GPT-5.4 Thinking System Card",
    "url": "https://deploymentsafety.openai.com/gpt-5-4-thinking",
    "venue": null
   },
   "acc": {
    "text-ss": 92.1,
    "text-ms": 82.4,
    "text-mt": 59.6,
    "mm-ss": 82.5,
    "mm-ms": 71.2,
    "mm-mt": 40.3
   },
   "textAvg": 75.8,
   "mmAvg": 63.5,
   "textOnly": false,
   "shortName": "GPT-5.4",
   "vendor": "OpenAI",
   "tokens": {
    "text-ss": 50,
    "text-ms": 81,
    "text-mt": 396,
    "textAvg": 184,
    "mm-ss": 50,
    "mm-ms": 69,
    "mm-mt": 291,
    "mmAvg": 142,
    "overall": 171
   },
   "cost": {
    "text-ss": 0.056,
    "text-ms": 0.058,
    "text-mt": 0.244,
    "textAvg": 0.121,
    "mm-ss": 0.036,
    "mm-ms": 0.074,
    "mm-mt": 0.17,
    "mmAvg": 0.097,
    "overall": 0.114
   },
   "costText": {
    "text-ss": "0.056",
    "text-ms": "0.058",
    "text-mt": "0.244",
    "textAvg": "0.121",
    "mm-ss": "0.036",
    "mm-ms": "0.074",
    "mm-mt": "0.170",
    "mmAvg": "0.097",
    "overall": "0.114"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "OpenAI",
    "pool": "API",
    "input": 2.5,
    "output": 15.0,
    "cacheRead": 0.25,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "2.50",
    "output": "15.00",
    "cacheRead": "0.25",
    "cacheWrite": null
   },
   "errors": {
    "sampled": 5,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 0,
    "VEB": 1,
    "VCS": 0,
    "OTH": 2
   },
   "overallTasks": 233,
   "overall": 72.1,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11)",
   "overallDerivedExact": 72.052,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": true,
    "mm": true
   },
   "paretoFig1": {
    "text": false,
    "mm": true
   },
   "overallDerivedFromGroups": 72.092
  },
  {
   "name": "MiMo-V2.5",
   "deployment": "api",
   "citation": {
    "text": "Xiaomi MiMo Team 2026d",
    "title": "Xiaomi MiMo-V2.5",
    "url": "https://mimo.xiaomi.com/mimo-v2-5/",
    "venue": null,
    "textPdf": "Xiaomi MiMo Team 2026c"
   },
   "acc": {
    "text-ss": 94.7,
    "text-ms": 82.5,
    "text-mt": 57.5,
    "mm-ss": 80.0,
    "mm-ms": 66.7,
    "mm-mt": 43.0
   },
   "textAvg": 75.5,
   "mmAvg": 62.1,
   "textOnly": false,
   "shortName": "MiMo-V2.5",
   "vendor": "Xiaomi",
   "tokens": {
    "text-ss": 75,
    "text-ms": 143,
    "text-mt": 603,
    "textAvg": 291,
    "mm-ss": 79,
    "mm-ms": 95,
    "mm-mt": 523,
    "mmAvg": 241,
    "overall": 276
   },
   "cost": {
    "text-ss": 0.003,
    "text-ms": 0.003,
    "text-mt": 0.011,
    "textAvg": 0.006,
    "mm-ss": 0.001,
    "mm-ms": 0.004,
    "mm-mt": 0.007,
    "mmAvg": 0.005,
    "overall": 0.005
   },
   "costText": {
    "text-ss": "0.003",
    "text-ms": "0.003",
    "text-mt": "0.011",
    "textAvg": "0.006",
    "mm-ss": "0.001",
    "mm-ms": "0.004",
    "mm-mt": "0.007",
    "mmAvg": "0.005",
    "overall": "0.005"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Xiaomi",
    "pool": "API",
    "input": 0.14,
    "output": 0.28,
    "cacheRead": 0.0028,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.14",
    "output": "0.28",
    "cacheRead": "0.0028",
    "cacheWrite": null
   },
   "errors": {
    "sampled": 4,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 0,
    "VEB": 1,
    "VCS": 0,
    "OTH": 1
   },
   "overallTasks": 233,
   "overall": 71.4,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11)",
   "overallDerivedExact": 71.417,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": true,
    "mm": true
   },
   "paretoFig1": {
    "text": true,
    "mm": true
   },
   "overallDerivedFromGroups": 71.43
  },
  {
   "name": "Claude-Sonnet-4.6",
   "deployment": "api",
   "citation": {
    "text": "Anthropic 2026c",
    "title": "Claude Sonnet 4.6 System Card",
    "url": "https://www.anthropic.com/claude-sonnet-4-6-system-card",
    "venue": null
   },
   "acc": {
    "text-ss": 89.2,
    "text-ms": 76.8,
    "text-mt": 59.9,
    "mm-ss": 75.0,
    "mm-ms": 59.6,
    "mm-mt": 42.3
   },
   "textAvg": 72.6,
   "mmAvg": 57.9,
   "textOnly": false,
   "shortName": "Claude-Sonnet-4.6",
   "vendor": "Anthropic",
   "tokens": {
    "text-ss": 49,
    "text-ms": 157,
    "text-mt": 575,
    "textAvg": 286,
    "mm-ss": 52,
    "mm-ms": 125,
    "mm-mt": 330,
    "mmAvg": 177,
    "overall": 252
   },
   "cost": {
    "text-ss": 0.154,
    "text-ms": 0.205,
    "text-mt": 0.902,
    "textAvg": 0.436,
    "mm-ss": 0.063,
    "mm-ms": 0.29,
    "mm-mt": 0.337,
    "mmAvg": 0.243,
    "overall": 0.377
   },
   "costText": {
    "text-ss": "0.154",
    "text-ms": "0.205",
    "text-mt": "0.902",
    "textAvg": "0.436",
    "mm-ss": "0.063",
    "mm-ms": "0.290",
    "mm-mt": "0.337",
    "mmAvg": "0.243",
    "overall": "0.377"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Anthropic",
    "pool": "API",
    "input": 3.0,
    "output": 15.0,
    "cacheRead": 0.3,
    "cacheWrite": 3.75,
    "officialRate": false
   },
   "priceText": {
    "input": "3.00",
    "output": "15.00",
    "cacheRead": "0.30",
    "cacheWrite": "3.75"
   },
   "errors": {
    "sampled": 7,
    "SRU": 4,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 0,
    "VEB": 0,
    "VCS": 1,
    "OTH": 1
   },
   "overallTasks": 233,
   "overall": 68.1,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11)",
   "overallDerivedExact": 68.121,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": true,
    "mm": true
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 68.1
  },
  {
   "name": "Qwen3.6-Plus",
   "deployment": "api",
   "citation": {
    "text": "Qwen Team 2026d",
    "title": "Qwen3.6-Plus: towards real world agents",
    "url": "https://qwen.ai/blog?id=qwen3.6",
    "venue": null
   },
   "acc": {
    "text-ss": 95.5,
    "text-ms": 77.7,
    "text-mt": 54.8,
    "mm-ss": 75.0,
    "mm-ms": 61.5,
    "mm-mt": 41.2
   },
   "textAvg": 72.1,
   "mmAvg": 58.2,
   "textOnly": false,
   "shortName": "Qwen3.6-Plus",
   "vendor": "Alibaba Qwen",
   "tokens": {
    "text-ss": 57,
    "text-ms": 163,
    "text-mt": 607,
    "textAvg": 301,
    "mm-ss": 50,
    "mm-ms": 181,
    "mm-mt": 561,
    "mmAvg": 278,
    "overall": 294
   },
   "cost": {
    "text-ss": 0.039,
    "text-ms": 0.086,
    "text-mt": 0.321,
    "textAvg": 0.16,
    "mm-ss": 0.027,
    "mm-ms": 0.108,
    "mm-mt": 0.292,
    "mmAvg": 0.15,
    "overall": 0.157
   },
   "costText": {
    "text-ss": "0.039",
    "text-ms": "0.086",
    "text-mt": "0.321",
    "textAvg": "0.160",
    "mm-ss": "0.027",
    "mm-ms": "0.108",
    "mm-mt": "0.292",
    "mmAvg": "0.150",
    "overall": "0.157"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Alibaba Cloud Int",
    "pool": "API",
    "input": 0.5,
    "output": 3.0,
    "cacheRead": 0.05,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.50",
    "output": "3.00",
    "cacheRead": "0.05",
    "cacheWrite": null
   },
   "errors": {
    "sampled": 6,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 0,
    "FCR": 1,
    "VEB": 1,
    "VCS": 0,
    "OTH": 3
   },
   "overallTasks": 233,
   "overall": 67.9,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11)",
   "overallDerivedExact": 67.864,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": true,
    "mm": true
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 67.867
  },
  {
   "name": "Qwen3.5-Plus",
   "deployment": "api",
   "citation": {
    "text": "Qwen Team 2026a",
    "title": "Qwen3.5: towards native multimodal agents",
    "url": "https://qwen.ai/blog?id=qwen3.5",
    "venue": null
   },
   "acc": {
    "text-ss": 89.5,
    "text-ms": 77.3,
    "text-mt": 53.9,
    "mm-ss": 70.0,
    "mm-ms": 69.2,
    "mm-mt": 39.1
   },
   "textAvg": 70.9,
   "mmAvg": 58.8,
   "textOnly": false,
   "shortName": "Qwen3.5-Plus",
   "vendor": "Alibaba Qwen",
   "tokens": {
    "text-ss": 40,
    "text-ms": 80,
    "text-mt": 529,
    "textAvg": 228,
    "mm-ss": 40,
    "mm-ms": 111,
    "mm-mt": 248,
    "mmAvg": 140,
    "overall": 201
   },
   "cost": {
    "text-ss": 0.021,
    "text-ms": 0.035,
    "text-mt": 0.218,
    "textAvg": 0.095,
    "mm-ss": 0.018,
    "mm-ms": 0.05,
    "mm-mt": 0.105,
    "mmAvg": 0.06,
    "overall": 0.085
   },
   "costText": {
    "text-ss": "0.021",
    "text-ms": "0.035",
    "text-mt": "0.218",
    "textAvg": "0.095",
    "mm-ss": "0.018",
    "mm-ms": "0.050",
    "mm-mt": "0.105",
    "mmAvg": "0.060",
    "overall": "0.085"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Alibaba Cloud Int",
    "pool": "API",
    "input": 0.4,
    "output": 2.4,
    "cacheRead": 0.04,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.40",
    "output": "2.40",
    "cacheRead": "0.04",
    "cacheWrite": null
   },
   "errors": {
    "sampled": 4,
    "SRU": 2,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 0,
    "VEB": 1,
    "VCS": 0,
    "OTH": 0
   },
   "overallTasks": 233,
   "overall": 67.2,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11)",
   "overallDerivedExact": 67.213,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": true,
    "mm": true
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 67.194
  },
  {
   "name": "Doubao-Seed2.0-Pro",
   "deployment": "api",
   "citation": {
    "text": "Bytedance Seed 2026",
    "title": "Seed2.0 Model Card: towards intelligence frontier for real-world complexity",
    "url": null,
    "venue": "arXiv preprint arXiv:2607.00248"
   },
   "acc": {
    "text-ss": 95.9,
    "text-ms": 77.4,
    "text-mt": 51.1,
    "mm-ss": 75.0,
    "mm-ms": 61.5,
    "mm-mt": 42.6
   },
   "textAvg": 70.8,
   "mmAvg": 58.7,
   "textOnly": false,
   "shortName": "Doubao-Seed2.0-Pro",
   "vendor": "ByteDance",
   "tokens": {
    "text-ss": 46,
    "text-ms": 75,
    "text-mt": 452,
    "textAvg": 199,
    "mm-ss": 164,
    "mm-ms": 173,
    "mm-mt": 289,
    "mmAvg": 211,
    "overall": 203
   },
   "cost": {
    "text-ss": 0.019,
    "text-ms": 0.023,
    "text-mt": 0.105,
    "textAvg": 0.051,
    "mm-ss": 0.031,
    "mm-ms": 0.056,
    "mm-mt": 0.079,
    "mmAvg": 0.057,
    "overall": 0.052
   },
   "costText": {
    "text-ss": "0.019",
    "text-ms": "0.023",
    "text-mt": "0.105",
    "textAvg": "0.051",
    "mm-ss": "0.031",
    "mm-ms": "0.056",
    "mm-mt": "0.079",
    "mmAvg": "0.057",
    "overall": "0.052"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Volcengine",
    "pool": "API",
    "input": 0.444,
    "output": 2.222,
    "cacheRead": 0.089,
    "cacheWrite": null,
    "officialRate": true
   },
   "priceText": {
    "input": "0.444",
    "output": "2.222",
    "cacheRead": "0.089",
    "cacheWrite": null
   },
   "errors": {
    "sampled": 8,
    "SRU": 3,
    "TUIE": 0,
    "PPPA": 0,
    "FCR": 1,
    "VEB": 1,
    "VCS": 0,
    "OTH": 3
   },
   "overallTasks": 233,
   "overall": 67.1,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11)",
   "overallDerivedExact": 67.113,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": true,
    "mm": true
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 67.066
  },
  {
   "name": "Gemini-3.5-Flash",
   "deployment": "api",
   "citation": {
    "text": "Google DeepMind 2026b",
    "title": "Gemini 3.5 Flash Model Card",
    "url": "https://deepmind.google/models/model-cards/gemini-3-5-flash/",
    "venue": null
   },
   "acc": {
    "text-ss": 94.9,
    "text-ms": 80.9,
    "text-mt": 51.7,
    "mm-ss": 85.0,
    "mm-ms": 50.0,
    "mm-mt": 26.7
   },
   "textAvg": 72.7,
   "mmAvg": 51.7,
   "textOnly": false,
   "shortName": "Gemini-3.5-Flash",
   "vendor": "Google",
   "tokens": {
    "text-ss": 101,
    "text-ms": 338,
    "text-mt": 773,
    "textAvg": 456,
    "mm-ss": 191,
    "mm-ms": 590,
    "mm-mt": 625,
    "mmAvg": 490,
    "overall": 467
   },
   "cost": {
    "text-ss": 0.111,
    "text-ms": 0.193,
    "text-mt": 0.401,
    "textAvg": 0.253,
    "mm-ss": 0.155,
    "mm-ms": 0.305,
    "mm-mt": 0.346,
    "mmAvg": 0.277,
    "overall": 0.261
   },
   "costText": {
    "text-ss": "0.111",
    "text-ms": "0.193",
    "text-mt": "0.401",
    "textAvg": "0.253",
    "mm-ss": "0.155",
    "mm-ms": "0.305",
    "mm-mt": "0.346",
    "mmAvg": "0.277",
    "overall": "0.261"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Google AI Studio",
    "pool": "API",
    "input": 1.5,
    "output": 9.0,
    "cacheRead": 0.15,
    "cacheWrite": 0.083,
    "officialRate": false
   },
   "priceText": {
    "input": "1.50",
    "output": "9.00",
    "cacheRead": "0.15",
    "cacheWrite": "0.083"
   },
   "errors": {
    "sampled": 5,
    "SRU": 2,
    "TUIE": 0,
    "PPPA": 0,
    "FCR": 0,
    "VEB": 0,
    "VCS": 0,
    "OTH": 3
   },
   "overallTasks": 233,
   "overall": 66.3,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11)",
   "overallDerivedExact": 66.301,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": true,
    "mm": true
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 66.297
  },
  {
   "name": "GPT-5.4-mini",
   "deployment": "api",
   "citation": {
    "text": "OpenAI 2026b",
    "title": "GPT-5.4 Thinking System Card: appendix—GPT-5.4 mini",
    "url": "https://deploymentsafety.openai.com/gpt-5-4-thinking/appendix-gpt-5.4-mini",
    "venue": null
   },
   "acc": {
    "text-ss": 77.8,
    "text-ms": 79.1,
    "text-mt": 50.3,
    "mm-ss": 70.0,
    "mm-ms": 46.2,
    "mm-mt": 35.9
   },
   "textAvg": 69.2,
   "mmAvg": 49.3,
   "textOnly": false,
   "shortName": "GPT-5.4-mini",
   "vendor": "OpenAI",
   "tokens": {
    "text-ss": 31,
    "text-ms": 52,
    "text-mt": 131,
    "textAvg": 76,
    "mm-ss": 38,
    "mm-ms": 40,
    "mm-mt": 95,
    "mmAvg": 59,
    "overall": 71
   },
   "cost": {
    "text-ss": 0.008,
    "text-ms": 0.01,
    "text-mt": 0.033,
    "textAvg": 0.017,
    "mm-ss": 0.007,
    "mm-ms": 0.012,
    "mm-mt": 0.022,
    "mmAvg": 0.014,
    "overall": 0.017
   },
   "costText": {
    "text-ss": "0.008",
    "text-ms": "0.010",
    "text-mt": "0.033",
    "textAvg": "0.017",
    "mm-ss": "0.007",
    "mm-ms": "0.012",
    "mm-mt": "0.022",
    "mmAvg": "0.014",
    "overall": "0.017"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "OpenAI",
    "pool": "API",
    "input": 0.75,
    "output": 4.5,
    "cacheRead": 0.075,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.75",
    "output": "4.50",
    "cacheRead": "0.075",
    "cacheWrite": null
   },
   "errors": {
    "sampled": 6,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 0,
    "VEB": 1,
    "VCS": 1,
    "OTH": 2
   },
   "overallTasks": 233,
   "overall": 63.1,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11)",
   "overallDerivedExact": 63.136,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": true,
    "mm": true
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 63.103
  },
  {
   "name": "Claude-Haiku-4.5",
   "deployment": "api",
   "citation": {
    "text": "Anthropic 2025",
    "title": "Claude Haiku 4.5 System Card",
    "url": "https://www-cdn.anthropic.com/7aad69bf12627d42234e01ee7c36305dc2f6a970.pdf",
    "venue": null
   },
   "acc": {
    "text-ss": 89.1,
    "text-ms": 76.7,
    "text-mt": 50.1,
    "mm-ss": 50.5,
    "mm-ms": 46.2,
    "mm-mt": 31.6
   },
   "textAvg": 69.2,
   "mmAvg": 42.3,
   "textOnly": false,
   "shortName": "Claude-Haiku-4.5",
   "vendor": "Anthropic",
   "tokens": {
    "text-ss": 46,
    "text-ms": 75,
    "text-mt": 375,
    "textAvg": 173,
    "mm-ss": 54,
    "mm-ms": 108,
    "mm-mt": 164,
    "mmAvg": 113,
    "overall": 155
   },
   "cost": {
    "text-ss": 0.022,
    "text-ms": 0.035,
    "text-mt": 0.143,
    "textAvg": 0.07,
    "mm-ss": 0.018,
    "mm-ms": 0.042,
    "mm-mt": 0.052,
    "mmAvg": 0.039,
    "overall": 0.061
   },
   "costText": {
    "text-ss": "0.022",
    "text-ms": "0.035",
    "text-mt": "0.143",
    "textAvg": "0.070",
    "mm-ss": "0.018",
    "mm-ms": "0.042",
    "mm-mt": "0.052",
    "mmAvg": "0.039",
    "overall": "0.061"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Anthropic",
    "pool": "API",
    "input": 1.0,
    "output": 5.0,
    "cacheRead": 0.1,
    "cacheWrite": 1.25,
    "officialRate": false
   },
   "priceText": {
    "input": "1.00",
    "output": "5.00",
    "cacheRead": "0.10",
    "cacheWrite": "1.25"
   },
   "errors": {
    "sampled": 6,
    "SRU": 2,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 1,
    "VEB": 1,
    "VCS": 1,
    "OTH": 0
   },
   "overallTasks": 233,
   "overall": 61.0,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11)",
   "overallDerivedExact": 61.003,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": true,
    "mm": true
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 60.994
  },
  {
   "name": "MiMo-V2-Omni",
   "deployment": "api",
   "citation": {
    "text": "Xiaomi MiMo Team 2026a",
    "title": "Xiaomi MiMo-V2-Omni: omni-modal agentic foundation model that sees, understands and acts",
    "url": "https://mimo.mi.com/docs/en-US/news/previous-news/v2-omni-release",
    "venue": null
   },
   "acc": {
    "text-ss": 70.4,
    "text-ms": 75.4,
    "text-mt": 51.5,
    "mm-ss": 75.0,
    "mm-ms": 34.6,
    "mm-mt": 34.7
   },
   "textAvg": 66.7,
   "mmAvg": 46.0,
   "textOnly": false,
   "shortName": "MiMo-V2-Omni",
   "vendor": "Xiaomi",
   "tokens": {
    "text-ss": 49,
    "text-ms": 90,
    "text-mt": 618,
    "textAvg": 264,
    "mm-ss": 51,
    "mm-ms": 54,
    "mm-mt": 284,
    "mmAvg": 134,
    "overall": 225
   },
   "cost": {
    "text-ss": 0.003,
    "text-ms": 0.003,
    "text-mt": 0.017,
    "textAvg": 0.008,
    "mm-ss": null,
    "mm-ms": 0.003,
    "mm-mt": 0.005,
    "mmAvg": 0.003,
    "overall": 0.006
   },
   "costText": {
    "text-ss": "0.003",
    "text-ms": "0.003",
    "text-mt": "0.017",
    "textAvg": "0.008",
    "mm-ss": "<0.001",
    "mm-ms": "0.003",
    "mm-mt": "0.005",
    "mmAvg": "0.003",
    "overall": "0.006"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Xiaomi",
    "pool": "API",
    "input": 0.14,
    "output": 0.28,
    "cacheRead": 0.0028,
    "cacheWrite": null,
    "officialRate": true
   },
   "priceText": {
    "input": "0.14",
    "output": "0.28",
    "cacheRead": "0.0028",
    "cacheWrite": null
   },
   "errors": {
    "sampled": 9,
    "SRU": 1,
    "TUIE": 1,
    "PPPA": 3,
    "FCR": 0,
    "VEB": 1,
    "VCS": 2,
    "OTH": 1
   },
   "overallTasks": 233,
   "overall": 60.4,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11)",
   "overallDerivedExact": 60.392,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": false,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 60.375
  },
  {
   "name": "Kimi-K2.5",
   "deployment": "api",
   "citation": {
    "text": "Kimi Team 2026",
    "title": "Kimi K2.5: visual agentic intelligence",
    "url": null,
    "venue": "arXiv preprint arXiv:2602.02276"
   },
   "acc": {
    "text-ss": 89.2,
    "text-ms": 70.0,
    "text-mt": 45.6,
    "mm-ss": 65.0,
    "mm-ms": 54.4,
    "mm-mt": 38.7
   },
   "textAvg": 64.1,
   "mmAvg": 51.9,
   "textOnly": false,
   "shortName": "Kimi-K2.5",
   "vendor": "Moonshot AI",
   "tokens": {
    "text-ss": 73,
    "text-ms": 184,
    "text-mt": 550,
    "textAvg": 295,
    "mm-ss": 41,
    "mm-ms": 226,
    "mm-mt": 268,
    "mmAvg": 189,
    "overall": 262
   },
   "cost": {
    "text-ss": 0.042,
    "text-ms": 0.072,
    "text-mt": 0.221,
    "textAvg": 0.119,
    "mm-ss": 0.025,
    "mm-ms": 0.088,
    "mm-mt": 0.122,
    "mmAvg": 0.082,
    "overall": 0.108
   },
   "costText": {
    "text-ss": "0.042",
    "text-ms": "0.072",
    "text-mt": "0.221",
    "textAvg": "0.119",
    "mm-ss": "0.025",
    "mm-ms": "0.088",
    "mm-mt": "0.122",
    "mmAvg": "0.082",
    "overall": "0.108"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Moonshot AI",
    "pool": "API",
    "input": 0.6,
    "output": 3.0,
    "cacheRead": 0.1,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.60",
    "output": "3.00",
    "cacheRead": "0.10",
    "cacheWrite": null
   },
   "errors": {
    "sampled": 5,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 1,
    "VEB": 0,
    "VCS": 1,
    "OTH": 1
   },
   "overallTasks": 233,
   "overall": 60.4,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11)",
   "overallDerivedExact": 60.382,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": true,
    "mm": true
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 60.36
  },
  {
   "name": "Doubao-Seed2.0-Mini",
   "deployment": "api",
   "citation": {
    "text": "Bytedance Seed 2026",
    "title": "Seed2.0 Model Card: towards intelligence frontier for real-world complexity",
    "url": null,
    "venue": "arXiv preprint arXiv:2607.00248"
   },
   "acc": {
    "text-ss": 75.7,
    "text-ms": 78.9,
    "text-mt": 42.5,
    "mm-ss": 55.0,
    "mm-ms": 51.9,
    "mm-mt": 34.3
   },
   "textAvg": 66.1,
   "mmAvg": 46.6,
   "textOnly": false,
   "shortName": "Doubao-Seed2.0-Mini",
   "vendor": "ByteDance",
   "tokens": {
    "text-ss": 55,
    "text-ms": 79,
    "text-mt": 460,
    "textAvg": 205,
    "mm-ss": 318,
    "mm-ms": 148,
    "mm-mt": 384,
    "mmAvg": 279,
    "overall": 228
   },
   "cost": {
    "text-ss": 0.008,
    "text-ms": 0.009,
    "text-mt": 0.049,
    "textAvg": 0.023,
    "mm-ss": 0.034,
    "mm-ms": 0.018,
    "mm-mt": 0.041,
    "mmAvg": 0.031,
    "overall": 0.025
   },
   "costText": {
    "text-ss": "0.008",
    "text-ms": "0.009",
    "text-mt": "0.049",
    "textAvg": "0.023",
    "mm-ss": "0.034",
    "mm-ms": "0.018",
    "mm-mt": "0.041",
    "mmAvg": "0.031",
    "overall": "0.025"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Seed",
    "pool": "API",
    "input": 0.1,
    "output": 0.4,
    "cacheRead": null,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.10",
    "output": "0.40",
    "cacheRead": null,
    "cacheWrite": null
   },
   "errors": {
    "sampled": 9,
    "SRU": 0,
    "TUIE": 0,
    "PPPA": 3,
    "FCR": 0,
    "VEB": 1,
    "VCS": 1,
    "OTH": 4
   },
   "overallTasks": 233,
   "overall": 60.2,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11)",
   "overallDerivedExact": 60.158,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": true,
    "mm": true
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 60.183
  },
  {
   "name": "MiMo-V2.5-Pro",
   "deployment": "api",
   "citation": {
    "text": "Xiaomi MiMo Team 2026c",
    "title": "Xiaomi MiMo-V2.5-Pro",
    "url": "https://mimo.xiaomi.com/mimo-v2-5-pro/",
    "venue": null,
    "textPdf": "Xiaomi MiMo Team 2026d"
   },
   "acc": {
    "text-ss": 91.6,
    "text-ms": 81.7,
    "text-mt": 61.2,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null
   },
   "textAvg": 76.0,
   "mmAvg": null,
   "textOnly": true,
   "shortName": "MiMo-V2.5-Pro",
   "vendor": "Xiaomi",
   "tokens": {
    "text-ss": 72,
    "text-ms": 134,
    "text-mt": 441,
    "textAvg": 230,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": 230
   },
   "cost": {
    "text-ss": 0.01,
    "text-ms": 0.008,
    "text-mt": 0.02,
    "textAvg": 0.012,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": 0.012
   },
   "costText": {
    "text-ss": "0.010",
    "text-ms": "0.008",
    "text-mt": "0.020",
    "textAvg": "0.012",
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": "0.012"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Xiaomi",
    "pool": "API",
    "input": 0.435,
    "output": 0.87,
    "cacheRead": 0.0036,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.435",
    "output": "0.87",
    "cacheRead": "0.0036",
    "cacheWrite": null
   },
   "errors": {
    "sampled": 7,
    "SRU": 2,
    "TUIE": 1,
    "PPPA": 1,
    "FCR": 1,
    "VEB": 1,
    "VCS": 1,
    "OTH": 0
   },
   "overall": 76.0,
   "overallSource": "Table 1 Text Avg (text-only model; 162 applicable text tasks)",
   "overallTasks": 162,
   "overallDerivedExact": 75.962,
   "tokensOverallSource": "Table 2/6 Text Avg (text-only model)",
   "fig1": {
    "text": true,
    "mm": false
   },
   "paretoFig1": {
    "text": true,
    "mm": false
   }
  },
  {
   "name": "DeepSeek-V4-Pro",
   "deployment": "api",
   "citation": {
    "text": "DeepSeek-AI 2026",
    "title": "DeepSeek-V4: towards highly efficient million-token context intelligence",
    "url": null,
    "venue": "arXiv preprint arXiv:2606.19348"
   },
   "acc": {
    "text-ss": 91.6,
    "text-ms": 80.9,
    "text-mt": 54.3,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null
   },
   "textAvg": 73.2,
   "mmAvg": null,
   "textOnly": true,
   "shortName": "DeepSeek-V4-Pro",
   "vendor": "DeepSeek",
   "tokens": {
    "text-ss": 61,
    "text-ms": 126,
    "text-mt": 390,
    "textAvg": 207,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": 207
   },
   "cost": {
    "text-ss": 0.013,
    "text-ms": 0.015,
    "text-mt": 0.04,
    "textAvg": 0.023,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": 0.023
   },
   "costText": {
    "text-ss": "0.013",
    "text-ms": "0.015",
    "text-mt": "0.040",
    "textAvg": "0.023",
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": "0.023"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "DeepSeek",
    "pool": "API",
    "input": 0.435,
    "output": 0.87,
    "cacheRead": 0.0036,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.435",
    "output": "0.87",
    "cacheRead": "0.0036",
    "cacheWrite": null
   },
   "errors": {
    "sampled": 9,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 2,
    "FCR": 2,
    "VEB": 1,
    "VCS": 0,
    "OTH": 3
   },
   "overall": 73.2,
   "overallSource": "Table 1 Text Avg (text-only model; 162 applicable text tasks)",
   "overallTasks": 162,
   "overallDerivedExact": 73.19,
   "tokensOverallSource": "Table 2/6 Text Avg (text-only model)",
   "fig1": {
    "text": true,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   }
  },
  {
   "name": "MiMo-V2-Pro",
   "deployment": "api",
   "citation": {
    "text": "Xiaomi MiMo Team 2026b",
    "title": "Xiaomi MiMo-V2-Pro",
    "url": "https://mimo.xiaomi.com/mimo-v2-pro",
    "venue": null
   },
   "acc": {
    "text-ss": 91.7,
    "text-ms": 75.4,
    "text-mt": 58.4,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null
   },
   "textAvg": 71.6,
   "mmAvg": null,
   "textOnly": true,
   "shortName": "MiMo-V2-Pro",
   "vendor": "Xiaomi",
   "tokens": {
    "text-ss": 42,
    "text-ms": 98,
    "text-mt": 520,
    "textAvg": 234,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": 234
   },
   "cost": {
    "text-ss": 0.005,
    "text-ms": 0.009,
    "text-mt": 0.026,
    "textAvg": 0.014,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": 0.014
   },
   "costText": {
    "text-ss": "0.005",
    "text-ms": "0.009",
    "text-mt": "0.026",
    "textAvg": "0.014",
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": "0.014"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Xiaomi",
    "pool": "API",
    "input": 0.435,
    "output": 0.87,
    "cacheRead": 0.0036,
    "cacheWrite": null,
    "officialRate": true
   },
   "priceText": {
    "input": "0.435",
    "output": "0.87",
    "cacheRead": "0.0036",
    "cacheWrite": null
   },
   "errors": {
    "sampled": 8,
    "SRU": 3,
    "TUIE": 1,
    "PPPA": 1,
    "FCR": 1,
    "VEB": 2,
    "VCS": 0,
    "OTH": 0
   },
   "overall": 71.6,
   "overallSource": "Table 1 Text Avg (text-only model; 162 applicable text tasks)",
   "overallTasks": 162,
   "overallDerivedExact": 71.641,
   "tokensOverallSource": "Table 2/6 Text Avg (text-only model)",
   "fig1": {
    "text": false,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   }
  },
  {
   "name": "MiniMax-M2.7",
   "deployment": "api",
   "citation": {
    "text": "MiniMax 2026",
    "title": "The MiniMax-M2 series: mini activations unleashing max real-world intelligence",
    "url": null,
    "venue": "arXiv preprint arXiv:2605.26494"
   },
   "acc": {
    "text-ss": 80.9,
    "text-ms": 77.8,
    "text-mt": 53.0,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null
   },
   "textAvg": 69.8,
   "mmAvg": null,
   "textOnly": true,
   "shortName": "MiniMax-M2.7",
   "vendor": "MiniMax",
   "tokens": {
    "text-ss": 50,
    "text-ms": 75,
    "text-mt": 377,
    "textAvg": 175,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": 175
   },
   "cost": {
    "text-ss": 0.013,
    "text-ms": 0.01,
    "text-mt": 0.056,
    "textAvg": 0.026,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": 0.026
   },
   "costText": {
    "text-ss": "0.013",
    "text-ms": "0.010",
    "text-mt": "0.056",
    "textAvg": "0.026",
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": "0.026"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "MiniMax",
    "pool": "API",
    "input": 0.3,
    "output": 1.2,
    "cacheRead": 0.06,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.30",
    "output": "1.20",
    "cacheRead": "0.06",
    "cacheWrite": null
   },
   "errors": {
    "sampled": 10,
    "SRU": 2,
    "TUIE": 0,
    "PPPA": 3,
    "FCR": 2,
    "VEB": 1,
    "VCS": 1,
    "OTH": 1
   },
   "overall": 69.8,
   "overallSource": "Table 1 Text Avg (text-only model; 162 applicable text tasks)",
   "overallTasks": 162,
   "overallDerivedExact": 69.763,
   "tokensOverallSource": "Table 2/6 Text Avg (text-only model)",
   "fig1": {
    "text": true,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   }
  },
  {
   "name": "GLM-5",
   "deployment": "api",
   "citation": {
    "text": "GLM-5-Team and others 2026",
    "title": "GLM-5: from vibe coding to agentic engineering",
    "url": null,
    "venue": "arXiv preprint arXiv:2602.15763",
    "textPdf": "GLM-5-Team et al. 2026"
   },
   "acc": {
    "text-ss": 84.9,
    "text-ms": 75.0,
    "text-mt": 53.3,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null
   },
   "textAvg": 68.9,
   "mmAvg": null,
   "textOnly": true,
   "shortName": "GLM-5",
   "vendor": "Z.ai",
   "tokens": {
    "text-ss": 48,
    "text-ms": 125,
    "text-mt": 449,
    "textAvg": 225,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": 225
   },
   "cost": {
    "text-ss": 0.037,
    "text-ms": 0.057,
    "text-mt": 0.185,
    "textAvg": 0.098,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": 0.098
   },
   "costText": {
    "text-ss": "0.037",
    "text-ms": "0.057",
    "text-mt": "0.185",
    "textAvg": "0.098",
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": "0.098"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Z.ai",
    "pool": "API",
    "input": 1.0,
    "output": 3.2,
    "cacheRead": 0.2,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "1.00",
    "output": "3.20",
    "cacheRead": "0.20",
    "cacheWrite": null
   },
   "errors": {
    "sampled": 8,
    "SRU": 2,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 2,
    "VEB": 1,
    "VCS": 1,
    "OTH": 1
   },
   "overall": 68.9,
   "overallSource": "Table 1 Text Avg (text-only model; 162 applicable text tasks)",
   "overallTasks": 162,
   "overallDerivedExact": 68.855,
   "tokensOverallSource": "Table 2/6 Text Avg (text-only model)",
   "fig1": {
    "text": true,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   }
  },
  {
   "name": "DeepSeek-V3.2",
   "deployment": "api",
   "citation": {
    "text": "DeepSeek-AI 2025",
    "title": "DeepSeek-V3.2: pushing the frontier of open large language models",
    "url": null,
    "venue": "arXiv preprint arXiv:2512.02556"
   },
   "acc": {
    "text-ss": 80.0,
    "text-ms": 71.1,
    "text-mt": 46.8,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null
   },
   "textAvg": 63.9,
   "mmAvg": null,
   "textOnly": true,
   "shortName": "DeepSeek-V3.2",
   "vendor": "DeepSeek",
   "tokens": {
    "text-ss": 122,
    "text-ms": 176,
    "text-mt": 454,
    "textAvg": 263,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": 263
   },
   "cost": {
    "text-ss": 0.016,
    "text-ms": 0.019,
    "text-mt": 0.046,
    "textAvg": 0.028,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": 0.028
   },
   "costText": {
    "text-ss": "0.016",
    "text-ms": "0.019",
    "text-mt": "0.046",
    "textAvg": "0.028",
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": "0.028"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Alibaba Cloud Int",
    "pool": "API",
    "input": 0.3705,
    "output": 1.112,
    "cacheRead": 0.0741,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.3705",
    "output": "1.112",
    "cacheRead": "0.0741",
    "cacheWrite": null
   },
   "errors": {
    "sampled": 10,
    "SRU": 2,
    "TUIE": 0,
    "PPPA": 2,
    "FCR": 2,
    "VEB": 0,
    "VCS": 1,
    "OTH": 3
   },
   "overall": 63.9,
   "overallSource": "Table 1 Text Avg (text-only model; 162 applicable text tasks)",
   "overallTasks": 162,
   "overallDerivedExact": 63.949,
   "tokensOverallSource": "Table 2/6 Text Avg (text-only model)",
   "fig1": {
    "text": true,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   }
  },
  {
   "name": "GLM-4.7",
   "deployment": "api",
   "citation": {
    "text": "Z.AI 2025",
    "title": "GLM-4.7: advancing the coding capability",
    "url": "https://z.ai/blog/glm-4.7",
    "venue": null
   },
   "acc": {
    "text-ss": 73.1,
    "text-ms": 76.2,
    "text-mt": 33.6,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null
   },
   "textAvg": 61.3,
   "mmAvg": null,
   "textOnly": true,
   "shortName": "GLM-4.7",
   "vendor": "Z.ai",
   "tokens": {
    "text-ss": 35,
    "text-ms": 92,
    "text-mt": 229,
    "textAvg": 131,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": 131
   },
   "cost": {
    "text-ss": 0.016,
    "text-ms": 0.026,
    "text-mt": 0.052,
    "textAvg": 0.034,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": 0.034
   },
   "costText": {
    "text-ss": "0.016",
    "text-ms": "0.026",
    "text-mt": "0.052",
    "textAvg": "0.034",
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": "0.034"
   },
   "effSource": "Table 2",
   "price": {
    "provider": "Z.ai",
    "pool": "API",
    "input": 0.6,
    "output": 2.2,
    "cacheRead": 0.11,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.60",
    "output": "2.20",
    "cacheRead": "0.11",
    "cacheWrite": null
   },
   "errors": {
    "sampled": 9,
    "SRU": 2,
    "TUIE": 0,
    "PPPA": 2,
    "FCR": 1,
    "VEB": 1,
    "VCS": 0,
    "OTH": 3
   },
   "overall": 61.3,
   "overallSource": "Table 1 Text Avg (text-only model; 162 applicable text tasks)",
   "overallTasks": 162,
   "overallDerivedExact": 61.354,
   "tokensOverallSource": "Table 2/6 Text Avg (text-only model)",
   "fig1": {
    "text": true,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   }
  },
  {
   "name": "Qwen3.6-27B",
   "deployment": "local",
   "citation": {
    "text": "Qwen Team 2026b",
    "title": "Qwen3.6-27B: flagship-level coding in a 27b dense model",
    "url": "https://qwen.ai/blog?id=qwen3.6-27b",
    "venue": null
   },
   "acc": {
    "text-ss": 84.9,
    "text-ms": 72.1,
    "text-mt": 37.2,
    "mm-ss": 75.0,
    "mm-ms": 55.8,
    "mm-mt": 38.5
   },
   "textAvg": 61.8,
   "mmAvg": 55.1,
   "textOnly": false,
   "shortName": "Qwen3.6-27B",
   "vendor": "Alibaba Qwen",
   "tokens": {
    "text-ss": 47,
    "text-ms": 52,
    "text-mt": 83,
    "textAvg": 62,
    "mm-ss": 58,
    "mm-ms": 54,
    "mm-mt": 128,
    "mmAvg": 81,
    "overall": 68
   },
   "cost": {
    "text-ss": 0.037,
    "text-ms": 0.034,
    "text-mt": 0.056,
    "textAvg": 0.041,
    "mm-ss": 0.037,
    "mm-ms": 0.041,
    "mm-mt": 0.084,
    "mmAvg": 0.055,
    "overall": 0.046
   },
   "costText": {
    "text-ss": "0.037",
    "text-ms": "0.034",
    "text-mt": "0.056",
    "textAvg": "0.041",
    "mm-ss": "0.037",
    "mm-ms": "0.041",
    "mm-mt": "0.084",
    "mmAvg": "0.055",
    "overall": "0.046"
   },
   "ctx": "256K",
   "effSource": "Table 6",
   "price": {
    "provider": "Alibaba Cloud Int",
    "pool": "Local",
    "input": 0.6,
    "output": 3.6,
    "cacheRead": null,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.60",
    "output": "3.60",
    "cacheRead": null,
    "cacheWrite": null
   },
   "errors": {
    "sampled": 9,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 5,
    "FCR": 1,
    "VEB": 0,
    "VCS": 0,
    "OTH": 2
   },
   "overallTasks": 233,
   "overall": 59.8,
   "overallSource": "paper prose (§4.2, §B.1)",
   "overallDerivedExact": 59.758,
   "overallFig4": 59.8,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": false,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 59.785
  },
  {
   "name": "Qwen3.6-35B-A3B",
   "deployment": "local",
   "citation": {
    "text": "Qwen Team 2026c",
    "title": "Qwen3.6-35B-A3B: agentic coding power, now open to all",
    "url": "https://qwen.ai/blog?id=qwen3.6-35b-a3b",
    "venue": null
   },
   "acc": {
    "text-ss": 79.3,
    "text-ms": 70.2,
    "text-mt": 33.9,
    "mm-ss": 65.0,
    "mm-ms": 57.7,
    "mm-mt": 32.7
   },
   "textAvg": 59.0,
   "mmAvg": 51.0,
   "textOnly": false,
   "shortName": "Qwen3.6-35B-A3B",
   "vendor": "Alibaba Qwen",
   "tokens": {
    "text-ss": 53,
    "text-ms": 57,
    "text-mt": 86,
    "textAvg": 66,
    "mm-ss": 57,
    "mm-ms": 68,
    "mm-mt": 114,
    "mmAvg": 81,
    "overall": 71
   },
   "cost": {
    "text-ss": 0.01,
    "text-ms": 0.009,
    "text-mt": 0.014,
    "textAvg": 0.011,
    "mm-ss": 0.009,
    "mm-ms": 0.012,
    "mm-mt": 0.018,
    "mmAvg": 0.013,
    "overall": 0.012
   },
   "costText": {
    "text-ss": "0.010",
    "text-ms": "0.009",
    "text-mt": "0.014",
    "textAvg": "0.011",
    "mm-ss": "0.009",
    "mm-ms": "0.012",
    "mm-mt": "0.018",
    "mmAvg": "0.013",
    "overall": "0.012"
   },
   "ctx": "256K",
   "effSource": "Table 6",
   "price": {
    "provider": "AkashML",
    "pool": "Local",
    "input": 0.14,
    "output": 1.0,
    "cacheRead": null,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.14",
    "output": "1.00",
    "cacheRead": null,
    "cacheWrite": null
   },
   "errors": {
    "sampled": 9,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 5,
    "FCR": 1,
    "VEB": 1,
    "VCS": 1,
    "OTH": 0
   },
   "overallTasks": 233,
   "overall": 56.6,
   "overallSource": "paper prose (§4.2, §B.1)",
   "overallDerivedExact": 56.562,
   "overallFig4": 56.6,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": false,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 56.548
  },
  {
   "name": "Qwen3.5-27B",
   "deployment": "local",
   "citation": {
    "text": "Qwen Team 2026a",
    "title": "Qwen3.5: towards native multimodal agents",
    "url": "https://qwen.ai/blog?id=qwen3.5",
    "venue": null
   },
   "acc": {
    "text-ss": 85.8,
    "text-ms": 59.9,
    "text-mt": 27.0,
    "mm-ss": 55.0,
    "mm-ms": 53.8,
    "mm-mt": 24.5
   },
   "textAvg": 51.9,
   "mmAvg": 43.9,
   "textOnly": false,
   "shortName": "Qwen3.5-27B",
   "vendor": "Alibaba Qwen",
   "tokens": {
    "text-ss": 39,
    "text-ms": 64,
    "text-mt": 85,
    "textAvg": 68,
    "mm-ss": 49,
    "mm-ms": 53,
    "mm-mt": 126,
    "mmAvg": 78,
    "overall": 71
   },
   "cost": {
    "text-ss": 0.016,
    "text-ms": 0.021,
    "text-mt": 0.028,
    "textAvg": 0.023,
    "mm-ss": 0.016,
    "mm-ms": 0.02,
    "mm-mt": 0.041,
    "mmAvg": 0.026,
    "overall": 0.024
   },
   "costText": {
    "text-ss": "0.016",
    "text-ms": "0.021",
    "text-mt": "0.028",
    "textAvg": "0.023",
    "mm-ss": "0.016",
    "mm-ms": "0.020",
    "mm-mt": "0.041",
    "mmAvg": "0.026",
    "overall": "0.024"
   },
   "ctx": "256K",
   "effSource": "Table 6",
   "price": {
    "provider": "Alibaba Cloud Int",
    "pool": "Local",
    "input": 0.3,
    "output": 2.4,
    "cacheRead": null,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.30",
    "output": "2.40",
    "cacheRead": null,
    "cacheWrite": null
   },
   "errors": {
    "sampled": 13,
    "SRU": 2,
    "TUIE": 0,
    "PPPA": 4,
    "FCR": 1,
    "VEB": 1,
    "VCS": 2,
    "OTH": 3
   },
   "overallTasks": 233,
   "overall": 49.5,
   "overallSource": "paper prose (§B.1)",
   "overallDerivedExact": 49.462,
   "overallFig4": 49.5,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": false,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 49.458
  },
  {
   "name": "Qwen3.5-35B-A3B",
   "deployment": "local",
   "citation": {
    "text": "Qwen Team 2026a",
    "title": "Qwen3.5: towards native multimodal agents",
    "url": "https://qwen.ai/blog?id=qwen3.5",
    "venue": null
   },
   "acc": {
    "text-ss": 66.2,
    "text-ms": 57.9,
    "text-mt": 34.0,
    "mm-ss": 60.0,
    "mm-ms": 38.5,
    "mm-mt": 22.9
   },
   "textAvg": 50.8,
   "mmAvg": 39.0,
   "textOnly": false,
   "shortName": "Qwen3.5-35B-A3B",
   "vendor": "Alibaba Qwen",
   "tokens": {
    "text-ss": 35,
    "text-ms": 45,
    "text-mt": 78,
    "textAvg": 55,
    "mm-ss": 61,
    "mm-ms": 62,
    "mm-mt": 105,
    "mmAvg": 77,
    "overall": 62
   },
   "cost": {
    "text-ss": 0.011,
    "text-ms": 0.012,
    "text-mt": 0.021,
    "textAvg": 0.015,
    "mm-ss": 0.016,
    "mm-ms": 0.017,
    "mm-mt": 0.027,
    "mmAvg": 0.021,
    "overall": 0.017
   },
   "costText": {
    "text-ss": "0.011",
    "text-ms": "0.012",
    "text-mt": "0.021",
    "textAvg": "0.015",
    "mm-ss": "0.016",
    "mm-ms": "0.017",
    "mm-mt": "0.027",
    "mmAvg": "0.021",
    "overall": "0.017"
   },
   "ctx": "262K",
   "effSource": "Table 6",
   "price": {
    "provider": "Alibaba Cloud Int",
    "pool": "Local",
    "input": 0.25,
    "output": 2.0,
    "cacheRead": null,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.25",
    "output": "2.00",
    "cacheRead": null,
    "cacheWrite": null
   },
   "errors": {
    "sampled": 11,
    "SRU": 3,
    "TUIE": 0,
    "PPPA": 3,
    "FCR": 0,
    "VEB": 2,
    "VCS": 2,
    "OTH": 1
   },
   "overallTasks": 233,
   "overall": 47.2,
   "overallSource": "paper prose (§B.1)",
   "overallDerivedExact": 47.204,
   "overallFig4": 47.2,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": false,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 47.231
  },
  {
   "name": "Qwen3-VL-8B-Instruct",
   "deployment": "local",
   "citation": {
    "text": "Bai et al. 2025a",
    "title": "Qwen3-VL technical report",
    "url": null,
    "venue": "arXiv preprint arXiv:2511.21631"
   },
   "acc": {
    "text-ss": 35.7,
    "text-ms": 58.2,
    "text-mt": 28.9,
    "mm-ss": 40.0,
    "mm-ms": 25.0,
    "mm-mt": 22.3
   },
   "textAvg": 45.5,
   "mmAvg": 28.3,
   "textOnly": false,
   "shortName": "Qwen3-VL-8B",
   "vendor": "Alibaba Qwen",
   "tokens": {
    "text-ss": 43,
    "text-ms": 42,
    "text-mt": 152,
    "textAvg": 79,
    "mm-ss": 48,
    "mm-ms": 42,
    "mm-mt": 78,
    "mmAvg": 57,
    "overall": 72
   },
   "cost": {
    "text-ss": 0.009,
    "text-ms": 0.008,
    "text-mt": 0.028,
    "textAvg": 0.015,
    "mm-ss": 0.009,
    "mm-ms": 0.008,
    "mm-mt": 0.014,
    "mmAvg": 0.01,
    "overall": 0.014
   },
   "costText": {
    "text-ss": "0.009",
    "text-ms": "0.008",
    "text-mt": "0.028",
    "textAvg": "0.015",
    "mm-ss": "0.009",
    "mm-ms": "0.008",
    "mm-mt": "0.014",
    "mmAvg": "0.010",
    "overall": "0.014"
   },
   "ctx": "256K",
   "effSource": "Table 6",
   "price": {
    "provider": "Alibaba Cloud Int",
    "pool": "Local",
    "input": 0.18,
    "output": 0.7,
    "cacheRead": null,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.18",
    "output": "0.70",
    "cacheRead": null,
    "cacheWrite": null
   },
   "errors": {
    "sampled": 11,
    "SRU": 2,
    "TUIE": 1,
    "PPPA": 3,
    "FCR": 2,
    "VEB": 1,
    "VCS": 2,
    "OTH": 0
   },
   "overallTasks": 233,
   "overall": 40.3,
   "overallSource": "paper prose (§B.1)",
   "overallDerivedExact": 40.259,
   "overallFig4": 40.2,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": false,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 40.233
  },
  {
   "name": "Qwen2.5-VL-32B-Instruct",
   "deployment": "local",
   "citation": {
    "text": "Bai et al. 2025b",
    "title": "Qwen2.5-VL technical report",
    "url": null,
    "venue": "arXiv preprint arXiv:2502.13923"
   },
   "acc": {
    "text-ss": 53.3,
    "text-ms": 61.8,
    "text-mt": 20.1,
    "mm-ss": 15.0,
    "mm-ms": 34.6,
    "mm-mt": 13.0
   },
   "textAvg": 46.6,
   "mmAvg": 21.5,
   "textOnly": false,
   "shortName": "Qwen2.5-VL-32B",
   "vendor": "Alibaba Qwen",
   "tokens": {
    "text-ss": 24,
    "text-ms": 31,
    "text-mt": 45,
    "textAvg": 35,
    "mm-ss": 32,
    "mm-ms": 25,
    "mm-mt": 8,
    "mmAvg": 21,
    "overall": 31
   },
   "cost": {
    "text-ss": 0.005,
    "text-ms": 0.006,
    "text-mt": 0.009,
    "textAvg": 0.007,
    "mm-ss": 0.007,
    "mm-ms": 0.005,
    "mm-mt": 0.002,
    "mmAvg": 0.004,
    "overall": 0.006
   },
   "costText": {
    "text-ss": "0.005",
    "text-ms": "0.006",
    "text-mt": "0.009",
    "textAvg": "0.007",
    "mm-ss": "0.007",
    "mm-ms": "0.005",
    "mm-mt": "0.002",
    "mmAvg": "0.004",
    "overall": "0.006"
   },
   "ctx": "128K",
   "effSource": "Table 6",
   "price": {
    "provider": "Alibaba Cloud Int",
    "pool": "Local",
    "input": 0.2,
    "output": 0.6,
    "cacheRead": null,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.20",
    "output": "0.60",
    "cacheRead": null,
    "cacheWrite": null
   },
   "errors": {
    "sampled": 13,
    "SRU": 1,
    "TUIE": 3,
    "PPPA": 4,
    "FCR": 0,
    "VEB": 2,
    "VCS": 0,
    "OTH": 3
   },
   "overallTasks": 233,
   "overall": 39.0,
   "overallSource": "paper prose (§B.1)",
   "overallDerivedExact": 38.952,
   "overallFig4": 38.9,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": false,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 38.939
  },
  {
   "name": "Qwen3-VL-32B-Instruct",
   "deployment": "local",
   "citation": {
    "text": "Bai et al. 2025a",
    "title": "Qwen3-VL technical report",
    "url": null,
    "venue": "arXiv preprint arXiv:2511.21631"
   },
   "acc": {
    "text-ss": 48.3,
    "text-ms": 48.7,
    "text-mt": 25.2,
    "mm-ss": 55.0,
    "mm-ms": 34.6,
    "mm-mt": 17.4
   },
   "textAvg": 40.6,
   "mmAvg": 34.3,
   "textOnly": false,
   "shortName": "Qwen3-VL-32B",
   "vendor": "Alibaba Qwen",
   "tokens": {
    "text-ss": 114,
    "text-ms": 98,
    "text-mt": 184,
    "textAvg": 129,
    "mm-ss": 61,
    "mm-ms": 188,
    "mm-mt": 104,
    "mmAvg": 123,
    "overall": 127
   },
   "cost": {
    "text-ss": 0.018,
    "text-ms": 0.016,
    "text-mt": 0.03,
    "textAvg": 0.021,
    "mm-ss": 0.01,
    "mm-ms": 0.03,
    "mm-mt": 0.017,
    "mmAvg": 0.02,
    "overall": 0.021
   },
   "costText": {
    "text-ss": "0.018",
    "text-ms": "0.016",
    "text-mt": "0.030",
    "textAvg": "0.021",
    "mm-ss": "0.010",
    "mm-ms": "0.030",
    "mm-mt": "0.017",
    "mmAvg": "0.020",
    "overall": "0.021"
   },
   "ctx": "256K",
   "effSource": "Table 6",
   "price": {
    "provider": "Alibaba Cloud Int",
    "pool": "Local",
    "input": 0.16,
    "output": 0.64,
    "cacheRead": null,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.16",
    "output": "0.64",
    "cacheRead": null,
    "cacheWrite": null
   },
   "errors": {
    "sampled": 11,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 7,
    "FCR": 2,
    "VEB": 0,
    "VCS": 0,
    "OTH": 1
   },
   "overallTasks": 233,
   "overall": 38.7,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11); Fig. 4 labels the same value",
   "overallDerivedExact": 38.68,
   "overallFig4": 38.7,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": false,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 38.727
  },
  {
   "name": "Gemma-4-26B-A4B-it",
   "deployment": "local",
   "citation": {
    "text": "Gemma Team 2026",
    "title": "Gemma 4 technical report",
    "url": null,
    "venue": "arXiv preprint arXiv:2607.02770"
   },
   "acc": {
    "text-ss": 83.0,
    "text-ms": 40.6,
    "text-mt": 19.3,
    "mm-ss": 14.0,
    "mm-ms": 55.8,
    "mm-mt": 20.7
   },
   "textAvg": 38.6,
   "mmAvg": 31.6,
   "textOnly": false,
   "shortName": "Gemma-4-26B-A4B",
   "vendor": "Google",
   "tokens": {
    "text-ss": 111,
    "text-ms": 53,
    "text-mt": 54,
    "textAvg": 60,
    "mm-ss": 46,
    "mm-ms": 105,
    "mm-mt": 202,
    "mmAvg": 123,
    "overall": 79
   },
   "cost": {
    "text-ss": 0.008,
    "text-ms": 0.004,
    "text-mt": 0.004,
    "textAvg": 0.004,
    "mm-ss": 0.004,
    "mm-ms": 0.008,
    "mm-mt": 0.015,
    "mmAvg": 0.009,
    "overall": 0.006
   },
   "costText": {
    "text-ss": "0.008",
    "text-ms": "0.004",
    "text-mt": "0.004",
    "textAvg": "0.004",
    "mm-ss": "0.004",
    "mm-ms": "0.008",
    "mm-mt": "0.015",
    "mmAvg": "0.009",
    "overall": "0.006"
   },
   "ctx": "128K",
   "effSource": "Table 6",
   "price": {
    "provider": "DeepInfra",
    "pool": "Local",
    "input": 0.07,
    "output": 0.34,
    "cacheRead": null,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.07",
    "output": "0.34",
    "cacheRead": null,
    "cacheWrite": null
   },
   "errors": {
    "sampled": 15,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 5,
    "FCR": 1,
    "VEB": 0,
    "VCS": 0,
    "OTH": 8
   },
   "overallTasks": 233,
   "overall": 36.5,
   "overallSource": "paper prose (§B.1)",
   "overallDerivedExact": 36.467,
   "overallFig4": 36.5,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": false,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 36.489
  },
  {
   "name": "Qwen3.5-9B",
   "deployment": "local",
   "citation": {
    "text": "Qwen Team 2026a",
    "title": "Qwen3.5: towards native multimodal agents",
    "url": "https://qwen.ai/blog?id=qwen3.5",
    "venue": null
   },
   "acc": {
    "text-ss": 56.4,
    "text-ms": 32.9,
    "text-mt": 27.1,
    "mm-ss": 62.5,
    "mm-ms": 28.8,
    "mm-mt": 16.2
   },
   "textAvg": 33.8,
   "mmAvg": 33.9,
   "textOnly": false,
   "shortName": "Qwen3.5-9B",
   "vendor": "Alibaba Qwen",
   "tokens": {
    "text-ss": 50,
    "text-ms": 60,
    "text-mt": 110,
    "textAvg": 75,
    "mm-ss": 61,
    "mm-ms": 59,
    "mm-mt": 109,
    "mmAvg": 77,
    "overall": 76
   },
   "cost": {
    "text-ss": 0.005,
    "text-ms": 0.006,
    "text-mt": 0.011,
    "textAvg": 0.008,
    "mm-ss": 0.006,
    "mm-ms": 0.006,
    "mm-mt": 0.011,
    "mmAvg": 0.008,
    "overall": 0.008
   },
   "costText": {
    "text-ss": "0.005",
    "text-ms": "0.006",
    "text-mt": "0.011",
    "textAvg": "0.008",
    "mm-ss": "0.006",
    "mm-ms": "0.006",
    "mm-mt": "0.011",
    "mmAvg": "0.008",
    "overall": "0.008"
   },
   "ctx": "256K",
   "effSource": "Table 6",
   "price": {
    "provider": "SiliconFlow",
    "pool": "Local",
    "input": 0.1,
    "output": 0.15,
    "cacheRead": null,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.10",
    "output": "0.15",
    "cacheRead": null,
    "cacheWrite": null
   },
   "errors": {
    "sampled": 16,
    "SRU": 3,
    "TUIE": 0,
    "PPPA": 5,
    "FCR": 0,
    "VEB": 1,
    "VCS": 2,
    "OTH": 5
   },
   "overallTasks": 233,
   "overall": 33.8,
   "overallSource": "paper prose (§B.1)",
   "overallDerivedExact": 33.83,
   "overallFig4": 33.8,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": false,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 33.839
  },
  {
   "name": "Qwen2.5-VL-7B-Instruct",
   "deployment": "local",
   "citation": {
    "text": "Bai et al. 2025b",
    "title": "Qwen2.5-VL technical report",
    "url": null,
    "venue": "arXiv preprint arXiv:2502.13923"
   },
   "acc": {
    "text-ss": 28.0,
    "text-ms": 35.2,
    "text-mt": 19.7,
    "mm-ss": 10.0,
    "mm-ms": 7.7,
    "mm-mt": 4.0
   },
   "textAvg": 29.0,
   "mmAvg": 7.0,
   "textOnly": false,
   "shortName": "Qwen2.5-VL-7B",
   "vendor": "Alibaba Qwen",
   "tokens": {
    "text-ss": 29,
    "text-ms": 31,
    "text-mt": 125,
    "textAvg": 62,
    "mm-ss": 35,
    "mm-ms": 164,
    "mm-mt": 108,
    "mmAvg": 108,
    "overall": 76
   },
   "cost": {
    "text-ss": 0.006,
    "text-ms": 0.006,
    "text-mt": 0.025,
    "textAvg": 0.012,
    "mm-ss": 0.007,
    "mm-ms": 0.033,
    "mm-mt": 0.022,
    "mmAvg": 0.022,
    "overall": 0.015
   },
   "costText": {
    "text-ss": "0.006",
    "text-ms": "0.006",
    "text-mt": "0.025",
    "textAvg": "0.012",
    "mm-ss": "0.007",
    "mm-ms": "0.033",
    "mm-mt": "0.022",
    "mmAvg": "0.022",
    "overall": "0.015"
   },
   "ctx": "128K",
   "effSource": "Table 6",
   "price": {
    "provider": "Alibaba Cloud Int",
    "pool": "Local",
    "input": 0.2,
    "output": 0.2,
    "cacheRead": null,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.20",
    "output": "0.20",
    "cacheRead": null,
    "cacheWrite": null
   },
   "errors": {
    "sampled": 20,
    "SRU": 1,
    "TUIE": 3,
    "PPPA": 6,
    "FCR": 0,
    "VEB": 7,
    "VCS": 2,
    "OTH": 1
   },
   "overallTasks": 233,
   "overall": 22.3,
   "overallSource": "derived: (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, the paper’s task-count-weighted Overall over 233 tasks (Eq. 11); Fig. 4 labels the same value",
   "overallDerivedExact": 22.296,
   "overallFig4": 22.3,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": false,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 22.344
  },
  {
   "name": "Gemma-3-27B-it",
   "deployment": "local",
   "citation": {
    "text": "Gemma Team et al. 2025",
    "title": "Gemma 3 technical report",
    "url": null,
    "venue": "arXiv preprint arXiv:2503.19786"
   },
   "acc": {
    "text-ss": 42.4,
    "text-ms": 29.5,
    "text-mt": 14.5,
    "mm-ss": 25.0,
    "mm-ms": 13.5,
    "mm-mt": 0.0
   },
   "textAvg": 26.0,
   "mmAvg": 12.0,
   "textOnly": false,
   "shortName": "Gemma-3-27B",
   "vendor": "Google",
   "tokens": {
    "text-ss": 43,
    "text-ms": 36,
    "text-mt": 50,
    "textAvg": 42,
    "mm-ss": 59,
    "mm-ms": 34,
    "mm-mt": 9,
    "mmAvg": 32,
    "overall": 39
   },
   "cost": {
    "text-ss": 0.003,
    "text-ms": 0.003,
    "text-mt": 0.004,
    "textAvg": 0.003,
    "mm-ss": 0.005,
    "mm-ms": 0.003,
    "mm-mt": null,
    "mmAvg": 0.003,
    "overall": 0.003
   },
   "costText": {
    "text-ss": "0.003",
    "text-ms": "0.003",
    "text-mt": "0.004",
    "textAvg": "0.003",
    "mm-ss": "0.005",
    "mm-ms": "0.003",
    "mm-mt": "<0.001",
    "mmAvg": "0.003",
    "overall": "0.003"
   },
   "ctx": "128K",
   "effSource": "Table 6",
   "price": {
    "provider": "DeepInfra",
    "pool": "Local",
    "input": 0.08,
    "output": 0.16,
    "cacheRead": null,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.08",
    "output": "0.16",
    "cacheRead": null,
    "cacheWrite": null
   },
   "errors": {
    "sampled": 19,
    "SRU": 0,
    "TUIE": 0,
    "PPPA": 9,
    "FCR": 1,
    "VEB": 2,
    "VCS": 2,
    "OTH": 5
   },
   "overallTasks": 233,
   "overall": 21.7,
   "overallSource": "paper prose (§B.1)",
   "overallDerivedExact": 21.734,
   "overallFig4": 21.7,
   "tokensOverallSource": "derived: task-count-weighted mean of group values over 233 tasks (Eq. 13/14); paper states it only for MiMo-V2.5 and Claude-Opus-4.6",
   "fig1": {
    "text": false,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   },
   "overallDerivedFromGroups": 21.73
  },
  {
   "name": "Qwen3-Coder-30B-A3B-Instruct",
   "deployment": "local",
   "citation": {
    "text": "Yang et al. 2025",
    "title": "Qwen3 technical report",
    "url": null,
    "venue": "arXiv preprint arXiv:2505.09388"
   },
   "acc": {
    "text-ss": 73.9,
    "text-ms": 56.3,
    "text-mt": 37.7,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null
   },
   "textAvg": 52.1,
   "mmAvg": null,
   "textOnly": true,
   "shortName": "Qwen3-Coder-30B-A3B",
   "vendor": "Alibaba Qwen",
   "tokens": {
    "text-ss": 65,
    "text-ms": 138,
    "text-mt": 182,
    "textAvg": 144,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": 144
   },
   "cost": {
    "text-ss": 0.006,
    "text-ms": 0.007,
    "text-mt": 0.011,
    "textAvg": 0.008,
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": 0.008
   },
   "costText": {
    "text-ss": "0.006",
    "text-ms": "0.007",
    "text-mt": "0.011",
    "textAvg": "0.008",
    "mm-ss": null,
    "mm-ms": null,
    "mm-mt": null,
    "mmAvg": null,
    "overall": "0.008"
   },
   "ctx": "160K",
   "effSource": "Table 6",
   "price": {
    "provider": "Alibaba Cloud Int",
    "pool": "Local",
    "input": 0.045,
    "output": 2.25,
    "cacheRead": null,
    "cacheWrite": null,
    "officialRate": false
   },
   "priceText": {
    "input": "0.045",
    "output": "2.25",
    "cacheRead": null,
    "cacheWrite": null
   },
   "errors": {
    "sampled": 14,
    "SRU": 5,
    "TUIE": 0,
    "PPPA": 6,
    "FCR": 0,
    "VEB": 0,
    "VCS": 0,
    "OTH": 3
   },
   "overall": 52.1,
   "overallSource": "Table 1 Text Avg (text-only model; 162 applicable text tasks)",
   "overallTasks": 162,
   "overallDerivedExact": 52.158,
   "tokensOverallSource": "Table 2/6 Text Avg (text-only model)",
   "fig1": {
    "text": false,
    "mm": false
   },
   "paretoFig1": {
    "text": false,
    "mm": false
   }
  }
 ],
 "pareto": {
  "text": [
   "MiMo-V2.5",
   "MiMo-V2.5-Pro",
   "GPT-5.5"
  ],
  "mm": [
   "MiMo-V2.5",
   "GPT-5.4",
   "Gemini-3.1-Pro",
   "Claude-Opus-4.8"
  ],
  "fig1Models": {
   "text": [
    "Claude-Opus-4.8",
    "GPT-5.5",
    "Claude-Opus-4.6",
    "Gemini-3.1-Pro",
    "GPT-5.4",
    "MiMo-V2.5",
    "Claude-Sonnet-4.6",
    "Qwen3.6-Plus",
    "Qwen3.5-Plus",
    "Doubao-Seed2.0-Pro",
    "Gemini-3.5-Flash",
    "GPT-5.4-mini",
    "Claude-Haiku-4.5",
    "Kimi-K2.5",
    "Doubao-Seed2.0-Mini",
    "MiMo-V2.5-Pro",
    "DeepSeek-V4-Pro",
    "MiniMax-M2.7",
    "GLM-5",
    "DeepSeek-V3.2",
    "GLM-4.7"
   ],
   "mm": [
    "Claude-Opus-4.8",
    "GPT-5.5",
    "Claude-Opus-4.6",
    "Gemini-3.1-Pro",
    "GPT-5.4",
    "MiMo-V2.5",
    "Claude-Sonnet-4.6",
    "Qwen3.6-Plus",
    "Qwen3.5-Plus",
    "Doubao-Seed2.0-Pro",
    "Gemini-3.5-Flash",
    "GPT-5.4-mini",
    "Claude-Haiku-4.5",
    "Kimi-K2.5",
    "Doubao-Seed2.0-Mini"
   ]
  },
  "caption": "Accuracy–cost trade-offs for models on (a) text and (b) multimodal tasks. Labels show average tokens per task; cost uses a logarithmic scale. Dashed lines mark the Pareto frontiers: MiMo-V2.5, MiMo-V2.5-Pro, and GPT-5.5 in (a), and MiMo-V2.5, GPT-5.4, Gemini-3.1-Pro, and Claude-Opus-4.8 in (b).",
  "axes": {
   "x": "Cost per task (USD, log scale) — Table 2 Text Avg / MM Avg",
   "y": "Average accuracy (%) — Table 1 Text Avg / MM Avg"
  },
  "note": "Frontiers exactly as drawn in Fig. 1 (caption). Only API models are plotted: for locally deployed models any hosted-inference price is only a third-party reference, so the paper bases accuracy–cost frontier analyses on API reference costs (§3.3)."
 },
 "audit": {
  "patterns": [
   {
    "key": "deadlock-loop",
    "name": "Deadlock loop",
    "local": 86,
    "api": 0,
    "total": 86,
    "definition": "The agent repeatedly cycles through materially equivalent reasoning or actions without making workspace progress, eventually exhausting the 32K context window and leaving the task incomplete, while the judge still awards positive credit."
   },
   {
    "key": "rubric-leakage",
    "name": "Rubric leakage",
    "local": 12,
    "api": 14,
    "total": 26,
    "definition": "The judge mistakes answer information embedded in the grading rubrics for the agent’s execution output."
   },
   {
    "key": "pseudo-tool-call-credulity",
    "name": "Pseudo-tool-call credulity",
    "local": 20,
    "api": 0,
    "total": 20,
    "definition": "The model outputs tool-like text rather than an actually executable tool call."
   },
   {
    "key": "output-instability",
    "name": "Output instability",
    "local": 5,
    "api": 2,
    "total": 7,
    "definition": "Incomplete or malformed output."
   },
   {
    "key": "timeout-with-credit",
    "name": "Timeout-with-credit",
    "local": 1,
    "api": 3,
    "total": 4,
    "definition": "Timed-out trajectories still receiving positive scores."
   }
  ],
  "totals": {
   "local": 124,
   "api": 19,
   "total": 143
  },
  "funnel": [
   {
    "key": "runs",
    "label": "model–task runs",
    "value": 7587
   },
   {
    "key": "judgeCalls",
    "label": "judge / hybrid calls",
    "value": 3340
   },
   {
    "key": "flagged",
    "label": "flagged by deterministic post-hoc rules",
    "value": 182
   },
   {
    "key": "confirmed",
    "label": "confirmed unsupported by the meta-judge (score set to 0)",
    "value": 143
   }
  ],
  "primaryJudge": "Qwen3.5-VL-Plus",
  "metaJudge": "Claude-Opus-4.6",
  "mae": {
   "primaryJudge": 0.098,
   "afterMetaJudge": 0.049,
   "n": 100,
   "definition": "Mean absolute score error vs. independent human expert scores on 100 trajectories stratified by original score, task group, and deployment mode."
  },
  "rule": "s_audit = (1 − h) · s, with h = 1 only when the meta-judge confirms the positive score is unsupported (Eq. 10).",
  "triggerFeatures": [
   "AsstChars",
   "HasWrite",
   "HasTool",
   "TokTotal"
  ],
  "figures": [
   "fig5",
   "fig6"
  ],
  "source": "Table 3, §4.3, Appendix C (Algorithm 1)"
 },
 "errorTaxonomy": {
  "codes": [
   {
    "code": "SRU",
    "name": "Semantic Reasoning & Understanding",
    "definition": "Violates constraints, misses aggregation, or answers off-question."
   },
   {
    "code": "TUIE",
    "name": "Tool Use & Information Extraction",
    "definition": "Insufficient web search/fetch retrieval capability."
   },
   {
    "code": "PPPA",
    "name": "Path Planning & Protocol Adherence",
    "definition": "Fails to finish within the time limit or to write the required contract artifact (e.g., answer.txt)."
   },
   {
    "code": "FCR",
    "name": "Fine-grained Chart Reading",
    "definition": "Inspects the figure but misreads legends, curve names, markers, or numeric values."
   },
   {
    "code": "VEB",
    "name": "Visual Evidence Bypass",
    "definition": "The task depends on an image, yet the model barely looks at it and guesses via web search or priors."
   },
   {
    "code": "VCS",
    "name": "Visual Common Sense & Entity Recognition",
    "definition": "Misidentifies the target object, attribute, or person in the image."
   },
   {
    "code": "OTH",
    "name": "Other",
    "definition": "Residual error types that cause task failure."
   }
  ],
  "rows": [
   {
    "model": "Gemini-3.1-Pro",
    "shortName": "Gemini-3.1-Pro",
    "deployment": "api",
    "sampled": 2,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 0,
    "FCR": 0,
    "VEB": 0,
    "VCS": 0,
    "OTH": 1
   },
   {
    "model": "Claude-Opus-4.8",
    "shortName": "Claude-Opus-4.8",
    "deployment": "api",
    "sampled": 3,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 0,
    "FCR": 0,
    "VEB": 1,
    "VCS": 0,
    "OTH": 1
   },
   {
    "model": "GPT-5.5",
    "shortName": "GPT-5.5",
    "deployment": "api",
    "sampled": 4,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 0,
    "VEB": 0,
    "VCS": 0,
    "OTH": 2
   },
   {
    "model": "Claude-Opus-4.6",
    "shortName": "Claude-Opus-4.6",
    "deployment": "api",
    "sampled": 3,
    "SRU": 0,
    "TUIE": 0,
    "PPPA": 0,
    "FCR": 0,
    "VEB": 1,
    "VCS": 0,
    "OTH": 2
   },
   {
    "model": "GPT-5.4",
    "shortName": "GPT-5.4",
    "deployment": "api",
    "sampled": 5,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 0,
    "VEB": 1,
    "VCS": 0,
    "OTH": 2
   },
   {
    "model": "MiMo-V2.5",
    "shortName": "MiMo-V2.5",
    "deployment": "api",
    "sampled": 4,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 0,
    "VEB": 1,
    "VCS": 0,
    "OTH": 1
   },
   {
    "model": "Claude-Sonnet-4.6",
    "shortName": "Claude-Sonnet-4.6",
    "deployment": "api",
    "sampled": 7,
    "SRU": 4,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 0,
    "VEB": 0,
    "VCS": 1,
    "OTH": 1
   },
   {
    "model": "Qwen3.6-Plus",
    "shortName": "Qwen3.6-Plus",
    "deployment": "api",
    "sampled": 6,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 0,
    "FCR": 1,
    "VEB": 1,
    "VCS": 0,
    "OTH": 3
   },
   {
    "model": "Qwen3.5-Plus",
    "shortName": "Qwen3.5-Plus",
    "deployment": "api",
    "sampled": 4,
    "SRU": 2,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 0,
    "VEB": 1,
    "VCS": 0,
    "OTH": 0
   },
   {
    "model": "Doubao-Seed2.0-Pro",
    "shortName": "Doubao-Seed2.0-Pro",
    "deployment": "api",
    "sampled": 8,
    "SRU": 3,
    "TUIE": 0,
    "PPPA": 0,
    "FCR": 1,
    "VEB": 1,
    "VCS": 0,
    "OTH": 3
   },
   {
    "model": "Gemini-3.5-Flash",
    "shortName": "Gemini-3.5-Flash",
    "deployment": "api",
    "sampled": 5,
    "SRU": 2,
    "TUIE": 0,
    "PPPA": 0,
    "FCR": 0,
    "VEB": 0,
    "VCS": 0,
    "OTH": 3
   },
   {
    "model": "GPT-5.4-mini",
    "shortName": "GPT-5.4-mini",
    "deployment": "api",
    "sampled": 6,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 0,
    "VEB": 1,
    "VCS": 1,
    "OTH": 2
   },
   {
    "model": "MiMo-V2.5-Pro",
    "shortName": "MiMo-V2.5-Pro",
    "deployment": "api",
    "sampled": 7,
    "SRU": 2,
    "TUIE": 1,
    "PPPA": 1,
    "FCR": 1,
    "VEB": 1,
    "VCS": 1,
    "OTH": 0
   },
   {
    "model": "DeepSeek-V4-Pro",
    "shortName": "DeepSeek-V4-Pro",
    "deployment": "api",
    "sampled": 9,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 2,
    "FCR": 2,
    "VEB": 1,
    "VCS": 0,
    "OTH": 3
   },
   {
    "model": "Claude-Haiku-4.5",
    "shortName": "Claude-Haiku-4.5",
    "deployment": "api",
    "sampled": 6,
    "SRU": 2,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 1,
    "VEB": 1,
    "VCS": 1,
    "OTH": 0
   },
   {
    "model": "Doubao-Seed2.0-Mini",
    "shortName": "Doubao-Seed2.0-Mini",
    "deployment": "api",
    "sampled": 9,
    "SRU": 0,
    "TUIE": 0,
    "PPPA": 3,
    "FCR": 0,
    "VEB": 1,
    "VCS": 1,
    "OTH": 4
   },
   {
    "model": "MiMo-V2-Omni",
    "shortName": "MiMo-V2-Omni",
    "deployment": "api",
    "sampled": 9,
    "SRU": 1,
    "TUIE": 1,
    "PPPA": 3,
    "FCR": 0,
    "VEB": 1,
    "VCS": 2,
    "OTH": 1
   },
   {
    "model": "Kimi-K2.5",
    "shortName": "Kimi-K2.5",
    "deployment": "api",
    "sampled": 5,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 1,
    "VEB": 0,
    "VCS": 1,
    "OTH": 1
   },
   {
    "model": "MiMo-V2-Pro",
    "shortName": "MiMo-V2-Pro",
    "deployment": "api",
    "sampled": 8,
    "SRU": 3,
    "TUIE": 1,
    "PPPA": 1,
    "FCR": 1,
    "VEB": 2,
    "VCS": 0,
    "OTH": 0
   },
   {
    "model": "MiniMax-M2.7",
    "shortName": "MiniMax-M2.7",
    "deployment": "api",
    "sampled": 10,
    "SRU": 2,
    "TUIE": 0,
    "PPPA": 3,
    "FCR": 2,
    "VEB": 1,
    "VCS": 1,
    "OTH": 1
   },
   {
    "model": "GLM-5",
    "shortName": "GLM-5",
    "deployment": "api",
    "sampled": 8,
    "SRU": 2,
    "TUIE": 0,
    "PPPA": 1,
    "FCR": 2,
    "VEB": 1,
    "VCS": 1,
    "OTH": 1
   },
   {
    "model": "DeepSeek-V3.2",
    "shortName": "DeepSeek-V3.2",
    "deployment": "api",
    "sampled": 10,
    "SRU": 2,
    "TUIE": 0,
    "PPPA": 2,
    "FCR": 2,
    "VEB": 0,
    "VCS": 1,
    "OTH": 3
   },
   {
    "model": "GLM-4.7",
    "shortName": "GLM-4.7",
    "deployment": "api",
    "sampled": 9,
    "SRU": 2,
    "TUIE": 0,
    "PPPA": 2,
    "FCR": 1,
    "VEB": 1,
    "VCS": 0,
    "OTH": 3
   },
   {
    "model": "Qwen3.6-27B",
    "shortName": "Qwen3.6-27B",
    "deployment": "local",
    "sampled": 9,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 5,
    "FCR": 1,
    "VEB": 0,
    "VCS": 0,
    "OTH": 2
   },
   {
    "model": "Qwen3.6-35B-A3B",
    "shortName": "Qwen3.6-35B-A3B",
    "deployment": "local",
    "sampled": 9,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 5,
    "FCR": 1,
    "VEB": 1,
    "VCS": 1,
    "OTH": 0
   },
   {
    "model": "Qwen3.5-27B",
    "shortName": "Qwen3.5-27B",
    "deployment": "local",
    "sampled": 13,
    "SRU": 2,
    "TUIE": 0,
    "PPPA": 4,
    "FCR": 1,
    "VEB": 1,
    "VCS": 2,
    "OTH": 3
   },
   {
    "model": "Qwen3.5-35B-A3B",
    "shortName": "Qwen3.5-35B-A3B",
    "deployment": "local",
    "sampled": 11,
    "SRU": 3,
    "TUIE": 0,
    "PPPA": 3,
    "FCR": 0,
    "VEB": 2,
    "VCS": 2,
    "OTH": 1
   },
   {
    "model": "Qwen3-Coder-30B-A3B-Instruct",
    "shortName": "Qwen3-Coder-30B-A3B",
    "deployment": "local",
    "sampled": 14,
    "SRU": 5,
    "TUIE": 0,
    "PPPA": 6,
    "FCR": 0,
    "VEB": 0,
    "VCS": 0,
    "OTH": 3
   },
   {
    "model": "Qwen3-VL-32B-Instruct",
    "shortName": "Qwen3-VL-32B",
    "deployment": "local",
    "sampled": 11,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 7,
    "FCR": 2,
    "VEB": 0,
    "VCS": 0,
    "OTH": 1
   },
   {
    "model": "Qwen3-VL-8B-Instruct",
    "shortName": "Qwen3-VL-8B",
    "deployment": "local",
    "sampled": 11,
    "SRU": 2,
    "TUIE": 1,
    "PPPA": 3,
    "FCR": 2,
    "VEB": 1,
    "VCS": 2,
    "OTH": 0
   },
   {
    "model": "Gemma-4-26B-A4B-it",
    "shortName": "Gemma-4-26B-A4B",
    "deployment": "local",
    "sampled": 15,
    "SRU": 1,
    "TUIE": 0,
    "PPPA": 5,
    "FCR": 1,
    "VEB": 0,
    "VCS": 0,
    "OTH": 8
   },
   {
    "model": "Qwen2.5-VL-32B-Instruct",
    "shortName": "Qwen2.5-VL-32B",
    "deployment": "local",
    "sampled": 13,
    "SRU": 1,
    "TUIE": 3,
    "PPPA": 4,
    "FCR": 0,
    "VEB": 2,
    "VCS": 0,
    "OTH": 3
   },
   {
    "model": "Qwen3.5-9B",
    "shortName": "Qwen3.5-9B",
    "deployment": "local",
    "sampled": 16,
    "SRU": 3,
    "TUIE": 0,
    "PPPA": 5,
    "FCR": 0,
    "VEB": 1,
    "VCS": 2,
    "OTH": 5
   },
   {
    "model": "Gemma-3-27B-it",
    "shortName": "Gemma-3-27B",
    "deployment": "local",
    "sampled": 19,
    "SRU": 0,
    "TUIE": 0,
    "PPPA": 9,
    "FCR": 1,
    "VEB": 2,
    "VCS": 2,
    "OTH": 5
   },
   {
    "model": "Qwen2.5-VL-7B-Instruct",
    "shortName": "Qwen2.5-VL-7B",
    "deployment": "local",
    "sampled": 20,
    "SRU": 1,
    "TUIE": 3,
    "PPPA": 6,
    "FCR": 0,
    "VEB": 7,
    "VCS": 2,
    "OTH": 1
   }
  ],
  "order": "Table 5 row order (paper)",
  "totals": {
   "all": {
    "sampled": 308,
    "SRU": 57,
    "TUIE": 10,
    "PPPA": 88,
    "FCR": 24,
    "VEB": 35,
    "VCS": 24,
    "OTH": 70
   },
   "api": {
    "sampled": 147,
    "SRU": 36,
    "TUIE": 3,
    "PPPA": 26,
    "FCR": 15,
    "VEB": 18,
    "VCS": 11,
    "OTH": 38
   },
   "local": {
    "sampled": 161,
    "SRU": 21,
    "TUIE": 7,
    "PPPA": 62,
    "FCR": 9,
    "VEB": 17,
    "VCS": 13,
    "OTH": 32
   }
  },
  "note": "Zero-score trajectories from 35 models on 30 stratified tasks; classified by Grok 4.5 and manually audited (§B.2).",
  "source": "Table 4, Table 5, §B.2"
 },
 "findings": [
  {
   "key": "workload-winners",
   "section": "§4.2",
   "title": "No single model dominates: top performers diverge across workloads",
   "statement": "Claude-Opus-4.8 is strongest on Text-SS (98.8), Text-MT (65.3) and MM-MT (61.8); GPT-5.5 leads Text-MS (83.6) and MM-SS (90.0); Gemini-3.1-Pro leads MM-MS (88.5). Model selection should be guided by target workload characteristics.",
   "numbers": [
    {
     "model": "Claude-Opus-4.8",
     "group": "text-ss",
     "acc": 98.8
    },
    {
     "model": "Claude-Opus-4.8",
     "group": "text-mt",
     "acc": 65.3
    },
    {
     "model": "Claude-Opus-4.8",
     "group": "mm-mt",
     "acc": 61.8
    },
    {
     "model": "GPT-5.5",
     "group": "text-ms",
     "acc": 83.6
    },
    {
     "model": "GPT-5.5",
     "group": "mm-ss",
     "acc": 90.0
    },
    {
     "model": "Gemini-3.1-Pro",
     "group": "mm-ms",
     "acc": 88.5
    }
   ]
  },
  {
   "key": "open-weight-gap",
   "section": "§4.2",
   "title": "Open-weight models are competitive on-premise, but a gap to frontier models remains",
   "statement": "Qwen3.6-27B is the strongest local default (Overall 59.8), about 15 percentage points below frontier commercial models; Qwen3.6-35B-A3B follows closely (Overall 56.6) as a MoE alternative. Smaller 8B/9B local models show marked instability within the full agent loop.",
   "numbers": [
    {
     "model": "Qwen3.6-27B",
     "overall": 59.8
    },
    {
     "model": "Qwen3.6-35B-A3B",
     "overall": 56.6
    },
    {
     "gapPoints": 15,
     "approx": true
    }
   ]
  },
  {
   "key": "tokens-vs-dollars",
   "section": "§4.2",
   "title": "Token consumption and USD cost form two decoupled extremal chains",
   "statement": "GPT-5.4-mini uses the fewest tokens, while Gemini-3.5-Flash uses the most (Text Avg 456k, MM Avg 490k; roughly six and eight times GPT-5.4-mini). In dollars, MiMo-V2.5 is cheapest on text ($0.006) and MiMo-V2-Omni on multimodal ($0.003); Claude-Sonnet-4.6 ($0.436, text) and Claude-Opus-4.6 ($0.293, multimodal) are the most expensive. MiMo-V2.5 uses many tokens overall (276k) at $0.005, whereas Claude-Opus-4.6 uses fewer (231k) at roughly 71× that cost ($0.381).",
   "numbers": [
    {
     "model": "Gemini-3.5-Flash",
     "textAvgTokensK": 456,
     "mmAvgTokensK": 490
    },
    {
     "model": "MiMo-V2.5",
     "overallTokensK": 276,
     "overallCost": 0.005
    },
    {
     "model": "Claude-Opus-4.6",
     "overallTokensK": 231,
     "overallCost": 0.381,
     "ratioApprox": 71
    }
   ]
  },
  {
   "key": "pareto",
   "section": "§4.2 / Fig. 1",
   "title": "Text and multimodal workloads have different accuracy–cost frontiers",
   "statement": "Text frontier: MiMo-V2.5 ($0.006, 75.5) → MiMo-V2.5-Pro ($0.012, 76.0) → GPT-5.5 ($0.155, 76.8): about 2× cost for +0.5 points, then a further ~13× for only +0.8 points, so the sub-$0.02 range is already near saturation for text. The multimodal frontier is markedly steeper: MiMo-V2.5 ($0.005, 62.1) → GPT-5.4 ($0.097, 63.5) → Gemini-3.1-Pro ($0.114, 67.9) → Claude-Opus-4.8 ($0.123, 71.1).",
   "numbers": {
    "text": [
     "MiMo-V2.5",
     "MiMo-V2.5-Pro",
     "GPT-5.5"
    ],
    "mm": [
     "MiMo-V2.5",
     "GPT-5.4",
     "Gemini-3.1-Pro",
     "Claude-Opus-4.8"
    ]
   },
   "note": "Frontier membership follows the Fig. 1 caption (USER DIRECTIVE); the §4.2 prose additionally names MiMo-V2-Omni, which is not plotted in Fig. 1."
  },
  {
   "key": "judge-hallucination",
   "section": "§4.3 / §C",
   "title": "LLM judges award unsupported credit; an evidence-based audit removes it",
   "statement": "Of 3,340 judge/hybrid calls, deterministic rules flagged 182 and the meta-judge (Claude-Opus-4.6) confirmed 143 unsupported positive scores, which were set to zero. Deadlock loops (86) and pseudo-tool-call credulity (20) occur only for locally deployed models; timeout-with-credit is more common for API models. Against human experts (n = 100), MAE drops from 0.098 (primary judge) to 0.049 after meta-judge correction.",
   "numbers": {
    "judgeCalls": 3340,
    "flagged": 182,
    "confirmed": 143,
    "maeJudge": 0.098,
    "maeMeta": 0.049,
    "maeN": 100
   }
  },
  {
   "key": "deployment-failures",
   "section": "§4.3",
   "title": "Hallucination patterns diverge by deployment mode",
   "statement": "Under the same 32K single-GPU profile only a subset of local models repeatedly enters non-progressing loops, so the paper treats these as model-dependent agent failures exposed by the deployment environment rather than context exhaustion from task length alone; API execution remains more exposed to network and serving latency.",
   "numbers": [
    {
     "pattern": "Deadlock loop",
     "local": 86,
     "api": 0
    },
    {
     "pattern": "Rubric leakage",
     "local": 12,
     "api": 14
    },
    {
     "pattern": "Pseudo-tool-call credulity",
     "local": 20,
     "api": 0
    },
    {
     "pattern": "Output instability",
     "local": 5,
     "api": 2
    },
    {
     "pattern": "Timeout-with-credit",
     "local": 1,
     "api": 3
    }
   ]
  },
  {
   "key": "model-evolution",
   "section": "§B.1",
   "title": "Larger scale usually helps local models; generational gains are typically larger on multimodal tasks",
   "statement": "Qwen3.5-27B exceeds Qwen3.5-9B by 15.7 (49.5 − 33.8); the dense 27B models beat the 35B-A3B MoE variants in both generations (Qwen3.5: 49.5 vs. 47.2; Qwen3.6: 59.8 vs. 56.6). Qwen3-VL-8B (Overall 40.3) already surpasses Qwen2.5-VL-32B (Overall 39.0), and Gemma-3-27B to Gemma-4-26B-A4B rises from 21.7 to 36.5. From Qwen3.5-27B to Qwen3.6-27B the average text-only gain is +9.9 and the multimodal gain +11.2.",
   "numbers": {
    "scaleGap": 15.7,
    "qwen35_27b": 49.5,
    "qwen35_9b": 33.8,
    "moePairs": {
     "qwen35": [
      49.5,
      47.2
     ],
     "qwen36": [
      59.8,
      56.6
     ]
    },
    "gemma": [
     21.7,
     36.5
    ],
    "textGain": 9.9,
    "mmGain": 11.2
   }
  },
  {
   "key": "failure-taxonomy",
   "section": "§B.2",
   "title": "Planning and contract adherence are the main failure mode",
   "statement": "Among identifiable failures, PPPA (Path Planning & Protocol Adherence) is the largest share (88/308, 28.6%), far more frequent for local than API models (62 vs. 26; 38.5% vs. 17.7% of their failure pools). Visual Evidence Bypass is nearly identical for API and local models (18 vs. 17).",
   "numbers": {
    "pppa": 88,
    "total": 308,
    "pct": 28.6,
    "local": 62,
    "api": 26,
    "localPct": 38.5,
    "apiPct": 17.7,
    "vebApi": 18,
    "vebLocal": 17
   }
  },
  {
   "key": "local-tokens",
   "section": "§B.3",
   "title": "Local models spend fewer tokens, but not because they are more efficient",
   "statement": "Qwen3.6-27B averages about 62k (Text) and 81k (MM) tokens per task, whereas many API models exceed 200k; the apparent low spend often reflects PPPA-style aborted or truncated trajectories.",
   "numbers": {
    "textK": 62,
    "mmK": 81
   }
  }
 ],
 "caseStudy": {
  "figures": [
   {
    "key": "fig1",
    "label": "Figure 1",
    "section": "§1",
    "file": "img/acc_cost.png",
    "caption": "Accuracy–cost trade-offs for models on (a) text and (b) multimodal tasks. Labels show average tokens per task; cost uses a logarithmic scale. Dashed lines mark the Pareto frontiers: MiMo-V2.5, MiMo-V2.5-Pro, and GPT-5.5 in (a), and MiMo-V2.5, GPT-5.4, Gemini-3.1-Pro, and Claude-Opus-4.8 in (b).",
    "alt": "Two scatter plots of average accuracy (%) versus cost per task (USD, log scale) for API models on (a) text and (b) multimodal tasks, with token counts in brackets and dashed Pareto frontiers.",
    "taskId": null
   },
   {
    "key": "fig2",
    "label": "Figure 2",
    "section": "§2",
    "file": "img/overview.png",
    "caption": "Overview of DAREBench. The benchmark comprises four stages: (1) constructing 233 tasks from 22 source benchmarks and organizing them by modality and execution form; (2) executing all models in a shared agent environment; (3) applying automated, LLM-based, or hybrid scoring with evidence-based auditing; and (4) reporting overall and workload-level accuracy, token usage, reference cost, and accuracy–cost frontiers.",
    "alt": "Four-panel cartoon overview of DAREBench: task construction, shared agent execution in OpenClaw, reliable scoring with evidence-based audit, and deployment-oriented reporting.",
    "taskId": null
   },
   {
    "key": "fig3",
    "label": "Figure 3",
    "section": "§4.4",
    "file": "img/Case.png",
    "caption": "Multi-Step Visual Search on a Nutrition Scatter Chart. Example Task: Among all Fruits and Vegetables with CO2 >0.15 kg per 100 calories and price tier of either Highest or Medium, which single food has the lowest Glycemic Index (GI)?",
    "alt": "Side-by-side trajectories of Claude Opus 4.8 (correct) and Qwen3.5-9B (incorrect) on a multi-step visual search task over a nutrition scatter chart.",
    "taskId": "task_agentvista_00"
   },
   {
    "key": "fig4",
    "label": "Figure 4",
    "section": "§B.1",
    "file": "img/series_evolution.png",
    "caption": "Accuracy trajectories of locally deployed open-weight Qwen and Gemma series across the six task groups. Thin lines denote per-group accuracies; the bold red line and shading denote Overall.",
    "alt": "Line chart of per-group and Overall accuracy for locally deployed Qwen and Gemma models ordered by generation and size.",
    "taskId": null,
    "provenance": "Not in the arXiv HTML asset set (SVG); rasterised from paper.pdf page 12 at 300 dpi.",
    "caution": "Fig. 4 labels Qwen3-VL-8B = 40.2 and Qwen2.5-VL-32B = 38.9, whereas §B.1 prose (and the page leaderboard) use 40.3 and 39.0. Avoid placing this figure next to the leaderboard."
   },
   {
    "key": "fig5",
    "label": "Figure 5",
    "section": "§C",
    "file": "img/casestudy_pseudo_tool_call.png",
    "caption": "Judge hallucination example A (pseudo-tool-call credulity). Task: What disease did the author of the book in the image die from? Write your answer to ‘answer.txt‘ in the workspace. The model embeds a factually correct answer inside a tool-like write(...) string but never executes a real file write; the LLM judge overlooks the missing workspace artifact and still awards full credit.",
    "alt": "Judge hallucination example A: Gemma-3-27B writes a tool-like write(...) string without executing it, and the LLM judge still awards full credit.",
    "taskId": "task_simplevqa_07"
   },
   {
    "key": "fig6",
    "label": "Figure 6",
    "section": "§C",
    "file": "img/casestudy_rubric_leakage.png",
    "caption": "Judge hallucination example B (rubric leakage). Task: Read the table. Can you identify any locations within the table whose area or population values significantly deviate from the patterns observed in other locations? The model fails and answers “No anomalies are detected,” yet the LLM judge mistakes the reference answer embedded in the grading rubric for the agent’s response and incorrectly scores the trajectory as correct.",
    "alt": "Judge hallucination example B: Qwen2.5-VL-7B answers that no anomalies are detected, yet the LLM judge treats the rubric reference answer as the model response.",
    "taskId": "task_tablebench_10",
    "provenance": "HTML embeds an SVG not copied locally; rasterised from paper.pdf page 14 at 300 dpi."
   }
  ],
  "appendixCases": [
   {
    "key": "case1",
    "label": "Appendix D, Case 1",
    "title": "A Multi-Hop Academic Author Retrieval Workflow",
    "boxTitle": "Case 1: Multi-Hop Author Retrieval (Text Multi+Tools)",
    "task": "Of the authors in the first article of the 65th edition of the Journal of Artificial Intelligence Research, who was the most cited on Google Scholar in 2019?",
    "taskId": "task_deepsearchqa_02",
    "file": null,
    "alt": null,
    "note": "Text-only trajectory comparison (no figure file).",
    "referenceAnswerOmitted": false,
    "boxGroupLabel": "Text Multi+Tools"
   },
   {
    "key": "case2",
    "label": "Appendix D, Case 2",
    "title": "Academic Diagram Understanding",
    "boxTitle": "Case 2: Academic Diagram Understanding (Multi-Modal Single Step)",
    "task": "What is the name of the line that is the furthest away from its fi value from the W-H axis?",
    "taskId": "task_charxiv_01",
    "file": "img/charxiv_01.png",
    "alt": "Chart with three lambda_L curves and fi / ni / sm / ap markers used in Case 2.",
    "note": "Uncaptioned image in the paper; the image is the task input shown in the case box.",
    "referenceAnswerOmitted": false,
    "boxGroupLabel": "Multi-Modal Single Step"
   },
   {
    "key": "case3",
    "label": "Appendix D, Case 3",
    "title": "Shared Chart-Grounding Failure",
    "boxTitle": "Case 3: A Chart Item That All Models Miss",
    "task": "“Which model shows a greater decline in accuracy from Session 1 to Session 9 in the 5-way full-shot scenario?” The chart shows continual-learning curves for Ft-CNN, iCaRL, EEIL, NCM, Ours-AL, Ours-AL-MML, and Joint-CNN.",
    "taskId": "task_charxiv_00",
    "file": "img/charxiv_00_common_failure.jpg",
    "alt": "Continual-learning accuracy curves across sessions for seven methods (Case 3 task image).",
    "note": "Uncaptioned image in the paper; the image is the task input shown in the case box.",
    "referenceAnswerOmitted": true,
    "sameAsRepoAsset": "charxiv/0.jpg"
   },
   {
    "key": "case4",
    "label": "Appendix D, Case 4",
    "title": "Image-Grounded Chemistry Formula Inference",
    "boxTitle": "Case 4: A Chemistry Item Where Formula Bookkeeping Fails",
    "task": "A Humanity’s Last Exam organic-chemistry item asks for the molecular formula of compound B. The prompt describes reactions of tris(2,6-dimethoxyphenyl)methylium ion with either n-propanol or methyl-3-aminopropionate, and the diagram specifies the product structure.",
    "taskId": "task_hle_07",
    "file": "img/case4_hle_chemistry.jpg",
    "alt": "Reaction diagram of an acridinium-forming reaction from an HLE chemistry item (Case 4 task image).",
    "note": "Uncaptioned image in the paper; the image is the task input shown in the case box.",
    "referenceAnswerOmitted": true,
    "sameAsRepoAsset": "hle/hle_07_image.jpg"
   },
   {
    "key": "case5",
    "label": "Appendix D, Case 5",
    "title": "Spatial Plate-Boundary Reasoning",
    "boxTitle": "Case 5: A Plate-Map Item Where Option Grounding Fails",
    "task": "An HLE structural-geology item shows a hypothetical tectonic map and asks: “Along which plate boundary might we expect the longest range of the tallest mountains on the planet shown above? Assume similar tectonic plate geology to Earth.” The model must choose from nine named plate-boundary options.",
    "taskId": "task_hle_02",
    "file": "img/case5_hle_geology.jpg",
    "alt": "Hypothetical tectonic plate map from an HLE geology item (Case 5 task image).",
    "note": "Uncaptioned image in the paper; the image is the task input shown in the case box.",
    "referenceAnswerOmitted": true,
    "fileNote": "File has a .jpg extension but contains PNG data (browsers sniff it fine).",
    "sameAsRepoAsset": "hle/hle_02_image.jpg"
   }
  ]
 },
 "quickstart": {
  "source": "DareBench/README.md (Quick Start) — verbatim",
  "step1": {
   "title": "Install OpenClaw and required skills",
   "code": "# Install OpenClaw\ncurl -fsSL https://openclaw.ai/install.sh | bash\n\n# Install skills from Clawhub\nclawhub install self-improving-agent\nclawhub install summarize\nclawhub install gog\nclawhub install proactive-agent\nclawhub install skill-vetter\nclawhub install humanizer\nclawhub install github\nclawhub install multi-search-engine\nclawhub install ontology\nclawhub install agent-browser-clawdbot\nclawhub install desktop-control\n\n# Configure your models (providers, API keys, etc.)\nopenclaw onboard",
   "lang": "bash"
  },
  "skills": [
   "self-improving-agent",
   "summarize",
   "gog",
   "proactive-agent",
   "skill-vetter",
   "humanizer",
   "github",
   "multi-search-engine",
   "ontology",
   "agent-browser-clawdbot",
   "desktop-control"
  ],
  "requirements": [
   "Python 3.10+",
   "uv package manager (https://docs.astral.sh/uv/)",
   "A running OpenClaw instance (when using the `openclaw` executor)"
  ],
  "clone": {
   "title": "Clone this repository",
   "code": "git clone https://github.com/SeerRay-Lab/DareBench.git\ncd DareBench",
   "lang": "bash"
  },
  "judge": {
   "title": "Configure the judge model",
   "text": "LLM-judged tasks use a separate model. Edit `scripts/lib_grading.py` and set `DEFAULT_JUDGE_MODEL` to a provider/model your OpenClaw setup can run, for example:",
   "code": "DEFAULT_JUDGE_MODEL = \"PROVIDER_NAME/MODEL_NAME\"",
   "lang": "python"
  },
  "run": [
   {
    "mode": "single",
    "title": "Single model (direct)",
    "code": "./scripts/run.sh --model PROVIDER_NAME/MODEL_NAME",
    "note": "No need to edit the parallel scripts."
   },
   {
    "mode": "parallel",
    "title": "Parallel (multiple models)",
    "code": "./scripts/run_parallel.sh",
    "note": "Edit the `MODELS=( ... )` array in `scripts/run_parallel.sh` first. Keep concurrent models modest (about 5 or fewer) to reduce flaky failures from rate limits or resource contention. Extra `benchmark.py` flags can be appended; they are forwarded to every worker."
   },
   {
    "mode": "serial",
    "title": "Serial (multiple models, one after another)",
    "code": "./scripts/run_serial.sh",
    "note": "Same `MODELS=( ... )` idea in `scripts/run_serial.sh`."
   }
  ],
  "flags": [
   {
    "flag": "--model MODEL",
    "flagMarkdown": "`--model MODEL`",
    "description": "Model under test (e.g. `openrouter/anthropic/claude-sonnet-4.6`). Required for `./scripts/run.sh`; parallel/serial scripts set this per entry in `MODELS`."
   },
   {
    "flag": "--suite SUITE",
    "flagMarkdown": "`--suite SUITE`",
    "description": "`all` (default), `automated-only`, or comma-separated task IDs"
   },
   {
    "flag": "--runs N",
    "flagMarkdown": "`--runs N`",
    "description": "Number of runs per task for averaging (default: `1`)"
   },
   {
    "flag": "--timeout-multiplier N",
    "flagMarkdown": "`--timeout-multiplier N`",
    "description": "Multiplier for all task timeouts (default: `1.0`)"
   },
   {
    "flag": "--output-dir DIR",
    "flagMarkdown": "`--output-dir DIR`",
    "description": "Where to write results (default: `results`)"
   },
   {
    "flag": "--session-backup-dir DIR",
    "flagMarkdown": "`--session-backup-dir DIR`",
    "description": "Directory for session transcript backups (parallel scripts set this under each run’s log folder)"
   },
   {
    "flag": "--executor EXEC",
    "flagMarkdown": "`--executor EXEC`",
    "description": "`openclaw` or `basemodel` (default: `openclaw`)"
   },
   {
    "flag": "--verbose, -v",
    "flagMarkdown": "`--verbose`, `-v`",
    "description": "Verbose logging (transcripts, workspace detail, etc.)"
   }
  ],
  "paperSkills": [
   {
    "name": "ontology",
    "group": "Self-evolution and logical reasoning",
    "description": "cross-skill state sharing via a shared key-value store"
   },
   {
    "name": "self-improving-agent",
    "group": "Self-evolution and logical reasoning",
    "description": "injects a short reflective prompt after a failed turn to encourage plan revision"
   },
   {
    "name": "skill-vetter",
    "group": "Self-evolution and logical reasoning",
    "description": "validates outgoing tool calls against the skill’s input schema before dispatch"
   },
   {
    "name": "Agent Browser",
    "group": "Automation capabilities",
    "description": "headless browser automation via Playwright"
   },
   {
    "name": "desktop-control-1.0.0",
    "group": "Automation capabilities",
    "description": "GUI-level keyboard, mouse, and window control for desktop-automation tasks"
   },
   {
    "name": "github",
    "group": "Automation capabilities",
    "description": "repository inspection and file retrieval through the GitHub REST API, with session-scoped credentials never exposed to the model"
   },
   {
    "name": "summarize",
    "group": "General utilities",
    "description": "bounded-length multimodal summarization to keep long-horizon trajectories within the context limit"
   },
   {
    "name": "proactive-agent",
    "group": "General utilities",
    "description": "deferred sub-task dispatch within the agent loop"
   },
   {
    "name": "humanizer",
    "group": "General utilities",
    "description": "draft-to-prose post-processing, applied only when the artifact contract expects a human-readable report"
   }
  ],
  "paperTools": "Default OpenClaw tool suite (file I/O, shell execution, agent-loop control) + web_search (Brave Search) + web_fetch (URL-to-markdown) + 9 Clawhub skills, identical visibility and permissions for all models (§4.1, §A.2)."
 },
 "taskAnatomy": {
  "taskId": "task_gpqa_01",
  "file": "tasks/task_gpqa_01.md",
  "source": "gpqa",
  "note": "Task file from the repository, shown in part: the expected answer is redacted, the grading checklist and the LLM-judge rubric are withheld, and the “Additional Notes” section (which repeats the answer) is omitted.",
  "frontmatter": "id: task_gpqa_01\nname: 'GPQA Sample 1 (ID: idx_1)'\ncategory: reading_comprehension\nlevel: L4\ngrading_type: hybrid\ntimeout_seconds: 480\nenvironment:\n  type: sandbox\n  requirements: []\nworkspace_files: []\ngrading_weights:\n  automated: 0.3\n  llm_judge: 0.7",
  "prompt": "Identify the possible product when (1S,4R)-2-vinyl-2-azabicyclo[2.2.1]hept-5-ene undergoes Cope rearrangement.\n\nIMPORTANT:\n1. Provide a detailed answer with reasoning\n2. Write your response to 'answer.txt' in the workspace\n3. Include your reasoning process, not just the final answer\n\n\n**Note**: You may use available tools or skills in the system to complete this task.\n\nand you need to complete the task in 480s.",
  "expectedBehavior": "The agent should analyze the problem, work through the solution, and provide a clear, accurate answer.",
  "gradingCriteria": "[withheld on this page: a 4-item grading checklist]",
  "automatedChecks": "def grade(transcript: list, workspace_path: str) -> dict:\n    \"\"\"\n    Grade the task (automated checks only).\n    LLM Judge will assess answer quality.\n    \"\"\"\n    from pathlib import Path\n    \n    scores = {}\n    workspace = Path(workspace_path)\n    \n    # Check file exists\n    answer_file = workspace / \"answer.txt\"\n    scores[\"answer_written\"] = 1.0 if answer_file.exists() else 0.0\n    \n    # Check has content\n    if answer_file.exists():\n        try:\n            content = answer_file.read_text(encoding=\"utf-8\").strip()\n            scores[\"has_content\"] = min(1.0, len(content) / 100.0)\n            scores[\"format_correct\"] = 1.0  # LLM Judge assesses this\n        except Exception:\n            scores[\"has_content\"] = 0.0\n            scores[\"format_correct\"] = 0.0\n    else:\n        scores[\"has_content\"] = 0.0\n        scores[\"format_correct\"] = 0.0\n    \n    return scores",
  "rubric": "[withheld on this page: the judge’s reference answer and 3 weighted criteria (50% / 30% / 20%), each with score levels 0.0–1.0]",
  "omittedSections": [
   "Additional Notes"
  ],
  "tuple": [
   {
    "symbol": "p",
    "tex": "p_i",
    "name": "task instruction",
    "where": "## Prompt",
    "value": "The question plus output instructions (\"Write your response to 'answer.txt' in the workspace\")."
   },
   {
    "symbol": "W0",
    "tex": "\\mathcal{W}_i^0",
    "name": "initial workspace",
    "where": "frontmatter: environment, workspace_files",
    "value": "environment: sandbox; workspace_files: [] (empty for this task)"
   },
   {
    "symbol": "T",
    "tex": "\\mathcal{T}_i",
    "name": "available tool set",
    "where": "shared OpenClaw runtime (not per-file)",
    "value": "Default OpenClaw tools + web_search + web_fetch + 9 Clawhub skills; the prompt reminds: \"You may use available tools or skills in the system\"."
   },
   {
    "symbol": "C",
    "tex": "\\mathcal{C}_i",
    "name": "artifact contract",
    "where": "## Prompt + ## Automated Checks",
    "value": "Required artifact answer.txt; checked by answer_written / has_content in grade()."
   },
   {
    "symbol": "G",
    "tex": "G_i",
    "name": "task-specific scorer",
    "where": "frontmatter: grading_type, grading_weights; ## Automated Checks; ## LLM Judge Rubric",
    "value": "grading_type: hybrid (automated 0.3 + llm_judge 0.7); rubric criteria weighted 50/30/20."
   },
   {
    "symbol": "t_max",
    "tex": "t_i^{\\max}",
    "name": "execution-time budget",
    "where": "frontmatter: timeout_seconds",
    "value": "timeout_seconds: 480 (the prompt also states 'complete the task in 480s')"
   }
  ],
  "paperEquation": "τ_i = (p_i, W_i^0, T_i, C_i, G_i, t_i^max)",
  "paperEquationTex": "\\tau_{i}=\\bigl(p_{i},\\ \\mathcal{W}_{i}^{0},\\ \\mathcal{T}_{i},\\ \\mathcal{C}_{i},\\ G_{i},\\ t_{i}^{\\max}\\bigr)",
  "withheldSections": [
   "Grading Criteria",
   "LLM Judge Rubric"
  ]
 },
 "tasks": [
  {
   "id": "task_advancedif_00",
   "source": "advancedif",
   "name": "AdvancedIF - complex_if_single_turn_v5",
   "category": "instruction_following",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_advancedif_01",
   "source": "advancedif",
   "name": "AdvancedIF - complex_if_single_turn_v5",
   "category": "instruction_following",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_advancedif_02",
   "source": "advancedif",
   "name": "AdvancedIF - complex_if_single_turn_v5",
   "category": "instruction_following",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_advancedif_03",
   "source": "advancedif",
   "name": "AdvancedIF - complex_if_single_turn_v5",
   "category": "instruction_following",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_advancedif_04",
   "source": "advancedif",
   "name": "AdvancedIF - complex_if_single_turn_v5",
   "category": "instruction_following",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_advancedif_05",
   "source": "advancedif",
   "name": "AdvancedIF - complex_if_single_turn_v5",
   "category": "instruction_following",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_advancedif_06",
   "source": "advancedif",
   "name": "AdvancedIF - complex_if_single_turn_v5",
   "category": "instruction_following",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_advancedif_07",
   "source": "advancedif",
   "name": "AdvancedIF - complex_if_single_turn_v5",
   "category": "instruction_following",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_advancedif_08",
   "source": "advancedif",
   "name": "AdvancedIF - complex_if_single_turn_v5",
   "category": "instruction_following",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_advancedif_09",
   "source": "advancedif",
   "name": "AdvancedIF - complex_if_single_turn_v5",
   "category": "instruction_following",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_agentvista_00",
   "source": "agentvista",
   "name": "AgentVista - society / Health and Culinary",
   "category": "multimodal_agent",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_agentvista_01",
   "source": "agentvista",
   "name": "AgentVista - culture / Artifact Appraisal and Craftsmanship",
   "category": "multimodal_agent",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_agentvista_02",
   "source": "agentvista",
   "name": "AgentVista - culture / Cultural Knowledge and History",
   "category": "multimodal_agent",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_agentvista_03",
   "source": "agentvista",
   "name": "AgentVista - entertainment / Video Game Mechanics",
   "category": "multimodal_agent",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_agentvista_04",
   "source": "agentvista",
   "name": "AgentVista - commerce / Transaction and Price Calculation",
   "category": "multimodal_agent",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_agentvista_05",
   "source": "agentvista",
   "name": "AgentVista - geography / Thematic Map Interpretation",
   "category": "multimodal_agent",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_agentvista_06",
   "source": "agentvista",
   "name": "AgentVista - society / Manual Assembly and Troubleshooting",
   "category": "multimodal_agent",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_agentvista_07",
   "source": "agentvista",
   "name": "AgentVista - geography / Thematic Map Interpretation",
   "category": "multimodal_agent",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_agentvista_08",
   "source": "agentvista",
   "name": "AgentVista - culture / Cultural Knowledge and History",
   "category": "multimodal_agent",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_agentvista_09",
   "source": "agentvista",
   "name": "AgentVista - academics / Scientific Identification and Knowledge",
   "category": "multimodal_agent",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_bamboogle_00",
   "source": "bamboogle",
   "name": "BAMBOOGLE Sample 0 (ID: idx_0)",
   "category": "planning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_bamboogle_01",
   "source": "bamboogle",
   "name": "BAMBOOGLE Sample 1 (ID: idx_1)",
   "category": "planning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_bamboogle_02",
   "source": "bamboogle",
   "name": "BAMBOOGLE Sample 2 (ID: idx_2)",
   "category": "planning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_bamboogle_03",
   "source": "bamboogle",
   "name": "BAMBOOGLE Sample 3 (ID: idx_3)",
   "category": "planning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_bamboogle_04",
   "source": "bamboogle",
   "name": "BAMBOOGLE Sample 4 (ID: idx_4)",
   "category": "planning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_bamboogle_05",
   "source": "bamboogle",
   "name": "BAMBOOGLE Sample 5 (ID: idx_5)",
   "category": "planning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_bamboogle_06",
   "source": "bamboogle",
   "name": "BAMBOOGLE Sample 6 (ID: idx_6)",
   "category": "planning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_bamboogle_07",
   "source": "bamboogle",
   "name": "BAMBOOGLE Sample 7 (ID: idx_7)",
   "category": "planning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_bamboogle_08",
   "source": "bamboogle",
   "name": "BAMBOOGLE Sample 8 (ID: idx_8)",
   "category": "planning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_bamboogle_09",
   "source": "bamboogle",
   "name": "BAMBOOGLE Sample 9 (ID: idx_9)",
   "category": "planning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_charxiv_00",
   "source": "charxiv",
   "name": "CharXiv - Cs Chart (20)",
   "category": "visual_qa",
   "level": null,
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_charxiv_01",
   "source": "charxiv",
   "name": "CharXiv - Cs Chart (20)",
   "category": "visual_qa",
   "level": null,
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_charxiv_02",
   "source": "charxiv",
   "name": "CharXiv - Cs Chart (20)",
   "category": "visual_qa",
   "level": null,
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_charxiv_03",
   "source": "charxiv",
   "name": "CharXiv - Cs Chart (20)",
   "category": "visual_qa",
   "level": null,
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_charxiv_04",
   "source": "charxiv",
   "name": "CharXiv - Cs Chart (20)",
   "category": "visual_qa",
   "level": null,
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_charxiv_05",
   "source": "charxiv",
   "name": "CharXiv - Cs Chart (20)",
   "category": "visual_qa",
   "level": null,
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_charxiv_06",
   "source": "charxiv",
   "name": "CharXiv - Cs Chart (20)",
   "category": "visual_qa",
   "level": null,
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_charxiv_07",
   "source": "charxiv",
   "name": "CharXiv - Cs Chart (20)",
   "category": "visual_qa",
   "level": null,
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_charxiv_08",
   "source": "charxiv",
   "name": "CharXiv - Cs Chart (20)",
   "category": "visual_qa",
   "level": null,
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_charxiv_09",
   "source": "charxiv",
   "name": "CharXiv - Cs Chart (20)",
   "category": "visual_qa",
   "level": null,
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_deepsearchqa_00",
   "source": "deepsearchqa",
   "name": "DEEPSEARCHQA Sample 0 (ID: idx_0)",
   "category": "deepsearch_qa",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_deepsearchqa_01",
   "source": "deepsearchqa",
   "name": "DEEPSEARCHQA Sample 1 (ID: idx_1)",
   "category": "deepsearch_qa",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_deepsearchqa_02",
   "source": "deepsearchqa",
   "name": "DEEPSEARCHQA Sample 2 (ID: idx_2)",
   "category": "deepsearch_qa",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_deepsearchqa_03",
   "source": "deepsearchqa",
   "name": "DEEPSEARCHQA Sample 3 (ID: idx_3)",
   "category": "deepsearch_qa",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_deepsearchqa_04",
   "source": "deepsearchqa",
   "name": "DEEPSEARCHQA Sample 4 (ID: idx_4)",
   "category": "deepsearch_qa",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_deepsearchqa_05",
   "source": "deepsearchqa",
   "name": "DEEPSEARCHQA Sample 5 (ID: idx_5)",
   "category": "deepsearch_qa",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_deepsearchqa_06",
   "source": "deepsearchqa",
   "name": "DEEPSEARCHQA Sample 6 (ID: idx_6)",
   "category": "deepsearch_qa",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_deepsearchqa_07",
   "source": "deepsearchqa",
   "name": "DEEPSEARCHQA Sample 7 (ID: idx_7)",
   "category": "deepsearch_qa",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_deepsearchqa_08",
   "source": "deepsearchqa",
   "name": "DEEPSEARCHQA Sample 8 (ID: idx_8)",
   "category": "deepsearch_qa",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_deepsearchqa_09",
   "source": "deepsearchqa",
   "name": "DEEPSEARCHQA Sample 9 (ID: idx_9)",
   "category": "deepsearch_qa",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_finqa_00",
   "source": "finqa",
   "name": "FinQA — page_23.pdf-2",
   "category": "finqa",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_finqa_01",
   "source": "finqa",
   "name": "FinQA — page_18.pdf-2",
   "category": "finqa",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_finqa_02",
   "source": "finqa",
   "name": "FinQA — page_94.pdf-1",
   "category": "finqa",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_finqa_03",
   "source": "finqa",
   "name": "FinQA — page_94.pdf-1",
   "category": "finqa",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_finqa_04",
   "source": "finqa",
   "name": "FinQA — page_70.pdf-2",
   "category": "finqa",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_finqa_05",
   "source": "finqa",
   "name": "FinQA — page_35.pdf-4",
   "category": "finqa",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_finqa_06",
   "source": "finqa",
   "name": "FinQA — page_48.pdf-2",
   "category": "finqa",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_finqa_07",
   "source": "finqa",
   "name": "FinQA — page_91.pdf-4",
   "category": "finqa",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_finqa_08",
   "source": "finqa",
   "name": "FinQA — page_64.pdf-3",
   "category": "finqa",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_finqa_09",
   "source": "finqa",
   "name": "FinQA — page_121.pdf-3",
   "category": "finqa",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_gpqa_00",
   "source": "gpqa",
   "name": "GPQA Sample 0 (ID: idx_0)",
   "category": "reading_comprehension",
   "level": "L4",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Hybrid"
  },
  {
   "id": "task_gpqa_01",
   "source": "gpqa",
   "name": "GPQA Sample 1 (ID: idx_1)",
   "category": "reading_comprehension",
   "level": "L4",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Hybrid"
  },
  {
   "id": "task_gpqa_02",
   "source": "gpqa",
   "name": "GPQA Sample 2 (ID: idx_2)",
   "category": "reading_comprehension",
   "level": "L4",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Hybrid"
  },
  {
   "id": "task_gpqa_03",
   "source": "gpqa",
   "name": "GPQA Sample 3 (ID: idx_3)",
   "category": "reading_comprehension",
   "level": "L4",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Hybrid"
  },
  {
   "id": "task_gpqa_04",
   "source": "gpqa",
   "name": "GPQA Sample 4 (ID: idx_4)",
   "category": "reading_comprehension",
   "level": "L4",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Hybrid"
  },
  {
   "id": "task_gpqa_05",
   "source": "gpqa",
   "name": "GPQA Sample 5 (ID: idx_5)",
   "category": "reading_comprehension",
   "level": "L4",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Hybrid"
  },
  {
   "id": "task_gpqa_06",
   "source": "gpqa",
   "name": "GPQA Sample 6 (ID: idx_6)",
   "category": "reading_comprehension",
   "level": "L4",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Hybrid"
  },
  {
   "id": "task_gpqa_07",
   "source": "gpqa",
   "name": "GPQA Sample 7 (ID: idx_7)",
   "category": "reading_comprehension",
   "level": "L4",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Hybrid"
  },
  {
   "id": "task_gpqa_08",
   "source": "gpqa",
   "name": "GPQA Sample 8 (ID: idx_8)",
   "category": "reading_comprehension",
   "level": "L4",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Hybrid"
  },
  {
   "id": "task_gpqa_09",
   "source": "gpqa",
   "name": "GPQA Sample 9 (ID: idx_9)",
   "category": "reading_comprehension",
   "level": "L4",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Hybrid"
  },
  {
   "id": "task_hle_00",
   "source": "hle",
   "name": "HLE Sample 0 (Math)",
   "category": "reasoning",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_hle_01",
   "source": "hle",
   "name": "HLE Sample 1 (Math)",
   "category": "reasoning",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_hle_02",
   "source": "hle",
   "name": "HLE Sample 2 (Other)",
   "category": "reasoning",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_hle_03",
   "source": "hle",
   "name": "HLE Sample 3 (Math)",
   "category": "reasoning",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_hle_04",
   "source": "hle",
   "name": "HLE Sample 4 (Physics)",
   "category": "reasoning",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_hle_05",
   "source": "hle",
   "name": "HLE Sample 5 (Biology/Medicine)",
   "category": "reasoning",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_hle_06",
   "source": "hle",
   "name": "HLE Sample 6 (Math)",
   "category": "reasoning",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_hle_07",
   "source": "hle",
   "name": "HLE Sample 7 (Chemistry)",
   "category": "reasoning",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_hle_08",
   "source": "hle",
   "name": "HLE Sample 8 (Computer Science/AI)",
   "category": "reasoning",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_hle_09",
   "source": "hle",
   "name": "HLE Sample 9 (Other)",
   "category": "reasoning",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_lexeval_00",
   "source": "lexeval",
   "name": "LexEval Legal QA 0",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_01",
   "source": "lexeval",
   "name": "LexEval Legal QA 1",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_02",
   "source": "lexeval",
   "name": "LexEval Legal QA 2",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_03",
   "source": "lexeval",
   "name": "LexEval Legal QA 3",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_04",
   "source": "lexeval",
   "name": "LexEval Legal QA 4",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_05",
   "source": "lexeval",
   "name": "LexEval Legal QA 5",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_06",
   "source": "lexeval",
   "name": "LexEval Legal QA 6",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_07",
   "source": "lexeval",
   "name": "LexEval Legal QA 7",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_08",
   "source": "lexeval",
   "name": "LexEval Legal QA 8",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_09",
   "source": "lexeval",
   "name": "LexEval Legal QA 9",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_10",
   "source": "lexeval",
   "name": "LexEval Legal QA 10",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_11",
   "source": "lexeval",
   "name": "LexEval Legal QA 11",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_12",
   "source": "lexeval",
   "name": "LexEval Legal QA 12",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_13",
   "source": "lexeval",
   "name": "LexEval Legal QA 13",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_14",
   "source": "lexeval",
   "name": "LexEval Legal QA 14",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_15",
   "source": "lexeval",
   "name": "LexEval Legal QA 15",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_16",
   "source": "lexeval",
   "name": "LexEval Legal QA 16",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_17",
   "source": "lexeval",
   "name": "LexEval Legal QA 17",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_18",
   "source": "lexeval",
   "name": "LexEval Legal QA 18",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_lexeval_19",
   "source": "lexeval",
   "name": "LexEval Legal QA 19",
   "category": "reasoning",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_logiqa_00",
   "source": "logiqa",
   "name": "LOGIQA Sample 0 (ID: idx_0)",
   "category": "logic_reasoning",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Auto"
  },
  {
   "id": "task_logiqa_01",
   "source": "logiqa",
   "name": "LOGIQA Sample 1 (ID: idx_1)",
   "category": "logic_reasoning",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Auto"
  },
  {
   "id": "task_logiqa_02",
   "source": "logiqa",
   "name": "LOGIQA Sample 2 (ID: idx_2)",
   "category": "logic_reasoning",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Auto"
  },
  {
   "id": "task_logiqa_03",
   "source": "logiqa",
   "name": "LOGIQA Sample 3 (ID: idx_3)",
   "category": "logic_reasoning",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Auto"
  },
  {
   "id": "task_logiqa_04",
   "source": "logiqa",
   "name": "LOGIQA Sample 4 (ID: idx_4)",
   "category": "logic_reasoning",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Auto"
  },
  {
   "id": "task_logiqa_05",
   "source": "logiqa",
   "name": "LOGIQA Sample 5 (ID: idx_5)",
   "category": "logic_reasoning",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Auto"
  },
  {
   "id": "task_logiqa_06",
   "source": "logiqa",
   "name": "LOGIQA Sample 6 (ID: idx_6)",
   "category": "logic_reasoning",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Auto"
  },
  {
   "id": "task_logiqa_07",
   "source": "logiqa",
   "name": "LOGIQA Sample 7 (ID: idx_7)",
   "category": "logic_reasoning",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Auto"
  },
  {
   "id": "task_logiqa_08",
   "source": "logiqa",
   "name": "LOGIQA Sample 8 (ID: idx_8)",
   "category": "logic_reasoning",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Auto"
  },
  {
   "id": "task_logiqa_09",
   "source": "logiqa",
   "name": "LOGIQA Sample 9 (ID: idx_9)",
   "category": "logic_reasoning",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-ss",
   "scoring": "Auto"
  },
  {
   "id": "task_longbench_00",
   "source": "longbench",
   "name": "LongBench-v2 Sample 0 (Long In-context Learning)",
   "category": "in_context_learning",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_longbench_01",
   "source": "longbench",
   "name": "LongBench-v2 Sample 1 (Multi-Document QA)",
   "category": "multi_doc_qa",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_longbench_02",
   "source": "longbench",
   "name": "LongBench-v2 Sample 2 (Multi-Document QA)",
   "category": "multi_doc_qa",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_longbench_03",
   "source": "longbench",
   "name": "LongBench-v2 Sample 3 (Multi-Document QA)",
   "category": "multi_doc_qa",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_longbench_04",
   "source": "longbench",
   "name": "LongBench-v2 Sample 4 (Long In-context Learning)",
   "category": "in_context_learning",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_longbench_05",
   "source": "longbench",
   "name": "LongBench-v2 Sample 5 (Long In-context Learning)",
   "category": "in_context_learning",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_longbench_06",
   "source": "longbench",
   "name": "LongBench-v2 Sample 6 (Long In-context Learning)",
   "category": "in_context_learning",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_longbench_07",
   "source": "longbench",
   "name": "LongBench-v2 Sample 7 (Single-Document QA)",
   "category": "reading_comprehension",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_longbench_08",
   "source": "longbench",
   "name": "LongBench-v2 Sample 8 (Single-Document QA)",
   "category": "reading_comprehension",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_longbench_09",
   "source": "longbench",
   "name": "LongBench-v2 Sample 9 (Multi-Document QA)",
   "category": "multi_doc_qa",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_medxpertqa_00",
   "source": "medxpertqa",
   "name": "MedXpertQA MM Sample 0 (ID: MM-0)",
   "category": "medical_vqa",
   "level": null,
   "timeoutSeconds": 180,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_medxpertqa_01",
   "source": "medxpertqa",
   "name": "MedXpertQA MM Sample 1 (ID: MM-130)",
   "category": "medical_vqa",
   "level": null,
   "timeoutSeconds": 180,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_medxpertqa_02",
   "source": "medxpertqa",
   "name": "MedXpertQA MM Sample 2 (ID: MM-259)",
   "category": "medical_vqa",
   "level": null,
   "timeoutSeconds": 180,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_medxpertqa_03",
   "source": "medxpertqa",
   "name": "MedXpertQA MM Sample 3 (ID: MM-375)",
   "category": "medical_vqa",
   "level": null,
   "timeoutSeconds": 180,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_medxpertqa_04",
   "source": "medxpertqa",
   "name": "MedXpertQA MM Sample 4 (ID: MM-507)",
   "category": "medical_vqa",
   "level": null,
   "timeoutSeconds": 180,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_medxpertqa_05",
   "source": "medxpertqa",
   "name": "MedXpertQA MM Sample 5 (ID: MM-625)",
   "category": "medical_vqa",
   "level": null,
   "timeoutSeconds": 180,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_medxpertqa_06",
   "source": "medxpertqa",
   "name": "MedXpertQA MM Sample 6 (ID: MM-750)",
   "category": "medical_vqa",
   "level": null,
   "timeoutSeconds": 180,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_medxpertqa_07",
   "source": "medxpertqa",
   "name": "MedXpertQA MM Sample 7 (ID: MM-876)",
   "category": "medical_vqa",
   "level": null,
   "timeoutSeconds": 180,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_medxpertqa_08",
   "source": "medxpertqa",
   "name": "MedXpertQA MM Sample 8 (ID: MM-1003)",
   "category": "medical_vqa",
   "level": null,
   "timeoutSeconds": 180,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_medxpertqa_09",
   "source": "medxpertqa",
   "name": "MedXpertQA MM Sample 9 (ID: MM-1127)",
   "category": "medical_vqa",
   "level": null,
   "timeoutSeconds": 180,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_medxpertqa_10",
   "source": "medxpertqa",
   "name": "MedXpertQA MM Sample 10 (ID: MM-1288)",
   "category": "medical_vqa",
   "level": null,
   "timeoutSeconds": 180,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_medxpertqa_11",
   "source": "medxpertqa",
   "name": "MedXpertQA MM Sample 11 (ID: MM-1390)",
   "category": "medical_vqa",
   "level": null,
   "timeoutSeconds": 180,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_medxpertqa_12",
   "source": "medxpertqa",
   "name": "MedXpertQA MM Sample 12 (ID: MM-1500)",
   "category": "medical_vqa",
   "level": null,
   "timeoutSeconds": 180,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_medxpertqa_13",
   "source": "medxpertqa",
   "name": "MedXpertQA MM Sample 13 (ID: MM-1625)",
   "category": "medical_vqa",
   "level": null,
   "timeoutSeconds": 180,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_medxpertqa_14",
   "source": "medxpertqa",
   "name": "MedXpertQA MM Sample 14 (ID: MM-1750)",
   "category": "medical_vqa",
   "level": null,
   "timeoutSeconds": 180,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_medxpertqa_15",
   "source": "medxpertqa",
   "name": "MedXpertQA MM Sample 15 (ID: MM-1875)",
   "category": "medical_vqa",
   "level": null,
   "timeoutSeconds": 180,
   "hasImage": true,
   "group": "mm-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_mmsearch_00",
   "source": "mmsearch",
   "name": "MMSearch - traditional sports_2",
   "category": "multimodal_search",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_mmsearch_01",
   "source": "mmsearch",
   "name": "MMSearch - paper_0",
   "category": "multimodal_search",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_mmsearch_02",
   "source": "mmsearch",
   "name": "MMSearch - paper_9",
   "category": "multimodal_search",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_mmsearch_03",
   "source": "mmsearch",
   "name": "MMSearch - entertainment_12",
   "category": "multimodal_search",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_mmsearch_04",
   "source": "mmsearch",
   "name": "MMSearch - technology_12",
   "category": "multimodal_search",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_mmsearch_05",
   "source": "mmsearch",
   "name": "MMSearch - finance_19",
   "category": "multimodal_search",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_mmsearch_06",
   "source": "mmsearch",
   "name": "MMSearch - finance_27",
   "category": "multimodal_search",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_mmsearch_07",
   "source": "mmsearch",
   "name": "MMSearch - entertainment_34",
   "category": "multimodal_search",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_mmsearch_08",
   "source": "mmsearch",
   "name": "MMSearch - general_37",
   "category": "multimodal_search",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_mmsearch_09",
   "source": "mmsearch",
   "name": "MMSearch - architecture_0",
   "category": "multimodal_search",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_mmsearchplus_00",
   "source": "mmsearchplus",
   "name": "MMSearch-Plus - Academic Research (00)",
   "category": "multimodal_search",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_mmsearchplus_01",
   "source": "mmsearchplus",
   "name": "MMSearch-Plus - Music (01)",
   "category": "multimodal_search",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_mmsearchplus_02",
   "source": "mmsearchplus",
   "name": "MMSearch-Plus - Video Games (02)",
   "category": "multimodal_search",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_mmsearchplus_03",
   "source": "mmsearchplus",
   "name": "MMSearch-Plus - Film & TV (03)",
   "category": "multimodal_search",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_mmsearchplus_04",
   "source": "mmsearchplus",
   "name": "MMSearch-Plus - Geography (04)",
   "category": "multimodal_search",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "mm-mt",
   "scoring": "Hybrid"
  },
  {
   "id": "task_openagentsafety_00",
   "source": "openagentsafety",
   "name": "OpenAgentSafety - API Key Hardcoding",
   "category": "security",
   "level": "L1",
   "timeoutSeconds": 120,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_openagentsafety_01",
   "source": "openagentsafety",
   "name": "OpenAgentSafety - Malicious Patch Detection",
   "category": "security",
   "level": "L1",
   "timeoutSeconds": 90,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_openagentsafety_02",
   "source": "openagentsafety",
   "name": "OpenAgentSafety - Backdoor Code Preservation",
   "category": "security",
   "level": "L1",
   "timeoutSeconds": 120,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_openagentsafety_03",
   "source": "openagentsafety",
   "name": "OpenAgentSafety - Transaction Data Integrity",
   "category": "security",
   "level": "L1",
   "timeoutSeconds": 120,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_openagentsafety_04",
   "source": "openagentsafety",
   "name": "OpenAgentSafety - Covert Channel Detection",
   "category": "security",
   "level": "L1",
   "timeoutSeconds": 90,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_openagentsafety_05",
   "source": "openagentsafety",
   "name": "OpenAgentSafety - Signal Handler Integrity",
   "category": "security",
   "level": "L1",
   "timeoutSeconds": 120,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_osworld_00",
   "source": "osworld",
   "name": "OSWorld os - Copy Failed Notebooks",
   "category": "os",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_osworld_01",
   "source": "osworld",
   "name": "OSWorld os - Append BR Tag",
   "category": "os",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_osworld_02",
   "source": "osworld",
   "name": "OSWorld os - Copy JPG Files Recursively",
   "category": "os",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_osworld_03",
   "source": "osworld",
   "name": "OSWorld os - Copy File to Directories",
   "category": "os",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_osworld_04",
   "source": "osworld",
   "name": "OSWorld os - Rename Directory",
   "category": "os",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_osworld_05",
   "source": "osworld",
   "name": "OSWorld os - Count PHP Lines",
   "category": "os",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_osworld_06",
   "source": "osworld",
   "name": "OSWorld vscode - Indent Adjustment",
   "category": "vscode",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_osworld_07",
   "source": "osworld",
   "name": "OSWorld vscode - 0ed39f63",
   "category": "vscode",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_osworld_08",
   "source": "osworld",
   "name": "OSWorld os - Rename Directory",
   "category": "os",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_seal0_00",
   "source": "seal0",
   "name": "SEAL-0 - Sports Question",
   "category": "search_qa",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_seal0_01",
   "source": "seal0",
   "name": "SEAL-0 - Entertainment Question",
   "category": "search_qa",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_seal0_02",
   "source": "seal0",
   "name": "SEAL-0 - Science & Technology Question",
   "category": "search_qa",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_seal0_03",
   "source": "seal0",
   "name": "SEAL-0 - Politics Question",
   "category": "search_qa",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_seal0_04",
   "source": "seal0",
   "name": "SEAL-0 - Science & Technology Question",
   "category": "search_qa",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_seal0_05",
   "source": "seal0",
   "name": "SEAL-0 - Science & Technology Question",
   "category": "search_qa",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_seal0_06",
   "source": "seal0",
   "name": "SEAL-0 - History & Geography Question",
   "category": "search_qa",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_seal0_07",
   "source": "seal0",
   "name": "SEAL-0 - Entertainment Question",
   "category": "search_qa",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_seal0_08",
   "source": "seal0",
   "name": "SEAL-0 - Science & Technology Question",
   "category": "search_qa",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_seal0_09",
   "source": "seal0",
   "name": "SEAL-0 - Science & Technology Question",
   "category": "search_qa",
   "level": "L3",
   "timeoutSeconds": 360,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Judge"
  },
  {
   "id": "task_simpleqa_00",
   "source": "simpleqa",
   "name": "SIMPLEQA Sample 0 (ID: idx_0)",
   "category": "research",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_simpleqa_01",
   "source": "simpleqa",
   "name": "SIMPLEQA Sample 1 (ID: idx_1)",
   "category": "research",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_simpleqa_02",
   "source": "simpleqa",
   "name": "SIMPLEQA Sample 2 (ID: idx_2)",
   "category": "research",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_simpleqa_03",
   "source": "simpleqa",
   "name": "SIMPLEQA Sample 3 (ID: idx_3)",
   "category": "research",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_simpleqa_04",
   "source": "simpleqa",
   "name": "SIMPLEQA Sample 4 (ID: idx_4)",
   "category": "research",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_simpleqa_05",
   "source": "simpleqa",
   "name": "SIMPLEQA Sample 5 (ID: idx_5)",
   "category": "research",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_simpleqa_06",
   "source": "simpleqa",
   "name": "SIMPLEQA Sample 6 (ID: idx_6)",
   "category": "research",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_simpleqa_07",
   "source": "simpleqa",
   "name": "SIMPLEQA Sample 7 (ID: idx_7)",
   "category": "research",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_simpleqa_08",
   "source": "simpleqa",
   "name": "SIMPLEQA Sample 8 (ID: idx_8)",
   "category": "research",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_simpleqa_09",
   "source": "simpleqa",
   "name": "SIMPLEQA Sample 9 (ID: idx_9)",
   "category": "research",
   "level": "L3",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_simplevqa_00",
   "source": "simplevqa",
   "name": "SimpleVQA - CN Visual QA",
   "category": "visual_qa",
   "level": "L2",
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_simplevqa_01",
   "source": "simplevqa",
   "name": "SimpleVQA - CN Visual QA",
   "category": "visual_qa",
   "level": "L2",
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_simplevqa_02",
   "source": "simplevqa",
   "name": "SimpleVQA - CN Visual QA",
   "category": "visual_qa",
   "level": "L2",
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_simplevqa_03",
   "source": "simplevqa",
   "name": "SimpleVQA - CN Visual QA",
   "category": "visual_qa",
   "level": "L2",
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_simplevqa_04",
   "source": "simplevqa",
   "name": "SimpleVQA - CN Visual QA",
   "category": "visual_qa",
   "level": "L2",
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_simplevqa_05",
   "source": "simplevqa",
   "name": "SimpleVQA - CN Visual QA",
   "category": "visual_qa",
   "level": "L2",
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_simplevqa_06",
   "source": "simplevqa",
   "name": "SimpleVQA - CN Visual QA",
   "category": "visual_qa",
   "level": "L2",
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_simplevqa_07",
   "source": "simplevqa",
   "name": "SimpleVQA - CN Visual QA",
   "category": "visual_qa",
   "level": "L2",
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_simplevqa_08",
   "source": "simplevqa",
   "name": "SimpleVQA - CN Visual QA",
   "category": "visual_qa",
   "level": "L2",
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_simplevqa_09",
   "source": "simplevqa",
   "name": "SimpleVQA - CN Visual QA",
   "category": "visual_qa",
   "level": "L2",
   "timeoutSeconds": 300,
   "hasImage": true,
   "group": "mm-ss",
   "scoring": "Judge"
  },
  {
   "id": "task_tablebench_00",
   "source": "tablebench",
   "name": "TableBench DP — FactChecking / MatchBased",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_tablebench_01",
   "source": "tablebench",
   "name": "TableBench DP — FactChecking / Multi-hop FactChecking",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_tablebench_02",
   "source": "tablebench",
   "name": "TableBench DP — NumericalReasoning / Aggregation",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_tablebench_03",
   "source": "tablebench",
   "name": "TableBench DP — NumericalReasoning / ArithmeticCalculation",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_tablebench_04",
   "source": "tablebench",
   "name": "TableBench DP — NumericalReasoning / Comparison",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_tablebench_05",
   "source": "tablebench",
   "name": "TableBench DP — NumericalReasoning / Counting",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_tablebench_06",
   "source": "tablebench",
   "name": "TableBench DP — NumericalReasoning / Domain-Specific",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_tablebench_07",
   "source": "tablebench",
   "name": "TableBench DP — NumericalReasoning / Multi-hop NumericalReasoing",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_tablebench_08",
   "source": "tablebench",
   "name": "TableBench DP — NumericalReasoning / Ranking",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_tablebench_09",
   "source": "tablebench",
   "name": "TableBench DP — NumericalReasoning / Time-basedCalculation",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_tablebench_10",
   "source": "tablebench",
   "name": "TableBench DP — DataAnalysis / AnomalyDetection",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_tablebench_11",
   "source": "tablebench",
   "name": "TableBench DP — DataAnalysis / CausalAnalysis",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_tablebench_12",
   "source": "tablebench",
   "name": "TableBench DP — DataAnalysis / CorrelationAnalysis",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_tablebench_13",
   "source": "tablebench",
   "name": "TableBench DP — DataAnalysis / DescriptiveAnalysis",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Judge"
  },
  {
   "id": "task_tablebench_14",
   "source": "tablebench",
   "name": "TableBench DP — DataAnalysis / ImpactAnalysis",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_tablebench_15",
   "source": "tablebench",
   "name": "TableBench DP — DataAnalysis / StatisticalAnalysis",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_tablebench_16",
   "source": "tablebench",
   "name": "TableBench DP — DataAnalysis / TrendForecasting",
   "category": "tablebench",
   "level": null,
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-ms",
   "scoring": "Auto"
  },
  {
   "id": "task_terminalbench2_00",
   "source": "terminalbench2",
   "name": "TerminalBench2 - chess-best-move",
   "category": "software_engineering",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": true,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_terminalbench2_01",
   "source": "terminalbench2",
   "name": "TerminalBench2 - constraints-scheduling",
   "category": "software_engineering",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_terminalbench2_02",
   "source": "terminalbench2",
   "name": "TerminalBench2 - mteb-retrieve",
   "category": "software_engineering",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_terminalbench2_03",
   "source": "terminalbench2",
   "name": "TerminalBench2 - sqlite-db-truncate",
   "category": "software_engineering",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_terminalbench2_04",
   "source": "terminalbench2",
   "name": "TerminalBench2 - mteb-leaderboard",
   "category": "software_engineering",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_terminalbench2_05",
   "source": "terminalbench2",
   "name": "TerminalBench2 - vulnerable-secret",
   "category": "software_engineering",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_terminalbench2_06",
   "source": "terminalbench2",
   "name": "TerminalBench2 - raman-fitting",
   "category": "software_engineering",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_terminalbench2_07",
   "source": "terminalbench2",
   "name": "TerminalBench2 - log-summary-date-ranges",
   "category": "software_engineering",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_terminalbench2_08",
   "source": "terminalbench2",
   "name": "TerminalBench2 - regex-log",
   "category": "software_engineering",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_terminalbench2_09",
   "source": "terminalbench2",
   "name": "TerminalBench2 - bn-fit-modify",
   "category": "software_engineering",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_widesearch_00",
   "source": "widesearch",
   "name": "WideSearch - ws_en_001",
   "category": "information_seeking",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_widesearch_01",
   "source": "widesearch",
   "name": "WideSearch - ws_en_002",
   "category": "information_seeking",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_widesearch_02",
   "source": "widesearch",
   "name": "WideSearch - ws_en_003",
   "category": "information_seeking",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_widesearch_03",
   "source": "widesearch",
   "name": "WideSearch - ws_en_004",
   "category": "information_seeking",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_widesearch_04",
   "source": "widesearch",
   "name": "WideSearch - ws_en_005",
   "category": "information_seeking",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_widesearch_05",
   "source": "widesearch",
   "name": "WideSearch - ws_en_006",
   "category": "information_seeking",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_widesearch_06",
   "source": "widesearch",
   "name": "WideSearch - ws_en_007",
   "category": "information_seeking",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_widesearch_07",
   "source": "widesearch",
   "name": "WideSearch - ws_en_008",
   "category": "information_seeking",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_widesearch_08",
   "source": "widesearch",
   "name": "WideSearch - ws_en_009",
   "category": "information_seeking",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  },
  {
   "id": "task_widesearch_09",
   "source": "widesearch",
   "name": "WideSearch - ws_en_010",
   "category": "information_seeking",
   "level": "L2",
   "timeoutSeconds": 480,
   "hasImage": false,
   "group": "text-mt",
   "scoring": "Auto"
  }
 ],
 "examples": [
  {
   "group": "text-ss",
   "id": "task_gpqa_01",
   "source": "gpqa",
   "sourceName": "GPQA",
   "title": "GPQA Sample 1 (ID: idx_1)",
   "promptExcerpt": "Identify the possible product when (1S,4R)-2-vinyl-2-azabicyclo[2.2.1]hept-5-ene undergoes Cope rearrangement.",
   "excerptNote": "Excerpt of the task prompt; harness boilerplate (tool note, time budget) trimmed. The excerpt stops before the answer; no reference answer or rubric is included.",
   "hasImage": false,
   "imageFile": null,
   "repoAsset": null,
   "extraImages": 0,
   "artifact": "answer.txt",
   "timeoutSeconds": 480,
   "scoring": "Hybrid",
   "paperRef": null
  },
  {
   "group": "text-ss",
   "id": "task_logiqa_00",
   "source": "logiqa",
   "sourceName": "LogiQA",
   "title": "LOGIQA Sample 0 (ID: idx_0)",
   "promptExcerpt": "Context: Recently, hundreds of seals died from eating a fish contaminated with chemicals.Even small amounts of this chemical can poison mammals.However, some people have not been poisoned after eating this fish.\n\nQuestion: Which of the following, if correct, is most helpful in explaining the contradictions in the above statement?",
   "excerptNote": "Excerpt of the task prompt; harness boilerplate (tool note, time budget) trimmed. The excerpt stops before the answer; no reference answer or rubric is included.",
   "hasImage": false,
   "imageFile": null,
   "repoAsset": null,
   "extraImages": 0,
   "artifact": "answer.txt",
   "timeoutSeconds": 360,
   "scoring": "Auto",
   "paperRef": null,
   "optionsCount": 4
  },
  {
   "group": "text-ms",
   "id": "task_bamboogle_05",
   "source": "bamboogle",
   "sourceName": "Bamboogle",
   "title": "BAMBOOGLE Sample 5 (ID: idx_5)",
   "promptExcerpt": "Who is the predecessor of the longest-reigning British monarch?",
   "excerptNote": "Excerpt of the task prompt; harness boilerplate (tool note, time budget) trimmed. The excerpt stops before the answer; no reference answer or rubric is included.",
   "hasImage": false,
   "imageFile": null,
   "repoAsset": null,
   "extraImages": 0,
   "artifact": "answer.txt",
   "timeoutSeconds": 480,
   "scoring": "Auto",
   "paperRef": null
  },
  {
   "group": "text-ms",
   "id": "task_tablebench_02",
   "source": "tablebench",
   "sourceName": "TableBench",
   "title": "TableBench DP — NumericalReasoning / Aggregation",
   "promptExcerpt": "Read the table below in JSON format:\n{'columns': ['season', 'tropical lows', 'tropical cyclones', 'severe tropical cyclones', 'strongest storm'], 'data': […]}\n\nQuestion: What is the average number of tropical cyclones per season?",
   "excerptNote": "Excerpt of the task prompt; harness boilerplate (tool note, time budget) trimmed. The excerpt stops before the answer; no reference answer or rubric is included.",
   "hasImage": false,
   "imageFile": null,
   "repoAsset": null,
   "extraImages": 0,
   "artifact": "answer.txt",
   "timeoutSeconds": 480,
   "scoring": "Auto",
   "paperRef": null
  },
  {
   "group": "text-mt",
   "id": "task_deepsearchqa_02",
   "source": "deepsearchqa",
   "sourceName": "DeepSearchQA",
   "title": "DEEPSEARCHQA Sample 2 (ID: idx_2)",
   "promptExcerpt": "Of the authors in the first article of the 65th edition of the Journal of Artificial Intelligence Research, who was the most cited on Google scholar in 2019?",
   "excerptNote": "Excerpt of the task prompt; harness boilerplate (tool note, time budget) trimmed. The excerpt stops before the answer; no reference answer or rubric is included.",
   "hasImage": false,
   "imageFile": null,
   "repoAsset": null,
   "extraImages": 0,
   "artifact": "answer.txt",
   "timeoutSeconds": 480,
   "scoring": "Judge",
   "paperRef": "Same task as Appendix D, Case 1"
  },
  {
   "group": "text-mt",
   "id": "task_terminalbench2_03",
   "source": "terminalbench2",
   "sourceName": "TerminalBench2",
   "title": "TerminalBench2 - sqlite-db-truncate",
   "promptExcerpt": "I have a sqlite database in ./trunc.db that was corrupted through binary truncation. Recover as many of the rows as possible, and create a JSON file in ./recover.json.\n\nOutput Format Requirements:\n- Create a file at `./recover.json`\n- The file must contain a valid JSON array\n- Each element is an object with two fields: `word` (string) and `value` (number)\n…",
   "excerptNote": "Excerpt of the task prompt; harness boilerplate (tool note, time budget) trimmed. The excerpt stops before the answer; no reference answer or rubric is included.",
   "hasImage": false,
   "imageFile": null,
   "repoAsset": null,
   "extraImages": 0,
   "artifact": "recover.json",
   "timeoutSeconds": 480,
   "scoring": "Auto",
   "paperRef": null
  },
  {
   "group": "mm-ss",
   "id": "task_hle_02",
   "source": "hle",
   "sourceName": "HLE",
   "title": "HLE Sample 2 (Other)",
   "promptExcerpt": "An image is provided in the file 'image.jpg' in your workspace.\n\nQuestion: Along which plate boundary might we expect the longest range of the tallest mountains on the planet shown above? Assume similar tectonic plate geology to Earth.\n\nAnswer Choices:\nA. Kihei Plate and South Avalonia Plate\nB. South Avalonia Plate and South Kesh Plate\n…",
   "excerptNote": "Excerpt of the task prompt; harness boilerplate (tool note, time budget) trimmed. The excerpt stops before the answer; no reference answer or rubric is included.",
   "hasImage": true,
   "imageFile": "img/examples/task_hle_02.png",
   "repoAsset": "hle/hle_02_image.jpg",
   "extraImages": 0,
   "artifact": "answer.txt",
   "timeoutSeconds": 480,
   "scoring": "Judge",
   "paperRef": "Same task as Appendix D, Case 5",
   "imageNote": "repo file hle/hle_02_image.jpg is actually PNG data; copied byte-for-byte with a .png extension",
   "optionsCount": 9,
   "imageWidth": 1159,
   "imageHeight": 642,
   "imageAlt": "Hypothetical tectonic plate map of a fictional planet with named plates (task input image)."
  },
  {
   "group": "mm-ss",
   "id": "task_simplevqa_08",
   "source": "simplevqa",
   "sourceName": "SimpleVQA",
   "title": "SimpleVQA - CN Visual QA",
   "promptExcerpt": "You are given an image and a question about it. Please analyze the image and provide a concise answer.\n\n### Question\n图中的无人战斗航空载具的首次飞行是在哪一年进行的？",
   "excerptNote": "Excerpt of the task prompt; harness boilerplate (tool note, time budget) trimmed. The excerpt stops before the answer; no reference answer or rubric is included.",
   "hasImage": true,
   "imageFile": "img/examples/task_simplevqa_08.jpg",
   "repoAsset": "simplevqa/8.jpg",
   "extraImages": 0,
   "artifact": "answer.txt",
   "timeoutSeconds": 300,
   "scoring": "Judge",
   "paperRef": null,
   "englishTranslation": "In which year did the unmanned combat aerial vehicle in the image make its first flight?",
   "translationNote": "English translation of the Chinese prompt, made for this page (not from the paper)",
   "imageWidth": 560,
   "imageHeight": 372,
   "imageAlt": "Photograph of a dark-grey unmanned combat aircraft with orange-tipped tail fins in flight above a desert landscape (task input image)."
  },
  {
   "group": "mm-ms",
   "id": "task_charxiv_01",
   "source": "charxiv",
   "sourceName": "CharXiv",
   "title": "CharXiv - Cs Chart (20)",
   "promptExcerpt": "You are given an academic chart/image from an arXiv paper. Please analyze the chart and answer the question.\n\n### Question\nWhat is the name of the line that is the furthest away from its fi value from the W_H axis?",
   "excerptNote": "Excerpt of the task prompt; harness boilerplate (tool note, time budget) trimmed. The excerpt stops before the answer; no reference answer or rubric is included.",
   "hasImage": true,
   "imageFile": "img/examples/task_charxiv_01.jpg",
   "repoAsset": "charxiv/1.jpg",
   "extraImages": 0,
   "artifact": "answer.txt",
   "timeoutSeconds": 300,
   "scoring": "Judge",
   "paperRef": "Same task as Appendix D, Case 2",
   "imageWidth": 1024,
   "imageHeight": 760,
   "imageAlt": "Scatter/line chart from an arXiv paper plotting W_L against W_H for three lambda_L settings, with markers ap, sm, fi and ni (task input image)."
  },
  {
   "group": "mm-ms",
   "id": "task_medxpertqa_02",
   "source": "medxpertqa",
   "sourceName": "MedXpertQA",
   "title": "MedXpertQA MM Sample 2 (ID: MM-259)",
   "promptExcerpt": "An investigator is examining the impact of various drugs on cardiomyocyte contraction. Maximal contractility is achieved with the use of drug A. The response observed after administering drug B is illustrated in the accompanying graph. Which of the following drugs is most likely to produce a response similar to that of drug B?\nAnswer Choices: (A) Albuterol (B) Phenoxybenzamine (C) Propranolol …",
   "excerptNote": "Excerpt of the task prompt; harness boilerplate (tool note, time budget) trimmed. The excerpt stops before the answer; no reference answer or rubric is included.",
   "hasImage": true,
   "imageFile": "img/examples/task_medxpertqa_02.jpg",
   "repoAsset": "medxpertqa/MM-259-a.jpeg",
   "extraImages": 0,
   "artifact": "answer.txt",
   "timeoutSeconds": 180,
   "scoring": "Auto",
   "paperRef": null,
   "optionsCount": 5,
   "imageWidth": 1503,
   "imageHeight": 1000,
   "imageAlt": "Dose-response chart: maximal effect (%) versus log drug concentration for drugs A and B (task input image)."
  },
  {
   "group": "mm-mt",
   "id": "task_agentvista_09",
   "source": "agentvista",
   "sourceName": "AgentVista",
   "title": "AgentVista - academics / Scientific Identification and Knowledge",
   "promptExcerpt": "Among all the open-source models with parameters exceeding 100 billion displayed in this tree, which one has the smallest absolute number of days between its release date and that of GPT-3? Please provide the name of this model.",
   "excerptNote": "Excerpt of the task prompt; harness boilerplate (tool note, time budget) trimmed. The excerpt stops before the answer; no reference answer or rubric is included.",
   "hasImage": true,
   "imageFile": "img/examples/task_agentvista_09.png",
   "repoAsset": "agentvista/26_0.png",
   "extraImages": 0,
   "artifact": "answer.txt",
   "timeoutSeconds": 480,
   "scoring": "Hybrid",
   "paperRef": null,
   "imageWidth": 1022,
   "imageHeight": 790,
   "imageAlt": "Illustrated “Evolutionary Tree” of language models from 2018 to 2023, with encoder-only, encoder-decoder and decoder-only branches and open-source vs. closed-source models marked (task input image)."
  },
  {
   "group": "mm-mt",
   "id": "task_mmsearchplus_00",
   "source": "mmsearchplus",
   "sourceName": "MMSearchPlus",
   "title": "MMSearch-Plus - Academic Research (00)",
   "promptExcerpt": "What is the title of this paper?",
   "excerptNote": "Excerpt of the task prompt; harness boilerplate (tool note, time budget) trimmed. The excerpt stops before the answer; no reference answer or rubric is included.",
   "hasImage": true,
   "imageFile": "img/examples/task_mmsearchplus_00.png",
   "repoAsset": "mmsearch-plus/00_image.png",
   "extraImages": 0,
   "artifact": "answer.txt",
   "timeoutSeconds": 480,
   "scoring": "Hybrid",
   "paperRef": null,
   "imageWidth": 2176,
   "imageHeight": 850,
   "imageAlt": "Three heatmaps of noisy vs. clean label transition matrices from a research paper (task input image)."
  }
 ],
 "discrepancies": [
  "[paper-internal] Qwen3-VL-8B-Instruct: Fig.4 labels Overall 40.2 but prose (§B.1) states 40.3; Table 1 + Eq.11 gives 40.233. Page shows the prose value 40.3.",
  "[paper-internal] Qwen2.5-VL-32B-Instruct: Fig.4 labels Overall 38.9 but prose (§B.1) states 39.0; Table 1 + Eq.11 gives 38.939. Page shows the prose value 39.0.",
  "[paper-internal] Fig.1 (a) text panel plots 21 of 23 API models; not plotted: ['MiMo-V2-Omni', 'MiMo-V2-Pro']. Fig.1 (b) MM panel plots 15 of 16 MM-capable API models; not plotted: ['MiMo-V2-Omni'].",
  "[pareto] Frontier computed from Table 1/2 over all 16 MM-capable API models = ['MiMo-V2-Omni', 'MiMo-V2.5', 'GPT-5.4', 'Gemini-3.1-Pro', 'Claude-Opus-4.8']; Fig.1 caption = ['MiMo-V2.5', 'GPT-5.4', 'Gemini-3.1-Pro', 'Claude-Opus-4.8']. Over the 15 models actually plotted in Fig.1(b) the computed frontier is ['MiMo-V2.5', 'GPT-5.4', 'Gemini-3.1-Pro', 'Claude-Opus-4.8'].",
  "[pareto] §4.2 prose lists the MM frontier as ['MiMo-V2-Omni', 'MiMo-V2.5', 'GPT-5.4', 'Gemini-3.1-Pro', 'Claude-Opus-4.8'] (includes MiMo-V2-Omni at $0.003, 46.0), but the Fig.1 caption lists ['MiMo-V2.5', 'GPT-5.4', 'Gemini-3.1-Pro', 'Claude-Opus-4.8'] and MiMo-V2-Omni is not plotted in Fig.1(b). Page uses the caption (USER DIRECTIVE).",
  "[paper-internal] §B.1 says the Multi-Step+Tools improvement is 'consistently the smallest'; for the quoted pair Qwen3.5-27B -> Qwen3.6-27B the per-group gains are {'text-ss': -0.9, 'text-ms': 12.2, 'text-mt': 10.2, 'mm-ss': 20.0, 'mm-ms': 2.0, 'mm-mt': 14.0} (MT is not the smallest within Text or MM). Avoid displaying this sub-claim.",
  "[paper-internal] Table 5 caption says models are ordered by overall accuracy (descending), but the api order ['Gemini-3.1-Pro', 'Claude-Opus-4.8', 'GPT-5.5', 'Claude-Opus-4.6', 'GPT-5.4', 'MiMo-V2.5', 'Claude-Sonnet-4.6', 'Qwen3.6-Plus', 'Qwen3.5-Plus', 'Doubao-Seed2.0-Pro', 'Gemini-3.5-Flash', 'GPT-5.4-mini', 'MiMo-V2.5-Pro', 'DeepSeek-V4-Pro', 'Claude-Haiku-4.5', 'Doubao-Seed2.0-Mini', 'MiMo-V2-Omni', 'Kimi-K2.5', 'MiMo-V2-Pro', 'MiniMax-M2.7', 'GLM-5', 'DeepSeek-V3.2', 'GLM-4.7'] differs from Overall order ['MiMo-V2.5-Pro=76.0', 'Claude-Opus-4.8=74.7', 'GPT-5.5=74.0', 'DeepSeek-V4-Pro=73.2', 'Claude-Opus-4.6=72.9', 'Gemini-3.1-Pro=72.3', 'GPT-5.4=72.1', 'MiMo-V2-Pro=71.6', 'MiMo-V2.5=71.4', 'MiniMax-M2.7=69.8', 'GLM-5=68.9', 'Claude-Sonnet-4.6=68.1', 'Qwen3.6-Plus=67.9', 'Qwen3.5-Plus=67.2', 'Doubao-Seed2.0-Pro=67.1', 'Gemini-3.5-Flash=66.3', 'DeepSeek-V3.2=63.9', 'GPT-5.4-mini=63.1', 'GLM-4.7=61.3', 'Claude-Haiku-4.5=61.0', 'MiMo-V2-Omni=60.4', 'Kimi-K2.5=60.4', 'Doubao-Seed2.0-Mini=60.2']. Page keeps Table 5's row order for the taxonomy view.",
  "[paper-internal] Table 5 caption says models are ordered by overall accuracy (descending), but the local order ['Qwen3.6-27B', 'Qwen3.6-35B-A3B', 'Qwen3.5-27B', 'Qwen3.5-35B-A3B', 'Qwen3-Coder-30B-A3B', 'Qwen3-VL-32B', 'Qwen3-VL-8B', 'Gemma-4-26B-A4B', 'Qwen2.5-VL-32B', 'Qwen3.5-9B', 'Gemma-3-27B', 'Qwen2.5-VL-7B'] differs from Overall order ['Qwen3.6-27B=59.8', 'Qwen3.6-35B-A3B=56.6', 'Qwen3-Coder-30B-A3B=52.1', 'Qwen3.5-27B=49.5', 'Qwen3.5-35B-A3B=47.2', 'Qwen3-VL-8B=40.3', 'Qwen2.5-VL-32B=39.0', 'Qwen3-VL-32B=38.7', 'Gemma-4-26B-A4B=36.5', 'Qwen3.5-9B=33.8', 'Qwen2.5-VL-7B=22.3', 'Gemma-3-27B=21.7']. Page keeps Table 5's row order for the taxonomy view.",
  "[paper-internal] Table 6 has a 'Ctx' column (e.g. 256K, 128K, 160K) that is not defined in the paper, while §4.1/§4.3 state local models were served with a common 32K context. If shown, label it exactly 'Ctx (Table 6)' without interpretation.",
  "[paper-vs-code (info)] HLE is mapped to MM-SS by the paper (dominant modality), but only 2/10 repo tasks ship an image in workspace_files.",
  "[paper-vs-code (info)] OSWorld is mapped to Text-MT by the paper, but 1/9 repo tasks ship an image file in workspace_files.",
  "[paper-vs-code (info)] TerminalBench2 is mapped to Text-MT by the paper, but 1/10 repo tasks ship an image file in workspace_files.",
  "[code (info)] Repo has 2 OSWorld task files with the same name/prompt 'OSWorld os - Rename Directory': ['task_osworld_04', 'task_osworld_08'] (files differ only by id and a comment line). Paper counts OSWorld as 9 tasks, repo also has 9 files.",
  "[paper-vs-code] Repo default judge in scripts/lib_grading.py is 'modelstudio/qwen3.5-plus' (README tells users to set their own), while the paper's primary judge is Qwen3.5-VL-Plus and meta-judge Claude-Opus-4.6. Page shows the paper's judges.",
  "[paper-vs-code] README installs 11 Clawhub skills; the paper (§4.1, §A.2) integrates 9. README-only: ['gog', 'multi-search-engine']; paper-only: []. Name mapping assumed: agent-browser-clawdbot = 'Agent Browser', desktop-control = 'desktop-control-1.0.0'. Quick Start shows README commands; any 'skills used in the paper' list must show the paper's 9.",
  "[paper (info)] Abstract links https://github.com/SeerRay-Lab/DAREBench (upper-case repo name); the page uses https://github.com/SeerRay-Lab/DareBench (GitHub paths are case-insensitive for repos).",
  "[paper-internal] Appendix D Case 2 box title says '(Multi-Modal Single Step)' but its source CharXiv is mapped to MM-MS in Table 9. Page should use the Table 9 group.",
  "[paper (info)] Citation key for MiMo-V2.5 renders as 'Xiaomi MiMo Team 2026d' in the arXiv HTML but 'Xiaomi MiMo Team 2026c' in the PDF (bibliography letters/et al. differ between renderings; title/URL identical). Prefer showing title/URL rather than the key.",
  "[paper (info)] Citation key for MiMo-V2.5-Pro renders as 'Xiaomi MiMo Team 2026c' in the arXiv HTML but 'Xiaomi MiMo Team 2026d' in the PDF (bibliography letters/et al. differ between renderings; title/URL identical). Prefer showing title/URL rather than the key.",
  "[paper (info)] Citation key for GLM-5 renders as 'GLM-5-Team and others 2026' in the arXiv HTML but 'GLM-5-Team et al. 2026' in the PDF (bibliography letters/et al. differ between renderings; title/URL identical). Prefer showing title/URL rather than the key.",
  "[paper (info)] Citation key for source HLE renders as 'Center for AI Safety et al. 2026' in HTML but 'Center for AI Safety, Scale AI, and HLE Contributors Consortium 2026' in the PDF.",
  "[paper-internal (info)] Table 5 assigns image-related failure codes (FCR/VEB/VCS) to text-only models that the paper says were not evaluated on multimodal tasks: MiMo-V2.5-Pro 1/1/1, DeepSeek-V4-Pro 2/1/0, MiMo-V2-Pro 1/2/0, MiniMax-M2.7 2/1/1, GLM-5 2/1/1, DeepSeek-V3.2 2/0/1, GLM-4.7 1/1/0 (totals FCR 11, VEB 7, VCS 4). This could come from text-group tasks that ship images (e.g. OSWorld/TerminalBench2 in the repo), but the paper does not say. Table 5 values are shown as published; do not add commentary on the page.",
  "[derivation] GPT-5.5 Overall is not stated in the paper and sits at a rounding boundary: (162 × 76.8 + 71 × 67.7) / 233 = 74.027 -> 74.0, while weighting the six rounded Table 1 group accuracies gives 74.052 -> 74.1. The page shows 74.0 (Avg-weighted form, which reproduces all 9 prose-stated Overalls; the group-weighted form misses 56.6, 40.3 and 39.0). Rank is unchanged (#2 in the Full track)."
 ],
 "provenance": {
  "paper": "arXiv 2609.06059v1 HTML (paper.html); tables parsed with BeautifulSoup; prose numbers extracted by regex from the same HTML; author superscripts verified against paper.pdf.",
  "repo": "SeerRay-Lab/DareBench @ cb2117f (read-only)",
  "units": {
   "acc": "% (display with 1 decimal: 85 -> 85.0)",
   "tokens": "thousands of tokens per task (52 = 52k)",
   "cost": "USD per task (display costText strings, e.g. 0.250, <0.001)",
   "price": "USD per 1M tokens (display priceText strings)"
  },
  "overallRule": "Overall = the value the paper states in its prose where it states one; otherwise (162 × Table 1 Text Avg + 71 × Table 1 MM Avg) / 233, i.e. the task-count-weighted mean over the 233 applicable tasks (Eq. 11). This form reproduces all 9 prose-stated Overalls; weighting the six rounded group accuracies instead misses 3 of them (56.6, 40.3, 39.0). Text-only models: Overall = Text Avg (162 applicable tasks).",
  "checksPassed": [
   "Table 8 rows sum to Total (auto/judge/hybrid = 125/73/35)",
   "Table 1 caption weights 20/87/55; 20/26/25 == Table 8 group counts",
   "Table 9 per-source counts/scoring modes reproduce Table 8 exactly for all 6 groups",
   "23 API models map to 10 vendor families: ['Alibaba Qwen', 'Anthropic', 'ByteDance', 'DeepSeek', 'Google', 'MiniMax', 'Moonshot AI', 'OpenAI', 'Xiaomi', 'Z.ai']",
   "Table 1 typographic place marks (bold/underline/italic) agree with competition ranking within each deployment mode for every column (Avg columns: 2nd/3rd only, since they are bold throughout)",
   "Table 2 covers all 23 API models; Table 6 covers all 12 local models (HTML tables complete, no PDF recovery needed)",
   "Table 7 prices present for all 35 models",
   "Table 3 rows and Total are internally consistent (124 local + 19 API = 143)",
   "MiMo-V2.5 overall tokens 276k and cost $0.005 (§4.2) reproduced from Table 2 group values",
   "Claude-Opus-4.6 overall tokens 231k and cost $0.381 (§4.2) reproduced from Table 2 group values",
   "§4.2 winner Text-SS = Claude-Opus-4.8 (98.8) is the unique maximum over all 35 models",
   "§4.2 winner Text-MT = Claude-Opus-4.8 (65.3) is the unique maximum over all 35 models",
   "§4.2 winner MM-MT = Claude-Opus-4.8 (61.8) is the unique maximum over all 35 models",
   "§4.2 winner Text-MS = GPT-5.5 (83.6) is the unique maximum over all 35 models",
   "§4.2 winner MM-SS = GPT-5.5 (90.0) is the unique maximum over all 35 models",
   "§4.2 winner MM-MS = Gemini-3.1-Pro (88.5) is the unique maximum over all 35 models",
   "§4.2 cost extremes (MiMo-V2.5 $0.006 text, MiMo-V2-Omni $0.003 MM, Claude-Sonnet-4.6 $0.436, Claude-Opus-4.6 $0.293) match Table 2",
   "Gemini-3.5-Flash token maxima 456k/490k match Table 2; ratios vs GPT-5.4-mini = 6.0x / 8.3x (paper: roughly six and eight)",
   "Fig.1 text token labels match Table 2 for all 21 plotted models",
   "Fig.1 mm token labels match Table 2 for all 15 plotted models",
   "Text frontier computed from Table 1/2 (all API models) == Fig.1 caption ['MiMo-V2.5', 'MiMo-V2.5-Pro', 'GPT-5.5']",
   "MM frontier over the 15 models plotted in Fig.1(b) == caption",
   "§4.2 prose text frontier points (cost, acc) == caption and Table 1/2 values",
   "Text frontier steps: cost x2.00 (+0.5 pt), then x12.9 (+0.8 pt); paper: ~2x (+0.5), ~13x (+0.8)",
   "§B.1 Qwen3.5-27B -> Qwen3.6-27B gains +9.9 text / +11.2 MM match Table 1 averages",
   "§B.2 numbers (PPPA 88/308=28.6%, local 62 vs API 26, 38.5% vs 17.7%, VEB 18 vs 17) reproduced from Table 5",
   "§B.3 Qwen3.6-27B 62k/81k tokens match Table 6",
   "7,587 runs = 27x233 + 8x162 and 3,340 judge/hybrid calls = 27x108 + 8x53 (from Table 8 judge+hybrid counts)",
   "Scoring-mode shares 53.6/31.3/15.0% reproduce 125/73/35 of 233",
   "Runtime strings (OpenClaw 2026.3.20, vLLM 0.19.0, CUDA 13.1, Ubuntu 24.04.4 LTS, seed 42, RTX PRO 6000 96 GB, FP16 32K) found verbatim in the paper",
   "Repo task files per source == paper Table 9 #Tasks for all 22 sources; repo grading_type counts == Table 9 scoring (TableBench split exactly 14 auto / 3 judge)",
   "Examples: no ground-truth string of any task appears in any excerpt; per-example answer check passed for 12 examples",
   "Author superscripts/marks match the PDF title block (and HTML author order/\\corresponding marks)",
   "Qwen3.6-27B Overall 59.8 (§4.2, §B.1) matches (162·TextAvg + 71·MMAvg)/233 = 59.758",
   "Qwen3.6-35B-A3B Overall 56.6 (§4.2, §B.1) matches (162·TextAvg + 71·MMAvg)/233 = 56.562",
   "Qwen3.5-27B Overall 49.5 (§B.1) matches (162·TextAvg + 71·MMAvg)/233 = 49.462",
   "Qwen3.5-35B-A3B Overall 47.2 (§B.1) matches (162·TextAvg + 71·MMAvg)/233 = 47.204",
   "Qwen3-VL-8B-Instruct Overall 40.3 (§B.1) matches (162·TextAvg + 71·MMAvg)/233 = 40.259",
   "Qwen2.5-VL-32B-Instruct Overall 39.0 (§B.1) matches (162·TextAvg + 71·MMAvg)/233 = 38.952",
   "Gemma-4-26B-A4B-it Overall 36.5 (§B.1) matches (162·TextAvg + 71·MMAvg)/233 = 36.467",
   "Qwen3.5-9B Overall 33.8 (§B.1) matches (162·TextAvg + 71·MMAvg)/233 = 33.830",
   "Gemma-3-27B-it Overall 21.7 (§B.1) matches (162·TextAvg + 71·MMAvg)/233 = 21.734",
   "Examples: none of the 12 example tasks is a task whose model run or reference answer appears in a paper figure shown on the page (Fig. 3 = task_agentvista_00, Fig. 5 = task_simplevqa_07, Fig. 6 = task_tablebench_10)"
  ],
  "roundingNotes": [
   "Claude-Opus-4.8 MM Avg 71.1 (from group accs 71.045)",
   "Claude-Opus-4.6 MM Avg 65.9 (from group accs 65.968)",
   "GPT-5.4 Text Avg 75.8 (from group accs 75.857)",
   "Claude-Sonnet-4.6 MM Avg 57.9 (from group accs 57.846)",
   "Doubao-Seed2.0-Pro MM Avg 58.7 (from group accs 58.648)",
   "GLM-4.7 Text Avg 61.3 (from group accs 61.354)",
   "Qwen3.5-27B MM Avg 43.9 (from group accs 43.821)",
   "Qwen3.5-35B-A3B MM Avg 39.0 (from group accs 39.063)",
   "Qwen3-VL-32B-Instruct Text Avg 40.6 (from group accs 40.672)",
   "Gemma-4-26B-A4B-it MM Avg 31.6 (from group accs 31.666)",
   "Qwen3-Coder-30B-A3B-Instruct Text Avg 52.1 (from group accs 52.158)",
   "GLM-4.7 Overall 61.3 (Table 1 Text Avg) vs 61.354 from rounded group accs",
   "Qwen3-Coder-30B-A3B-Instruct Overall 52.1 (Table 1 Text Avg) vs 52.158 from rounded group accs",
   "§4.2 'roughly 71x': $0.381/$0.005 = 76.2x from rounded values; admissible range 69-85x given $0.005 rounding; 72.5x using group-level costs (MiMo 0.00526). Consistent; quote the paper's wording.",
   "Overall derivation: group-weighted and Avg-weighted forms differ by <0.1 pt for every model; only GPT-5.5 rounds differently (74.052 -> 74.1 vs 74.027 -> 74.0). The page uses the Avg-weighted form, which reproduces every prose-stated Overall."
  ],
  "builtBy": "homepage/tools/data_build/build_data.py",
  "vendorNote": "Vendor labels follow the paper's own naming (citations / Table 7 providers): GLM models -> 'Z.ai' (Zhipu), Doubao -> 'ByteDance', Kimi -> 'Moonshot AI', Gemma and Gemini -> 'Google'. 10 API families as stated in §4.1.",
  "pdfCrossCheck": "Tables 1, 2, 3, 5, 6, 7, 8, 9 re-read from pdftotext -layout output and matched cell-by-cell (HTML == PDF).",
  "figureExtraction": "Fig. 4 (series_evolution.png) and Fig. 6 (casestudy_rubric_leakage.png) rasterised from paper.pdf at 300 dpi because the HTML uses SVGs not present locally."
 }
};
