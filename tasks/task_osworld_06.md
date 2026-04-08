---
id: task_osworld_06
name: OSWorld vscode - Indent Adjustment
category: vscode
level: L2
grading_type: automated
timeout_seconds: 480
environment:
  type: sandbox
  requirements: []
workspace_files:
  - source: osworld/ec71221e-ac43-46f9-89b8-ee7d80f7e1c5_test.py
    dest: test.py
  - source: osworld/ec71221e-ac43-46f9-89b8-ee7d80f7e1c5_test_gold.py
    dest: test_ground_truth.py
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Please help me increase the indent of line 2 to line 10 by one tab.

 

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

The agent should:
1. Open test.py in VS Code:
2. Select lines 2-10
3. Increase indentation by one tab (or use VS Code: indent command)
4. Save the file

## Grading Criteria

- [ ] file_modified: test.py has been modified
- [ ] indent_correct: Lines 2-10 have increased indentation

## Automated Checks

```python
def grade(transcript, workspace_path):
    from pathlib import Path
    scores = {}
    
    workspace = Path(workspace_path)
    test_file = workspace / "test.py"
    gold_file = workspace / "test_ground_truth.py"
    
    if not test_file.exists():
        scores["file_modified"] = 0.0
        scores["indent_correct"] = 0.0
        return scores
    
    scores["file_modified"] = 1.0
    
    # Compare with gold file
    if gold_file.exists():
        try:
            test_content = test_file.read_text()
            gold_content = gold_file.read_text()
            
            # Check if indentation matches gold file
            if test_content == gold_content:
                scores["indent_correct"] = 1.0
            else:
                # Partial credit - check if at least some lines have extra indent
                test_lines = test_content.splitlines()
                gold_lines = gold_content.splitlines()
                
                if len(test_lines) >= 10 and len(gold_lines) >= 10:
                    # Check lines 2-10 (indices 1-9)
                    correct_lines = 0
                    for i in range(1, min(10, len(test_lines), len(gold_lines))):
                        if test_lines[i].startswith("    ") or test_lines[i].startswith("\t"):
                            correct_lines += 1
                    scores["indent_correct"] = correct_lines / 9.0
                else:
                    scores["indent_correct"] = 0.0
        except:
            scores["indent_correct"] = 0.0
    else:
        # Fallback: just check if file was modified
        scores["indent_correct"] = 0.5
    
    return scores
```

## Additional Notes

- Original OSWorld ID: ec71221e-ac43-46f9-89b8-ee7d80f7e1c5
- Category: vscode
- Gold file (test_gold.py) is provided for comparison
