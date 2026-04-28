# ClawWorld

## Quick Start

### Step 1: Install OpenClaw and required skills

```bash
# Install OpenClaw
curl -fsSL https://openclaw.ai/install.sh | bash

# Install skills from Clawhub
clawhub install self-improving-agent
clawhub install summarize
clawhub install gog
clawhub install proactive-agent
clawhub install skill-vetter
clawhub install humanizer
clawhub install github
clawhub install multi-search-engine
clawhub install ontology
clawhub install agent-browser-clawdbot
clawhub install desktop-control

# Configure your models (providers, API keys, etc.)
openclaw onboard
```

### Step 2: Run the benchmark

**Requirements**

- Python 3.10+
- [uv](https://docs.astral.sh/uv/) package manager
- A running OpenClaw instance (when using the `openclaw` executor)

**2.1 Clone this repository**

```bash
git clone https://github.com/leozhilin/ClawWorld.git
cd ClawWorld
```

**2.2 Configure the judge model**

LLM-judged tasks use a separate model. Edit `scripts/lib_grading.py` and set `DEFAULT_JUDGE_MODEL` to a provider/model your OpenClaw setup can run, for example:

```python
DEFAULT_JUDGE_MODEL = "PROVIDER_NAME/MODEL_NAME"
```

The repo default is `modelstudio/qwen3.5-plus`; change it if that ID is not available in your environment.

**2.3 Launch runs**

- **Parallel (multiple models)** — edit the `MODELS=( ... )` array in `scripts/run_parallel.sh`, then:

  ```bash
  ./scripts/run_parallel.sh
  ```

  Keep concurrent models modest (about **5 or fewer**) to reduce flaky failures from rate limits or resource contention. Extra `benchmark.py` flags can be appended; they are forwarded to every worker.

  Optional: set `PINCHBENCH_EXECUTOR=openclaw` or `basemodel`, or pass `--executor openclaw|basemodel` to override the default (`openclaw`).

- **Serial (multiple models, one after another)** — same `MODELS=( ... )` idea in `scripts/run_serial.sh`:

  ```bash
  ./scripts/run_serial.sh
  ```

- **Single model (direct)** — no need to edit the parallel scripts:

  ```bash
  ./scripts/run.sh --model PROVIDER_NAME/MODEL_NAME
  ```

## Command reference (`scripts/benchmark.py`)

These flags match the current CLI in `scripts/benchmark.py` (invoked via `uv run` from the repo root, or through `./scripts/run.sh`).

| Flag | Description |
|------|-------------|
| `--model MODEL` | Model under test (e.g. `openrouter/anthropic/claude-sonnet-4.6`). Required for `./scripts/run.sh`; parallel/serial scripts set this per entry in `MODELS`. |
| `--suite SUITE` | `all` (default), `automated-only`, or comma-separated task IDs |
| `--runs N` | Number of runs per task for averaging (default: `1`) |
| `--timeout-multiplier N` | Multiplier for all task timeouts (default: `1.0`) |
| `--output-dir DIR` | Where to write results (default: `results`) |
| `--session-backup-dir DIR` | Directory for session transcript backups (parallel scripts set this under each run’s log folder) |
| `--executor EXEC` | `openclaw` or `basemodel` (default: `openclaw`) |
| `--verbose`, `-v` | Verbose logging (transcripts, workspace detail, etc.) |
