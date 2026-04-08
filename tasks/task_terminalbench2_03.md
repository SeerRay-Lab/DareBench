---
id: task_terminalbench2_03
name: "TerminalBench2 - sqlite-db-truncate"
category: software_engineering
level: L2
grading_type: automated
timeout_seconds: 480
environment:
  type: sandbox
  requirements: []
workspace_files:
  - source: terminal_bench/trunc.db
    dest: trunc.db
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

I have a sqlite database in ./trunc.db that was corrupted through binary truncation. Recover as many of the rows as possible, and create a JSON file in ./recover.json.

**Output Format Requirements:**
- Create a file at `./recover.json`
- The file must contain a valid JSON array
- Each element is an object with two fields: `word` (string) and `value` (number)
- Example format (these are NOT actual recovered data, just format examples):
  ```json
  [
    {"word": "example_word_aa", "value": 10.5},
    {"word": "example_word_bb", "value": 25.0}
  ]
  ```
- No extra text outside the JSON array
- Numeric values should be numbers, not strings

**IMPORTANT**: Complete the task and create the required output files in the workspace.

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

1. Analyze the corrupted SQLite database
2. Recover as many rows as possible
3. Create recover.json with the recovered data in the specified format

## Grading Criteria

- [ ] output_created: Required output file(s) exist
- [ ] task_completed: Output meets the task requirements

## Automated Checks

```python
def grade(transcript, workspace_path):
    """
    Official evaluation logic from terminal-bench-2/sqlite-db-truncate/tests/test_outputs.py
    
    Validates that recover.json contains at least 7 correctly recovered rows.
    Each item is matched at most once (set intersection logic).
    """
    import json
    from pathlib import Path
    
    scores = {}
    workspace = Path(workspace_path)
    
    # Ground truth solution
    soln = [
        {"word": "testword02", "value": 10.0},
        {"word": "testword03", "value": 25.0},
        {"word": "testword04", "value": 42.0},
        {"word": "testword05", "value": 50.0},
        {"word": "testword06", "value": 75.0},
        {"word": "testword07", "value": 99.0},
        {"word": "testword08", "value": 99.99},
        {"word": "testword09", "value": 0.5},
    ]
    
    recover_file = workspace / "recover.json"
    
    # Test 1: Check file exists
    if not recover_file.exists():
        scores["recover_json_exists"] = 0.0
        scores["task_completed"] = 0.0
        return scores
    
    scores["recover_json_exists"] = 1.0
    
    # Test 2: Validate JSON content
    try:
        data = json.loads(recover_file.read_text())
        
        # Convert to tuples for set comparison
        soln_tuples = {(item["word"], item["value"]) for item in soln}
        data_tuples = {(item["word"], item["value"]) for item in data}
        
        # Find intersection - each item matched at most once
        matches = soln_tuples & data_tuples
        match_count = len(matches)
        
        # 0..1 only (lib_grading averages all numeric values in scores)
        scores["recovery_rate"] = match_count / len(soln)
        
        if match_count > 6:
            scores["task_completed"] = 1.0
        else:
            scores["task_completed"] = match_count / 7.0  # Partial credit
            
    except json.JSONDecodeError as e:
        scores["task_completed"] = 0.0
        scores["error"] = f"Invalid JSON: {str(e)}"
    except Exception as e:
        scores["task_completed"] = 0.0
        scores["error"] = str(e)
    
    return scores
```

## Gold Answer Reference

Ground truth available in dataset: `terminal-bench-2/sqlite-db-truncate/`
- Input file: trunc.db (corrupted SQLite database)
- Expected output: recover.json with at least 7 of 8 ground truth rows recovered
- Ground truth rows: testword02-09 with specific values
