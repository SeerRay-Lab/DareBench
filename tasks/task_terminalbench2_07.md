---
id: task_terminalbench2_07
name: "TerminalBench2 - log-summary-date-ranges"
category: software_engineering
level: L2
grading_type: automated
timeout_seconds: 480
environment:
  type: sandbox
  requirements: []
workspace_files:
  - source: terminal_bench/log_generator_deterministic.py
    dest: log_generator_deterministic.py
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Generate a summary of log entries grouped by date ranges and severity.

You are provided with a log generator script (./log_generator_deterministic.py). Run this script to generate a log file, then analyze it to create a summary.

Your task is to:
1. Run log_generator_deterministic.py to generate logs
2. Parse the generated log file
3. Count log entries by severity (ERROR, WARNING, INFO) for each date range:
   - today
   - last_7_days
   - last_30_days
   - month_to_date
   - total

**Output Format Requirements:**
- Create a file at `./summary.csv`
- The file must be a valid CSV with header: `period,severity,count`
- Each row represents one period-severity combination
- Exactly 15 data rows (5 periods × 3 severities)
- No extra spaces after commas
- No quotes around values
- Example format (values are NOT actual answers, just format examples):
  ```csv
  period,severity,count
  today,ERROR,100
  today,WARNING,200
  today,INFO,500
  last_7_days,ERROR,1000
  ...
  ```

**IMPORTANT**: Complete the task and create the required output files in the workspace.

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

1. Execute log_generator_deterministic.py
2. Parse generated log entries
3. Count entries by date range and severity
4. Create summary.csv with 15 rows (5 periods × 3 severities)

## Grading Criteria

- [ ] output_created: Required output file(s) exist
- [ ] task_completed: Output meets the task requirements

## Automated Checks

```python
def grade(transcript, workspace_path):
    """
    Official evaluation logic from terminal-bench-2/log-summary-date-ranges/tests/test_outputs.py
    """
    import csv
    from pathlib import Path
    
    scores = {}
    workspace = Path(workspace_path)
    
    summary_file = workspace / "summary.csv"
    
    # Expected rows
    EXPECTED_ROWS = [
        ["today", "ERROR", "370"],
        ["today", "WARNING", "463"],
        ["today", "INFO", "1433"],
        ["last_7_days", "ERROR", "2969"],
        ["last_7_days", "WARNING", "4020"],
        ["last_7_days", "INFO", "12203"],
        ["last_30_days", "ERROR", "9594"],
        ["last_30_days", "WARNING", "12847"],
        ["last_30_days", "INFO", "38702"],
        ["month_to_date", "ERROR", "4682"],
        ["month_to_date", "WARNING", "6327"],
        ["month_to_date", "INFO", "19420"],
        ["total", "ERROR", "14160"],
        ["total", "WARNING", "18772"],
        ["total", "INFO", "56621"],
    ]
    
    # Test 1: Check file exists
    if not summary_file.exists():
        scores["summary_file_exists"] = 0.0
        scores["task_completed"] = 0.0
        return scores
    
    scores["summary_file_exists"] = 1.0
    
    # Test 2: Validate CSV structure and counts
    try:
        with open(summary_file, "r", newline="") as f:
            reader = list(csv.reader(f))
        
        if not reader:
            scores["task_completed"] = 0.0
            scores["error"] = "CSV file is empty"
            return scores
        
        # Header check
        header = reader[0]
        if header != ["period", "severity", "count"]:
            scores["task_completed"] = 0.0
            scores["error"] = f"Unexpected header: {header}"
            return scores
        
        # Data rows check
        data_rows = reader[1:]
        
        # Match each expected row
        matches = 0
        for expected_row in EXPECTED_ROWS:
            if expected_row in data_rows:
                matches += 1
        
        if matches == len(EXPECTED_ROWS):
            scores["task_completed"] = 1.0
        else:
            scores["task_completed"] = matches / len(EXPECTED_ROWS)
            scores["error"] = f"Matched {matches}/{len(EXPECTED_ROWS)} rows"
            
    except Exception as e:
        scores["task_completed"] = 0.0
        scores["error"] = str(e)
    
    return scores
```

## Gold Answer Reference

Ground truth available in dataset: `terminal-bench-2/log-summary-date-ranges/`
- Input file: log_generator_deterministic.py
- Expected output: summary.csv with 15 specific rows
- Expected counts are deterministic based on the generator script
