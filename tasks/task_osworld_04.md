---
id: task_osworld_04
name: OSWorld os - Rename Directory
category: os
level: L2
grading_type: automated
timeout_seconds: 480
environment:
  type: sandbox
  requirements: []
workspace_files:
  - source: osworld/README.md
    dest: todo_list_Jan_1/README.md
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

I have a directory named "todo_list_Jan_1". Can you help me change its name into "todo_list_Jan_2"?

 

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

The agent should:
1. Rename the directory "todo_list_Jan_1" to "todo_list_Jan_2"
2. Preserve the contents of the directory

## Grading Criteria

- [ ] old_dir_removed: todo_list_Jan_1 no longer exists
- [ ] new_dir_created: todo_list_Jan_2 exists
- [ ] contents_preserved: Directory contents are preserved

## Automated Checks

```python
def grade(transcript, workspace_path):
    from pathlib import Path
    scores = {}
    
    workspace = Path(workspace_path)
    old_dir = workspace / "todo_list_Jan_1"
    new_dir = workspace / "todo_list_Jan_2"
    
    scores["old_dir_removed"] = 0.0 if old_dir.exists() else 1.0
    scores["new_dir_created"] = 1.0 if new_dir.exists() else 0.0
    
    if new_dir.exists():
        files = list(new_dir.iterdir())
        scores["contents_preserved"] = 1.0 if len(files) > 0 else 0.0
    else:
        scores["contents_preserved"] = 0.0
    
    return scores
```

## Additional Notes

- Original OSWorld ID: e0df059f-28a6-4169-924f-b9623e7184cc
- Category: os
- The directory todo_list_Jan_1 with a README.md file is provided
