# How to run DAREBench on a model

This page explains how to evaluate a model on the 233 DAREBench tasks with the same setup as the paper
([arXiv 2609.06059](https://arxiv.org/abs/2609.06059)). Humans can follow it directly, and it can also be handed
to an AI coding agent such as Codex. Run each step in order and check its expected output before going on.

## 0. What you need

- **Machine.** Linux x86_64 (the paper used Ubuntu 24.04), about 20 GB of free disk, `git`, `curl`, Node.js 22
  and Python ≥ 3.10 with [`uv`](https://docs.astral.sh/uv/).
- **API keys.** Keep them in environment variables and never commit them.
  - `OPENROUTER_API_KEY`: the model under test and the LLM judge. The paper accessed API models through OpenRouter.
    Other OpenAI-compatible endpoints and local vLLM servers also work (§2).
  - `BRAVE_API_KEY`: the agents' `web_search` tool. The paper used Brave Search.
- **Budget.** A full run of one model is 233 tasks and takes several hours. At the per-task costs in paper Table 2
  ($0.005–$0.44), it costs roughly $1–$100, depending on the model.

## 1. Install OpenClaw (pinned version)

```bash
npm install -g openclaw@2026.3.28 clawhub@0.23.3
openclaw --version        # expected: OpenClaw 2026.3.28 (f9b1079)
```

Use exactly this version.
- 2026.3.28 is the version printed in the paper's run logs. The 2026.3.20 named in the paper was never published on npm.
- Do **not** use `curl https://openclaw.ai/install.sh | bash`: it installs the latest OpenClaw.
- Newer releases changed how sessions are stored. The benchmark then cannot read the agent transcripts, and every
  task scores 0.

## 2. Configure the model provider and web search

**OpenRouter** (the paper's setup). Run this non-interactively:

```bash
export OPENROUTER_API_KEY=...        # your key
export BRAVE_API_KEY=...             # your key
openclaw onboard --non-interactive --accept-risk --mode local \
  --auth-choice openrouter-api-key --secret-input-mode ref \
  --skip-channels --skip-daemon --skip-health --skip-search --skip-skills --skip-ui
openclaw config set tools.web.search.provider brave
```

`--secret-input-mode ref` stores only the variable names in `~/.openclaw/openclaw.json`, never the keys. The keys must
therefore also be exported in the shell that runs the gateway (§4). If you do not pin `brave`, OpenClaw silently
uses another search backend, and the results are no longer comparable to the paper.

**Check that OpenClaw knows your model:**

```bash
openclaw models list --all --provider openrouter --plain | grep -x 'openrouter/<vendor>/<model>'
```

If nothing is printed, the model is newer than OpenClaw 2026.3.28. OpenClaw would then run it with thinking off and
an 8,192-token output cap. Declare the model yourself, using the capabilities listed on its OpenRouter model page:

```bash
openclaw config set models.providers.openrouter '{"baseUrl":"https://openrouter.ai/api/v1","api":"openai-completions",
  "models":[{"id":"<vendor>/<model>","name":"<vendor>/<model>","reasoning":true,"input":["text","image"],
  "contextWindow":400000,"maxTokens":128000}]}' --strict-json
```

- `reasoning`: `true` if the model supports reasoning.
- `input`: `["text"]` for text-only models.
- `contextWindow` and `maxTokens`: the context length and maximum output length from the OpenRouter page.

**Other providers.**
- For a vendor API, any other OpenAI-compatible endpoint, or a local vLLM server, run `openclaw onboard`
  interactively and choose the provider ("vLLM" or "Custom provider"), with its base URL and key.
- The paper served local models with vLLM: FP16, 32K context, one GPU, no quantization, prefix caching enabled.
- Then open `~/.openclaw/openclaw.json` and look at your model under `models.providers.<name>.models`. Set
  `contextWindow` (≥ 32768) and `maxTokens` (≥ 8192), set `reasoning: true` for thinking models, and add `"image"`
  to `input` for vision models. The defaults (16000 / 4096, text-only) silently truncate long tasks.

## 3. Install the skills

The paper gives every model the same ClawHub skills. The old `clawhub install <name>` commands no longer work,
because the bare names are now ambiguous on ClawHub. Install the exact owner and version instead (the versions that
were current when the paper's runs started):

```bash
mkdir -p ~/.openclaw/skills
for s in "@oswalpalash/ontology 1.0.4" "@pskoett/self-improving-agent 3.0.5" "@spclaudehome/skill-vetter 1.0.0" \
         "@matrixy/agent-browser-clawdbot 0.1.0" "@matagul/desktop-control 1.0.0" "@steipete/github 1.0.0" \
         "@halthelobster/proactive-agent 3.1.0" "@biostartechnology/humanizer 1.0.0" \
         "@steipete/gog 1.0.0" "@gpyangyoujun/multi-search-engine 2.0.1" "@jackhua6/analyzing-financial-statements 1.0.0"; do
  set -- $s
  clawhub install "$1" --version "$2" --workdir ~/.openclaw --dir skills --no-input --force
done
# clawhub puts them in skills/@owner/<name>, but OpenClaw only looks one level deep: flatten them.
(cd ~/.openclaw/skills && for d in @*/*/; do mv "$d" .; done; rmdir @* 2>/dev/null; ls -1)
```

Expected output: the 11 skill folders (`agent-browser-clawdbot`, `analyzing-financial-statements`, `desktop-control`,
`github`, `gog`, `humanizer`, `multi-search-engine`, `ontology`, `proactive-agent`, `self-improving-agent`, `skill-vetter`).

- This is the set installed on the machine that produced the paper's runs. The paper's list also names `summarize`,
  which is no longer on ClawHub.
- Two skills need helper programs:
  - `github` needs the `gh` CLI (`sudo apt install gh`).
  - `agent-browser-clawdbot` needs the `agent-browser` binary with its Chrome
    (`npm install -g agent-browser@0.25.3 && agent-browser install --with-deps`).

## 4. Start the OpenClaw gateway

Start the gateway in a separate terminal, `tmux` or `nohup`, in a shell where `OPENROUTER_API_KEY` and
`BRAVE_API_KEY` are exported. Keep it running for the whole benchmark run.

```bash
openclaw gateway run --bind loopback
```

Then, in the benchmark shell, make this the **first** OpenClaw command after the gateway starts:

```bash
openclaw gateway call health          # expected: JSON with "ok": true
openclaw devices approve --latest     # harmless if nothing is pending
```

If the first command is `openclaw status` or `openclaw health` instead, the CLI is paired read-only. Agent runs then
silently bypass the gateway.

## 5. Get DAREBench and set the judge

```bash
git clone https://github.com/SeerRay-Lab/DareBench.git
cd DareBench
```

LLM-judged and hybrid tasks (108 of 233) are scored by a separate judge model. Set it in `scripts/lib_grading.py`:

```bash
sed -i 's|^DEFAULT_JUDGE_MODEL = .*|DEFAULT_JUDGE_MODEL = "openrouter/qwen/qwen3.5-plus-02-15"|' scripts/lib_grading.py
grep -n '^DEFAULT_JUDGE_MODEL' scripts/lib_grading.py
```

- The paper's primary judge is the Qwen3.5-(VL-)Plus family. The archived runs used
  `openrouter/qwen/qwen3.5-plus-02-15`, DashScope `qwen3-vl-plus` and `modelstudio/qwen3.5-plus`.
- A different judge changes the judged scores. Use one judge for every model you compare, and report which one.

## 6. Smoke test (2 tasks, a few cents)

```bash
bash scripts/run.sh --model openrouter/<vendor>/<model> --suite task_logiqa_00,task_advancedif_00
```

- **Model id.** Use the lowercase id exactly as the provider lists it, e.g. `openrouter/openai/gpt-5.4`. OpenClaw
  lowercases agent ids and caps them at 64 characters. An id with capitals or one that is too long silently breaks
  the workspace lookup, and automated tasks then score 0.
- **Expected.** The run ends with a score summary for 2 tasks, and a new JSON file appears in `results/`.
  `task_logiqa_00` is scored automatically; `task_advancedif_00` is scored by the judge. If both scores are 0, go to §9
  before spending more.

## 7. Full run

```bash
bash scripts/run.sh --model openrouter/<vendor>/<model>                  # all 233 tasks
bash scripts/run.sh --model openrouter/<vendor>/<model> --runs 3         # optional: average over 3 runs
```

| Flag | Meaning |
| --- | --- |
| `--suite` | `all` (default), `automated-only`, or comma-separated task ids |
| `--runs N` | runs per task, averaged (default 1; the paper used 1) |
| `--timeout-multiplier X` | scales every task's time budget (default 1.0; keep 1.0 for paper comparability) |
| `--output-dir DIR` | where result JSONs go (default `results/`) |
| `--executor` | `openclaw` (default, the paper's setup) or `basemodel` (plain LLM, no agent) |
| `--verbose` | more logging |

- **Several models.** Edit `MODELS=( ... )` in `scripts/run_serial.sh` and run `bash scripts/run_serial.sh`. Prefer serial runs.
  `scripts/run_parallel.sh` shares one gateway, so keep it to 5 models or fewer.
- **Between models.** Restart the gateway (§4). A task that hits its time limit can leave its agent running inside
  the gateway.
- **Failed tasks.** Re-run only tasks that failed for infrastructure reasons (HTTP 401/429/5xx, network errors),
  with `--suite <ids>`. The paper did not re-run tasks that the model itself failed.

## 8. Results

- Each run writes a JSON file to `results/`, with per-task scores, token usage and grading details.
- Print the paper-style row: the six workload groups, Text Avg, MM Avg and Overall, task-count weighted as in the paper.

  ```bash
  python3 tools/group_report.py results/                 # add --text-only for text-only models
  ```

  Do not use `scripts/get_result.py` to compare with the paper: its source-to-group table is outdated.
- **Comparability.** Paper Table 1 scores went through an evidence-based meta-judge audit, which removed 143 of 3,340
  judge-based positive scores. That audit is not in this repository, so your scores are pre-audit. Compare with care,
  and name the judge and the OpenClaw version when you report numbers.
- **Sending results to the maintainers.** Send the `results/*.json` file(s), the terminal log, the model id, the judge
  model and the output of `openclaw --version`.

## 9. Troubleshooting

| Symptom | Fix |
| --- | --- |
| Every task scores 0, or "transcript not found" | Wrong OpenClaw version: `npm install -g openclaw@2026.3.28` (§1). |
| Automated tasks score 0 but judged tasks do not | The model id has capitals or is too long (§6). |
| `pairing required`, or runs do not appear in the gateway log | Restart the gateway and run `openclaw gateway call health` first (§4). |
| The agent never searches, or search errors appear | `BRAVE_API_KEY` is not exported in the gateway's shell, or `tools.web.search.provider` is not `brave` (§2). |
| `clawhub install` says a skill is ambiguous or not found | Use the `@owner/name` list with versions (§3). |
| Skills are installed but not visible to the agent | Folders are still under `~/.openclaw/skills/@owner/`: run the flatten line (§3). |
| HTTP 401 / 403 / 429 in the output | Key, quota or rate limit. Fix it, then re-run those tasks with `--suite <ids>` (§7). |
| Long tasks are cut off, or a model thinks less than expected | Model capabilities are not declared (§2 "Check that OpenClaw knows your model"). |
