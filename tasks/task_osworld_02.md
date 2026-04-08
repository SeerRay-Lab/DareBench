---
id: task_osworld_02
name: OSWorld os - Copy JPG Files Recursively
category: os
level: L2
grading_type: automated
timeout_seconds: 480
environment:
  type: sandbox
  requirements: []
workspace_files:
  - source: osworld/23393935-50c7-4a86-aeea-2b78fd089c5c_monk252520thailand252520wat252520arun252520scaled25255B225255D.jpg
    dest: photos/vacation/thailand/monk252520thailand252520wat252520arun252520scaled25255B225255D.jpg
  - source: osworld/23393935-50c7-4a86-aeea-2b78fd089c5c_hong-kong-china.jpg
    dest: photos/vacation/hk/hong-kong-china.jpg
  - source: osworld/23393935-50c7-4a86-aeea-2b78fd089c5c_hk_group_photo.jpg
    dest: photos/vacation/hk/hk_group_photo.jpg
  - source: osworld/23393935-50c7-4a86-aeea-2b78fd089c5c_us_3.png
    dest: photos/family/us_3.png
  - source: osworld/23393935-50c7-4a86-aeea-2b78fd089c5c_emnlp2023.jpg
    dest: photos/events/emnlp2023.jpg
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Recursively go through the folders of the 'photos' directory and copy any .jpg files found into another directory named 'cpjpg'.

 

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

The agent should:
1. Find all .jpg files in the photos directory and subdirectories
2. Create the cpjpg directory if it doesn't exist
3. Copy all 4 .jpg files to cpjpg (the .png file should NOT be copied)

## Grading Criteria

- [ ] cpjpg_created: cpjpg directory exists
- [ ] all_jpg_copied: All 4 .jpg files are copied
- [ ] png_not_copied: The .png file is not in cpjpg

## Automated Checks

```python
def grade(transcript, workspace_path):
    from pathlib import Path
    scores = {}
    
    workspace = Path(workspace_path)
    cpjpg = workspace / "cpjpg"
    
    if not cpjpg.exists():
        scores["cpjpg_created"] = 0.0
        scores["all_jpg_copied"] = 0.0
        scores["png_not_copied"] = 0.0
        return scores
    
    scores["cpjpg_created"] = 1.0
    
    files = [f.name for f in cpjpg.iterdir() if f.is_file()]
    
    expected_jpgs = [
        "emnlp2023.jpg",
        "hk_group_photo.jpg",
        "hong-kong-china.jpg",
        "monk252520thailand252520wat252520arun252520scaled25255B225255D.jpg"
    ]
    
    jpg_count = sum(1 for jpg in expected_jpgs if any(jpg in f for f in files))
    scores["all_jpg_copied"] = jpg_count / len(expected_jpgs)
    
    png_in_cpjpg = any("us_3.png" in f or f.endswith(".png") for f in files)
    scores["png_not_copied"] = 0.0 if png_in_cpjpg else 1.0
    
    return scores
```

## Additional Notes

- Original OSWorld ID: 23393935-50c7-4a86-aeea-2b78fd089c5c
- Category: os
- Expected files in cpjpg: 4 .jpg files
- The us_3.png should NOT be copied
