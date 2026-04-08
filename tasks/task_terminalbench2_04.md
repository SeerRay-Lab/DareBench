---
id: task_terminalbench2_04
name: "TerminalBench2 - mteb-leaderboard"
category: software_engineering
level: L2
grading_type: automated
timeout_seconds: 480
environment:
  type: sandbox
  requirements: []
workspace_files: []
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

I have a lot of Scandinavian texts that I need to encode. Please provide me with the name of the best embedding model to use according to the Scandinavian MTEB leaderboard (i.e. highest Mean (Task)) as of August 2025.

**Output Format Requirements:**
- Create a file at `./result.txt`
- The file must contain exactly ONE line
- Format: `organization/model_name` (e.g., `BAAI/bge-small-en-v1.5`, `GritLM/GritLM-7B`)
- No extra text, no quotes, no markdown, no explanation
- Example output format (this is NOT the actual answer, just format example):
  ```
  BAAI/bge-small-en-v1.5
  ```

**IMPORTANT**: Complete the task and create the required output files in the workspace.

**Note**: You may use available tools or skills in the system to complete this task. You may access the internet to query the MTEB leaderboard.

and you need to complete the task in 480s.

## Expected Behavior

1. Query the Scandinavian MTEB leaderboard
2. Find the model with highest Mean (Task) as of August 2025
3. Write the model name in organization/model_name format to result.txt

## Grading Criteria

- [ ] output_created: Required output file(s) exist
- [ ] task_completed: Output meets the task requirements

## Automated Checks

```python
def grade(transcript, workspace_path):
    """
    Official evaluation logic from terminal-bench-2/mteb-leaderboard/tests/test_outputs.py
    """
    import os
    from pathlib import Path
    
    scores = {}
    workspace = Path(workspace_path)
    
    result_file = workspace / "result.txt"
    expected = "GritLM/GritLM-7B"
    
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

Ground truth available in dataset: `terminal-bench-2/mteb-leaderboard/`
- Expected output: result.txt containing "GritLM/GritLM-7B"
- Source: Scandinavian MTEB leaderboard as of August 2025
