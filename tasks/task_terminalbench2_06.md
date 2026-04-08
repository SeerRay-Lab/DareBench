---
id: task_terminalbench2_06
name: "TerminalBench2 - raman-fitting"
category: software_engineering
level: L2
grading_type: automated
timeout_seconds: 480
environment:
  type: sandbox
  requirements: []
workspace_files:
  - source: terminal_bench/graphene.dat
    dest: graphene.dat
grading_weights:
  automated: 1.0
  llm_judge: 0.0
---

## Prompt

Fit the peaks of the graphene Raman spectrum.

You are provided with a graphene Raman spectrum data file (./graphene.dat). The file contains two columns: Raman shift (cm^-1) and intensity.

Your task is to:
1. Fit the G peak (~1580 cm^-1) with a Lorentzian function plus a linear background
2. Fit the 2D peak (~2700 cm^-1) with a Lorentzian function plus a linear background

**Output Format Requirements:**
- Create a file at `./results.json`
- The file must contain a valid JSON object with two keys: `"G"` and `"2D"`
- Each peak object must have exactly these four numeric fields:
  - `x0`: center position (Raman shift)
  - `gamma`: FWHM (full width at half maximum)
  - `amplitude`: peak amplitude
  - `offset`: background offset
- Example format (values are approximate, NOT actual answers):
  ```json
  {
    "G": {
      "x0": 1500.0,
      "gamma": 10.0,
      "amplitude": 8000.0,
      "offset": 5000.0
    },
    "2D": {
      "x0": 2600.0,
      "gamma": 25.0,
      "amplitude": 4000.0,
      "offset": 800.0
    }
  }
  ```
- All values must be numbers (not strings)
- No extra text outside the JSON object

**IMPORTANT**: Complete the task and create the required output files in the workspace.

**Note**: You may use available tools or skills in the system to complete this task.

and you need to complete the task in 480s.

## Expected Behavior

1. Load graphene.dat spectrum data
2. Identify and fit G peak (~1580 cm^-1)
3. Identify and fit 2D peak (~2700 cm^-1)
4. Extract fitting parameters (x0, gamma, amplitude, offset)
5. Save results to results.json

## Grading Criteria

- [ ] output_created: Required output file(s) exist
- [ ] task_completed: Output meets the task requirements

## Automated Checks

```python
def grade(transcript, workspace_path):
    """
    Official evaluation logic from terminal-bench-2/raman-fitting/tests/test_outputs.py
    
    Validates G peak fitting parameters within tolerance.
    2D peak validation omitted for brevity but follows same logic.
    """
    import json
    from pathlib import Path
    
    scores = {}
    workspace = Path(workspace_path)
    
    results_file = workspace / "results.json"
    
    # Test 1: Check file exists
    if not results_file.exists():
        scores["results_file_exists"] = 0.0
        scores["task_completed"] = 0.0
        return scores
    
    scores["results_file_exists"] = 1.0
    
    # Test 2: Validate G peak parameters
    try:
        with open(results_file, "r") as f:
            data = json.load(f)
        
        G_peak = data["G"]
        
        # Expected values with tolerances
        x0_expected = 1580.3
        gamma_expected = 9.06
        A_expected = 8382.69
        offset_expected = 5561.03
        
        x0 = G_peak["x0"]
        gamma = G_peak["gamma"]
        A = G_peak["amplitude"]
        offset = G_peak["offset"]
        
        # Check tolerances
        x0_correct = abs(x0 - x0_expected) < 5
        gamma_correct = abs(gamma - gamma_expected) < 1
        A_correct = abs(1 - A / A_expected) < 0.05
        offset_correct = abs(1 - offset / offset_expected) < 0.1
        
        if x0_correct and gamma_correct and A_correct and offset_correct:
            scores["g_peak_correct"] = 1.0
            scores["task_completed"] = 1.0
        else:
            scores["g_peak_correct"] = 0.0
            scores["task_completed"] = 0.0
            scores["error"] = f"G peak mismatch: x0={x0}, gamma={gamma}, A={A}, offset={offset}"
            
    except Exception as e:
        scores["task_completed"] = 0.0
        scores["error"] = str(e)
    
    return scores
```

## Gold Answer Reference

Ground truth available in dataset: `terminal-bench-2/raman-fitting/`
- Input file: graphene.dat (Raman spectrum data)
- Expected output: results.json with G and 2D peak fitting parameters
- G peak expected: x0≈1580.3, gamma≈9.06, amplitude≈8382.69, offset≈5561.03
