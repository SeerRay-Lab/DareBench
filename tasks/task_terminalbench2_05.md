---
id: task_terminalbench2_05
name: "TerminalBench2 - vulnerable-secret"
category: software_engineering
level: L2
grading_type: automated
timeout_seconds: 480
environment:
  type: sandbox
  requirements: []
workspace_files:
  - source: terminal_bench/vulnerable.c
    dest: vulnerable.c
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Analyze the following program that contains a secret key. The goal is to extract this secret key.

The program is available as C source code (./vulnerable.c). You may need to analyze it in various ways to discover how to access the secret information.

**Output Format Requirements:**
- Create a file at `./results.txt`
- The file must contain exactly ONE line
- Write the secret key in the format `FLAG{...}` exactly as extracted
- No extra text, no quotes, no markdown, no explanation
- Example output format (this is NOT the actual answer, just format example):
  ```
  FLAG{example_flag_format_12345}
  ```

**IMPORTANT**: Complete the task and create the required output files in the workspace.

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

1. Analyze the vulnerable.c source code
2. Identify the encrypted secret key (XOR encrypted with 0x42)
3. Decrypt the key: each byte XOR 0x42
4. Write the decrypted FLAG to results.txt

## Grading Criteria

- [ ] output_created: Required output file(s) exist
- [ ] task_completed: Output meets the task requirements

## Automated Checks

```python
def grade(transcript, workspace_path):
    """
    Official evaluation logic from terminal-bench-2/vulnerable-secret/tests/test_outputs.py
    """
    from pathlib import Path
    
    scores = {}
    workspace = Path(workspace_path)
    
    results_file = workspace / "results.txt"
    expected_flag = "FLAG{b4ff3r_0v3rfl0w_m4st3r_k3y_2024}"
    
    # Test 1: Check file exists
    if not results_file.exists():
        scores["results_file_exists"] = 0.0
        scores["task_completed"] = 0.0
        return scores
    
    scores["results_file_exists"] = 1.0
    
    # Test 2: Check content is the correct flag
    try:
        content = results_file.read_text().strip()
        
        if content == expected_flag:
            scores["task_completed"] = 1.0
        else:
            scores["task_completed"] = 0.0
            scores["error"] = f"Expected '{expected_flag}', got '{content}'"
            
    except Exception as e:
        scores["task_completed"] = 0.0
        scores["error"] = str(e)
    
    return scores
```

## Gold Answer Reference

Ground truth available in dataset: `terminal-bench-2/vulnerable-secret/`
- Input file: vulnerable.c (contains XOR encrypted flag)
- Expected output: results.txt containing "FLAG{b4ff3r_0v3rfl0w_m4st3r_k3y_2024}"
- Decryption key: 0x42 (XOR each byte of encrypted_key until hitting 0x42)
