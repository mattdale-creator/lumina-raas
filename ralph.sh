#!/bin/bash
# ╔══════════════════════════════════════════════╗
# ║  RALPH LOOP — Lumina RaaS Self-Improving     ║
# ║  Persistent iteration until success criteria  ║
# ╚══════════════════════════════════════════════╝
#
# Usage:
#   ./ralph.sh                    # Uses default PROMPT.md
#   ./ralph.sh prompts/polish.md  # Uses a specific prompt file
#   MAX_ITERATIONS=20 ./ralph.sh  # Limit iterations
#
# Prerequisites:
#   - Claude Code CLI: npm install -g @anthropic-ai/claude-code
#   - Or Cursor CLI, or any AI coding agent that accepts piped prompts
#
# The loop:
#   1. Reads PROMPT.md (task + success criteria)
#   2. Feeds it to the AI agent
#   3. Agent makes changes and commits
#   4. Loop checks for COMPLETE in progress.txt
#   5. Repeats until done or max iterations reached

set -e

# Config
PROMPT_FILE="${1:-PROMPT.md}"
PROGRESS_FILE="progress.txt"
MAX_ITERATIONS="${MAX_ITERATIONS:-50}"
SLEEP_BETWEEN="${SLEEP_BETWEEN:-3}"
AI_CMD="${AI_CMD:-claude}"  # Change to 'cursor' or other agent CLI

# Colors
GREEN='\033[0;32m'
VIOLET='\033[0;35m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${VIOLET}╔══════════════════════════════════════╗${NC}"
echo -e "${VIOLET}║  🔄 RALPH LOOP — Lumina RaaS         ║${NC}"
echo -e "${VIOLET}╚══════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
if ! command -v "$AI_CMD" &> /dev/null; then
  echo -e "${RED}❌ '$AI_CMD' not found. Install with:${NC}"
  echo "   npm install -g @anthropic-ai/claude-code"
  echo ""
  echo "Or set AI_CMD to your agent:"
  echo "   AI_CMD=cursor ./ralph.sh"
  exit 1
fi

if [ ! -f "$PROMPT_FILE" ]; then
  echo -e "${RED}❌ Prompt file not found: $PROMPT_FILE${NC}"
  echo "Create PROMPT.md or specify a prompt file:"
  echo "   ./ralph.sh prompts/polish.md"
  exit 1
fi

# Initialize progress file
if [ ! -f "$PROGRESS_FILE" ]; then
  echo "Ralph loop started at $(date)" > "$PROGRESS_FILE"
fi

# Ensure git is initialized
if [ ! -d .git ]; then
  git init
  git add -A
  git commit -m "ralph: initial state before loop"
fi

echo -e "${GREEN}📄 Prompt:${NC} $PROMPT_FILE"
echo -e "${GREEN}🎯 Max iterations:${NC} $MAX_ITERATIONS"
echo -e "${GREEN}🤖 AI command:${NC} $AI_CMD"
echo ""

iteration=0

while [ $iteration -lt $MAX_ITERATIONS ]; do
  iteration=$((iteration + 1))
  
  echo -e "${VIOLET}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${VIOLET}🔄 Iteration $iteration / $MAX_ITERATIONS — $(date +%H:%M:%S)${NC}"
  echo -e "${VIOLET}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  
  # Feed the prompt to the AI agent
  cat "$PROMPT_FILE" | $AI_CMD
  
  # Auto-commit any changes
  if git diff --quiet && git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  No changes detected this iteration${NC}"
  else
    git add -A
    git commit -m "ralph: iteration $iteration at $(date +%Y-%m-%d_%H:%M:%S)" 2>/dev/null || true
    echo -e "${GREEN}✅ Changes committed${NC}"
  fi
  
  # Check for completion
  if grep -qi "COMPLETE" "$PROGRESS_FILE" 2>/dev/null; then
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  🎉 RALPH LOOP COMPLETE!             ║${NC}"
    echo -e "${GREEN}║  Iterations: $iteration                       ${NC}"
    echo -e "${GREEN}║  $(date)            ${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"
    echo ""
    echo "Progress log:"
    cat "$PROGRESS_FILE"
    exit 0
  fi
  
  echo -e "${YELLOW}⏳ Sleeping ${SLEEP_BETWEEN}s before next iteration...${NC}"
  sleep "$SLEEP_BETWEEN"
done

echo -e "${RED}⚠️  Max iterations ($MAX_ITERATIONS) reached without completion${NC}"
echo "Check progress.txt for status:"
cat "$PROGRESS_FILE"
exit 1
