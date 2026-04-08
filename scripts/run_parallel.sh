#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

mkdir -p logs
TS="$(date +%Y%m%d_%H%M%S)"
EXECUTOR="${PINCHBENCH_EXECUTOR:-openclaw}"

# Parse --executor from CLI so it can override env/default.
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

LOGDIR="${ROOT}/logs/${EXECUTOR}_parallel_${TS}"
mkdir -p "$LOGDIR"

MODELS=(
  "custom-api-shubiaobiao-cn/gpt-5.4"
  "custom-api-shubiaobiao-cn/gpt-5.2"
  "custom-api-shubiaobiao-cn/deepseek-v3.2"
  "custom-api-shubiaobiao-cn/gpt-5-mini"
  # "openrouter/openai/gpt-5.4"
  # "openrouter/anthropic/claude-sonnet-4.6"/
  # "openrouter/google/gemini-3-flash-preview"
  # "openrouter/google/gemini-3.1-pro-preview"
  # "openrouter/openai/gpt-5.2"
  # "openrouter/xiaomi/mimo-v2-pro"
  # "openrouter/xiaomi/mimo-v2-omni"
  "custom-dashscope-aliyuncs-com/qwen3.6-plus"
  "custom-dashscope-aliyuncs-com/qwen3.5-plus"
  "custom-dashscope-aliyuncs-com/kimi-k2.5"
  "custom-dashscope-aliyuncs-com/glm-5"
  "custom-dashscope-aliyuncs-com/glm-4.7"
  "custom-api-shubiaobiao-cn/doubao-seed-2-0-pro-260215"
)

EXTRA=("${PASSTHROUGH_ARGS[@]}")
failed=0

# 并行启动所有模型
pids=()
for m in "${MODELS[@]}"; do
  safe="${m//\//_}"
  log="${LOGDIR}/${safe}.log"
  run_cwd="${LOGDIR}/${safe}"
  mkdir -p "$run_cwd"
  echo "[$(date -Is)] start: $m -> $log (cwd=$run_cwd, executor=$EXECUTOR)"
  (
    cd "$run_cwd"
    set +e
    uv run --directory "$ROOT" scripts/benchmark.py \
      --model "$m" \
      --executor "$EXECUTOR" \
      --output-dir "$run_cwd/results" \
      --session-backup-dir "$run_cwd/sessions" \
      "${EXTRA[@]}" >"$log" 2>&1
    ec=$?
    echo "[$(date -Is)] exit_code=$ec" >>"$log"
    if [[ "$ec" -ne 0 ]]; then
      echo "[$(date -Is)] 失败: $m (exit=$ec)，见 $log" >&2
    else
      echo "[$(date -Is)] 完成: $m"
    fi
    exit "$ec"
  ) &
  pids+=($!)
done

echo "[$(date -Is)] 已启动 ${#MODELS[@]} 个模型，等待完成..."

# 等待所有后台进程，并统计失败
failed=0
for i in "${!pids[@]}"; do
  pid=${pids[$i]}
  model=${MODELS[$i]}
  if ! wait "$pid"; then
    ((failed++)) || true
    echo "[$(date -Is)] 模型失败: $model (pid=$pid)" >&2
  fi
done

echo "[$(date -Is)] 全部结束，日志目录: $LOGDIR"
if [[ "$failed" -gt 0 ]]; then
  echo "[$(date -Is)] 有 $failed 个模型非零退出，请查看对应 .log" >&2
  exit 1
fi
