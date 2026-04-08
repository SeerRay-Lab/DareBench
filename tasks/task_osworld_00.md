---
id: task_osworld_00
name: OSWorld os - Copy Failed Notebooks
category: os
level: L3
grading_type: automated
timeout_seconds: 480
environment:
  type: sandbox
  requirements: []
workspace_files:
  - source: osworld/5c1075ca-bb34-46a3-a7a0-029bd7463e79_setup.sh
    dest: setup.sh
  - source: osworld/5c1075ca-bb34-46a3-a7a0-029bd7463e79_eval.sh
    dest: eval.sh
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Copy all files matching "*failed.ipynb" in the current directory tree to "./fails" preserving the directory hierarchy

 

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

The agent should:
1. First run `bash setup.sh` to create test environment
2. Find all *failed.ipynb files in test_environment
3. Copy them to ./fails preserving directory structure

## Grading Criteria

- [ ] files_copied: All *failed.ipynb files are copied to fails/
- [ ] hierarchy_preserved: Directory structure is preserved

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
            
            if "Evaluation successful." in output:
                scores["files_copied"] = 1.0
                scores["hierarchy_preserved"] = 1.0
            else:
                scores["files_copied"] = 0.0
                scores["hierarchy_preserved"] = 0.0
        except:
            scores["files_copied"] = 0.0
            scores["hierarchy_preserved"] = 0.0
    else:
        # Fallback: check fails/ directory directly
        fails_dir = workspace / "fails"
        if fails_dir.exists():
            files = list(fails_dir.rglob("*.ipynb"))
            scores["files_copied"] = min(1.0, len(files) / 3.0)  # Expect 3 files
            scores["hierarchy_preserved"] = 1.0 if len(files) > 0 else 0.0
        else:
            scores["files_copied"] = 0.0
            scores["hierarchy_preserved"] = 0.0
    
    return scores
```

## Additional Notes

- Original OSWorld ID: 5c1075ca-bb34-46a3-a7a0-029bd7463e79
- Category: os
- Both setup.sh and eval.sh are provided in workspace
