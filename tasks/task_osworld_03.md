---
id: task_osworld_03
name: OSWorld os - Copy File to Directories
category: os
level: L2
grading_type: automated
timeout_seconds: 480
environment:
  type: sandbox
  requirements: []
workspace_files:
  - source: osworld/6f56bf42-85b8-4fbb-8e06-6c44960184ba_setup.sh
    dest: setup.sh
  - source: osworld/6f56bf42-85b8-4fbb-8e06-6c44960184ba_eval.sh
    dest: eval.sh
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Copies file 'file1' to each of directories 'dir1', 'dir2', 'dir3'.

 

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

The agent should:
1. First run `bash setup.sh` to create test environment (creates dir1, dir2, dir3 and file1)
2. Copy file1 to dir1, dir2, and dir3

## Grading Criteria

- [ ] file_copied_dir1: file1 exists in dir1
- [ ] file_copied_dir2: file1 exists in dir2
- [ ] file_copied_dir3: file1 exists in dir3

## Automated Checks

```python
def grade(transcript, workspace_path):
    import subprocess
    from pathlib import Path
    scores = {}
    
    workspace = Path(workspace_path)
    eval_script = workspace / "eval.sh"
    
    # Run eval to check result
    if eval_script.exists():
        try:
            result = subprocess.run(
                ["bash", str(eval_script)],
                cwd=workspace,
                capture_output=True,
                text=True,
                timeout=30
            )
            output = result.stdout + result.stderr
            
            scores["file_copied_dir1"] = 1.0 if "Success: file1 exists in dir1." in output else 0.0
            scores["file_copied_dir2"] = 1.0 if "Success: file1 exists in dir2." in output else 0.0
            scores["file_copied_dir3"] = 1.0 if "Success: file1 exists in dir3." in output else 0.0
        except:
            scores["file_copied_dir1"] = 0.0
            scores["file_copied_dir2"] = 0.0
            scores["file_copied_dir3"] = 0.0
    else:
        # Fallback: check files directly
        scores["file_copied_dir1"] = 1.0 if (workspace / "dir1" / "file1").exists() else 0.0
        scores["file_copied_dir2"] = 1.0 if (workspace / "dir2" / "file1").exists() else 0.0
        scores["file_copied_dir3"] = 1.0 if (workspace / "dir3" / "file1").exists() else 0.0
    
    return scores
```

## Additional Notes

- Original OSWorld ID: 6f56bf42-85b8-4fbb-8e06-6c44960184ba
- Category: os
- Both setup.sh and eval.sh are provided
