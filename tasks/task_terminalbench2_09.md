---
id: task_terminalbench2_09
name: "TerminalBench2 - bn-fit-modify"
category: software_engineering
level: L2
grading_type: automated
timeout_seconds: 480
environment:
  type: sandbox
  requirements: []
workspace_files:
  - source: terminal_bench/bn_sample_10k.csv
    dest: bn_sample_10k.csv
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

You are provided with a dataset sample from a Bayesian Network in ./bn_sample_10k.csv. 
Your first task is to recover the underlying DAG using the provided data.

Here is some information about the original DAG that you may find useful:
  - U has no parents 
  - There are six total edges in the DAG that the data was sampled from
  - There may be edges not involving U for which directionality is not clear, in this case you 
    may assume that the node labeled with the letter that comes first in the alphabet is the child 
    of the node that comes second.

Once you have found a DAG take the following steps:
1. Learn a Bayesian Network from the data using the DAG you recovered
2. Perform a causal intervention on Y, setting its value to 0.0 (use 10e-9 variance if exact value not supported)
3. Sample 10k points from the intervened BN

**Output Format Requirements:**

You must create THREE output files:

1. **learned_dag.csv**: DAG edges before intervention
   - CSV with header: `from,to`
   - Each row is one directed edge (parent -> child)
   - Example:
     ```csv
     from,to
     U,M
     U,Y
     Y,D
     ```

2. **intervened_dag.csv**: DAG edges after intervention
   - Same format as learned_dag.csv
   - Should reflect the intervention on Y

3. **final_bn_sample.csv**: Sampled data from intervened BN
   - Same column names as original bn_sample_10k.csv
   - CSV format with header
   - Exactly 10,000 data rows

**IMPORTANT**: Complete the task and create the required output files in the workspace.

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

1. Analyze bn_sample_10k.csv to recover the DAG structure
2. Save learned DAG to learned_dag.csv
3. Learn a Bayesian Network and perform intervention on Y=0.0
4. Save intervened DAG to intervened_dag.csv
5. Sample 10k points and save to final_bn_sample.csv

## Grading Criteria

- [ ] output_created: Required output file(s) exist
- [ ] task_completed: Output meets the task requirements

## Automated Checks

```python
def grade(transcript, workspace_path):
    """
    Official evaluation logic from terminal-bench-2/bn-fit-modify/tests/test_outputs.py

    Validates learned DAG structure matches expected edges.
    (stdlib csv — no pandas)
    """
    import csv
    from pathlib import Path

    scores = {}
    workspace = Path(workspace_path)

    true_dag = {("U", "M"), ("U", "Y"), ("U", "D"), ("U", "R"), ("Y", "D"), ("R", "M")}

    learned_dag_path = workspace / "learned_dag.csv"
    if not learned_dag_path.exists():
        scores["learned_dag_exists"] = 0.0
        scores["task_completed"] = 0.0
        return scores

    scores["learned_dag_exists"] = 1.0

    try:
        with open(learned_dag_path, newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            fieldnames = list(reader.fieldnames or [])
            expected_columns = ["from", "to"]
            if not all(col in fieldnames for col in expected_columns):
                scores["task_completed"] = 0.0
                scores["error"] = f"Missing columns. Expected: {expected_columns}"
                return scores
            rows = list(reader)

        if not rows:
            scores["task_completed"] = 0.0
            scores["error"] = "Learned DAG is empty"
            return scores

        learned_edges = {
            (str(row["from"]).strip(), str(row["to"]).strip()) for row in rows
        }

        if learned_edges == true_dag:
            scores["dag_structure_correct"] = 1.0
            scores["task_completed"] = 1.0
        else:
            scores["dag_structure_correct"] = 0.0
            scores["task_completed"] = 0.0
            scores["error"] = f"Expected edges: {true_dag}, got: {learned_edges}"

    except Exception as e:
        scores["task_completed"] = 0.0
        scores["error"] = str(e)

    return scores
```

## Gold Answer Reference

Ground truth available in dataset: `terminal-bench-2/bn-fit-modify/`
- Input file: bn_sample_10k.csv (10k samples from Bayesian Network)
- Expected DAG edges: (U,M), (U,Y), (U,D), (U,R), (Y,D), (R,M)
- Output files: learned_dag.csv, intervened_dag.csv, final_bn_sample.csv
