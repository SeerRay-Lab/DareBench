#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

mkdir -p logs
TS="$(date +%Y%m%d_%H%M%S)"
EXECUTOR="${PINCHBENCH_EXECUTOR:-openclaw}"

PASSTHROUGH_ARGS=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --executor)
      if [[ $# -lt 2 ]]; then
        echo "Missing value for --executor (expected: openclaw|basemodel)" >&2
        exit 2
      fi
      EXECUTOR="$2"
      shift 2
      ;;
    --executor=*)
      EXECUTOR="${1#*=}"
      shift
      ;;
    *)
      PASSTHROUGH_ARGS+=("$1")
      shift
      ;;
  esac
done

if [[ "$EXECUTOR" != "openclaw" && "$EXECUTOR" != "basemodel" ]]; then
  echo "Invalid executor: $EXECUTOR (expected: openclaw|basemodel)" >&2
  exit 2
fi

LOGDIR="${ROOT}/logs/${EXECUTOR}_serial_${TS}"
mkdir -p "$LOGDIR"

MODELS=(
  # "openrouter/anthropic/claude-sonnet-4.6"
  # "openrouter/anthropic/claude-haiku-4.5"
  # "openrouter/anthropic/claude-opus-4.6"
  "openrouter/google/gemini-3.1-pro-preview"
  # "openrouter/google/gemini-3-flash-preview"
  # "openrouter/openai/gpt-5.4"
  # "openrouter/openai/gpt-5.4-mini"
  # "openrouter/openai/gpt-5.2"
  # "openrouter/xiaomi/mimo-v2-pro"
  # "openrouter/xiaomi/mimo-v2-omni"
  # "openrouter/deepseek/deepseek-v3.2"
  # "openrouter/z-ai/glm-5"
  # "openrouter/z-ai/glm-4.7"
  # "openrouter/minimax/minimax-m2.7"
  # "openrouter/moonshotai/kimi-k2.5"
  # "openrouter/qwen/qwen3.5-plus-02-15"
  # "openrouter/qwen/qwen3.6-plus"
  # "openrouter/google/gemini-3-flash-preview"
  # "modelstudio/qwen3.5-plus"
  # "modelstudio/qwen3.6-flash"
  # "modelstudio/glm-5"
  # "modelstudio/glm-4.7"
  # "modelstudio/deepseek-v3.2"
  # "modelstudio/kimi-k2.5"
  # "modelstudio/qwen3-vl-8b-instruct"
  # "modelstudio/qwen2.5-vl-32b-instruct"
  # "modelstudio/qwen3-vl-32b-instruct"
  # "modelstudio/qwen3.5-35b-a3b"
  # "modelstudio/qwen3.5-27b"
  # "custom-dashscope-aliyuncs-com/qwen3.5-plus"
  # "custom-dashscope-aliyuncs-com/kimi-k2.5"
  # "custom-dashscope-aliyuncs-com/glm-5"
  # "custom-dashscope-aliyuncs-com/glm-4.7"
  # "openrouter/qwen/qwen3-vl-8b-instruct"
  # "openrouter/qwen/qwen2.5-vl-32b-instruct"
  # "openrouter/qwen/qwen3-vl-32b-instruct"
  # "openrouter/qwen/qwen3.5-35b-a3b"
  # "openrouter/qwen/qwen3.5-9b"
  # "openrouter/google/gemma-4-26b-a4b-it"
  # "openrouter/google/gemma-3-27b-it"
  # "volcengine/doubao-seed-2-0-pro-260215"
  # "volcengine/doubao-seed-2-0-mini-260215"
  # "xiaomi-coding/mimo-v2-pro"
  # "xiaomi-coding/mimo-v2-omni"
  # "modelstudio/qwen3.6-plus"
)

SUITE="task_agentvista_00, task_agentvista_01, task_agentvista_02, task_agentvista_03, task_agentvista_04, task_agentvista_05, task_agentvista_06, task_agentvista_07, task_agentvista_08, task_agentvista_09, task_mmsearch_00, task_mmsearch_01, task_mmsearch_02, task_mmsearch_03, task_mmsearch_04, task_mmsearch_05, task_mmsearch_06, task_mmsearch_07, task_mmsearch_08, task_mmsearch_09, task_mmsearchplus_00, task_mmsearchplus_01, task_mmsearchplus_02, task_mmsearchplus_03, task_mmsearchplus_04"

EXTRA=("${PASSTHROUGH_ARGS[@]}")
failed=0

echo "[$(date -Is)] 串行执行，共 ${#MODELS[@]} 个模型，目录: $LOGDIR (executor=$EXECUTOR)"

for m in "${MODELS[@]}"; do
  safe="${m//\//_}"
  log="${LOGDIR}/${safe}.log"
  run_cwd="${LOGDIR}/${safe}"
  mkdir -p "$run_cwd"
  echo "[$(date -Is)] -------- start: $m -> $log (cwd=$run_cwd) --------"
  (
    cd "$run_cwd"
    set +e
    uv run --directory "$ROOT" scripts/benchmark.py \
      --model "$m" \
      --executor "$EXECUTOR" \
      --output-dir "$run_cwd/results" \
      --session-backup-dir "$run_cwd/sessions" \
      --suite "$SUITE" \
      "${EXTRA[@]}" >"$log" 2>&1
    inner_ec=$?
    echo "[$(date -Is)] exit_code=$inner_ec" >>"$log"
    exit "$inner_ec"
  )
  ec=$?
  if [[ "$ec" -ne 0 ]]; then
    ((failed++)) || true
    echo "[$(date -Is)] 失败: $m (exit=$ec)，见 $log" >&2
  else
    echo "[$(date -Is)] 完成: $m"
  fi
done

echo "[$(date -Is)] 全部结束，日志目录: $LOGDIR"
if [[ "$failed" -gt 0 ]]; then
  echo "[$(date -Is)] 有 $failed 个模型非零退出，请查看对应 .log" >&2
  exit 1
fi
