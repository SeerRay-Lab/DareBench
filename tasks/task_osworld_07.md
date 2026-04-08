---
id: task_osworld_07
name: OSWorld vscode - 0ed39f63
category: vscode
level: L2
grading_type: automated
timeout_seconds: 480
environment:
  type: sandbox
  requirements: []
workspace_files:
  - source: osworld/0ed39f63-6049-43d4-ba4d-5fa2fe04a951_vscode_replace_text.txt
    dest: vscode_replace_text.txt
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Please help me change all the places in this document that say "text" to "test".

 

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

The agent should complete the task as specified in the instruction. This may involve executing commands, modifying files, or using appropriate tools.

## Grading Criteria

- [ ] task_completed: Task is completed successfully

## Automated Checks

```python
def grade(transcript, workspace_path):
    from pathlib import Path
    scores = {}
    
    workspace = Path(workspace_path)
    
    # Check for files with "test" replacing "text"
    for f in workspace.iterdir():
        if f.is_file() and f.suffix == ".txt":
            try:
                content = f.read_text()
                # Original has "text", modified should have "test"
                if "test" in content and content.count("text") <= content.count("test"):
                    scores["text_replaced"] = 1.0
                    scores["file_saved"] = 1.0
                    return scores
            except:
                pass
    
    scores["text_replaced"] = 0.0
    scores["file_saved"] = 0.0
    return scores
```

## Additional Notes

- Original OSWorld ID: 0ed39f63-6049-43d4-ba4d-5fa2fe04a951
- Category: vscode
