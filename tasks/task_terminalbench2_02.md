---
id: task_terminalbench2_02
name: "TerminalBench2 - mteb-retrieve"
category: software_engineering
level: L2
grading_type: automated
timeout_seconds: 480
environment:
  type: sandbox
  requirements: []
workspace_files:
  - source: terminal_bench/mteb_data.txt
    dest: data.txt
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Given the query "terminal-bench" retrieve the document with the 5th highest cosine similarity among the texts at ./data.txt, where each line is a separate document, using the bge-small-zh-v1.5 embedding model at revision 7999e1d3359715c523056ef9478215996d62a620.

**Output Format Requirements:**
- Create a file at `./result.txt`
- The file must contain exactly ONE line
- Write the retrieved document text exactly as it appears in data.txt
- **CRITICAL**: The output is compared character-by-character; any extra space or difference will fail
- No extra whitespace, no quotes, no markdown formatting
- Example output format (this is NOT the actual answer, just format example):
  ```
  This is an example document text from the dataset
  ```

**IMPORTANT**: Complete the task and create the required output files in the workspace.

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

1. Load the bge-small-zh-v1.5 embedding model
2. Encode the query "terminal-bench"
3. Encode all documents from data.txt
4. Calculate cosine similarities
5. Find the 5th highest similarity document
6. Write it to result.txt

## Grading Criteria

- [ ] output_created: Required output file(s) exist
- [ ] task_completed: Output meets the task requirements

## Automated Checks

```python
def grade(transcript, workspace_path):
    """
    Official evaluation logic from terminal-bench-2/mteb-retrieve/tests/test_outputs.py
    """
    from pathlib import Path
    
    scores = {}
    workspace = Path(workspace_path)
    
    result_file = workspace / "result.txt"
    expected = "MTEB: Massive Text Embedding Benchmark"
    
    # Test 1: Check file exists
    if not result_file.exists():
        scores["result_file_exists"] = 0.0
        scores["task_completed"] = 0.0
        return scores
    
    scores["result_file_exists"] = 1.0
    
    # Test 2: Check content matches exactly
    try:
        with open(result_file, "r") as f:
            lines = f.readlines()
        
        # Should contain exactly one line
        if len(lines) != 1:
            scores["task_completed"] = 0.0
            scores["error"] = f"Expected 1 line, got {len(lines)}"
            return scores
        
        content = lines[0].strip()
        if content == expected:
            scores["task_completed"] = 1.0
        else:
            scores["task_completed"] = 0.0
            scores["error"] = f"Expected '{expected}', got '{content}'"
            
    except Exception as e:
        scores["task_completed"] = 0.0
        scores["error"] = str(e)
    
    return scores
```

## Gold Answer Reference

Ground truth available in dataset: `terminal-bench-2/mteb-retrieve/`
- Input file: data.txt (20 lines of benchmark descriptions)
- Expected output: result.txt containing "MTEB: Massive Text Embedding Benchmark"
