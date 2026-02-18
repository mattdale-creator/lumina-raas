#!/bin/bash
# ╔══════════════════════════════════════════════════╗
# ║  RALPH SCENARIOS — Versatility Test Suite        ║
# ║  Tests 10 different client requests              ║
# ╚══════════════════════════════════════════════════╝
#
# Usage:
#   ./run-scenarios.sh                    # Run all 10 scenarios
#   ./run-scenarios.sh 3                  # Run only scenario 03
#   MAX_ITERATIONS=15 ./run-scenarios.sh  # Limit per scenario
#
# Each scenario runs on its own git branch so they don't interfere.
# After all scenarios, a versatility report is generated.

set -e

SCENARIOS_DIR="prompts/scenarios"
MAX_ITERATIONS="${MAX_ITERATIONS:-30}"
AI_CMD="${AI_CMD:-claude}"
REPORT_FILE="versatility-report.md"
MAIN_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")

# Colors
GREEN='\033[0;32m'
VIOLET='\033[0;35m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${VIOLET}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${VIOLET}║  🧪 RALPH SCENARIOS — Versatility Test Suite     ║${NC}"
echo -e "${VIOLET}║  Testing platform against 10 client requests     ║${NC}"
echo -e "${VIOLET}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# Initialize report
cat > "$REPORT_FILE" << 'EOF'
# Lumina RaaS — Versatility Test Report

| # | Scenario | Status | Iterations | PRD Coverage | Gaps Found |
|---|----------|--------|------------|-------------|------------|
EOF

# Get list of scenarios
if [ -n "$1" ]; then
  # Run single scenario by number
  SCENARIOS=$(ls "$SCENARIOS_DIR"/${1}*.md 2>/dev/null)
  if [ -z "$SCENARIOS" ]; then
    echo -e "${RED}❌ No scenario found matching: $1${NC}"
    exit 1
  fi
else
  SCENARIOS=$(ls "$SCENARIOS_DIR"/*.md 2>/dev/null | sort)
fi

TOTAL=$(echo "$SCENARIOS" | wc -l | tr -d ' ')
PASSED=0
FAILED=0
current=0

for scenario in $SCENARIOS; do
  current=$((current + 1))
  name=$(basename "$scenario" .md)
  branch="scenario/$name"
  
  echo ""
  echo -e "${VIOLET}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${VIOLET}  📋 Scenario $current/$TOTAL: $name${NC}"
  echo -e "${VIOLET}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  
  # Create fresh branch from main
  git stash 2>/dev/null || true
  git checkout "$MAIN_BRANCH" 2>/dev/null || true
  git branch -D "$branch" 2>/dev/null || true
  git checkout -b "$branch"
  
  # Reset progress file
  echo "Scenario: $name — started at $(date)" > progress.txt
  
  # Run the Ralph loop for this scenario
  iteration=0
  completed=false
  
  while [ $iteration -lt $MAX_ITERATIONS ]; do
    iteration=$((iteration + 1))
    echo -e "${YELLOW}  Iteration $iteration/$MAX_ITERATIONS${NC}"
    
    cat "$scenario" | $AI_CMD 2>&1 || true
    
    # Commit changes
    git add -A
    git commit -m "scenario($name): iteration $iteration" 2>/dev/null || true
    
    # Check completion
    if grep -qi "COMPLETE" progress.txt 2>/dev/null; then
      completed=true
      break
    fi
  done
  
  # Record result
  if $completed; then
    PASSED=$((PASSED + 1))
    echo -e "${GREEN}  ✅ PASSED in $iteration iterations${NC}"
    
    # Extract coverage info from progress.txt
    coverage=$(grep -i "coverage\|PRD" progress.txt | head -1 || echo "See progress.txt")
    gaps=$(grep -i "gap" progress.txt | head -1 || echo "None documented")
    
    echo "| $current | $name | ✅ PASSED | $iteration | $coverage | $gaps |" >> "$REPORT_FILE"
  else
    FAILED=$((FAILED + 1))
    echo -e "${RED}  ❌ FAILED (max iterations reached)${NC}"
    echo "| $current | $name | ❌ FAILED | $MAX_ITERATIONS | Incomplete | See branch |" >> "$REPORT_FILE"
  fi
  
  # Tag the result
  git tag "scenario-$name-result" 2>/dev/null || true
done

# Return to main
git checkout "$MAIN_BRANCH" 2>/dev/null || true

# Finalize report
cat >> "$REPORT_FILE" << EOF

---

## Summary
- **Total scenarios:** $TOTAL
- **Passed:** $PASSED
- **Failed:** $FAILED
- **Pass rate:** $(( PASSED * 100 / TOTAL ))%
- **Max iterations per scenario:** $MAX_ITERATIONS

## How to Review
Each scenario is on its own git branch:
\`\`\`bash
git branch -a | grep scenario/    # List all scenario branches
git diff main..scenario/01-solo-founder-saas   # See what changed
git log scenario/03-fintech-mvp --oneline      # See iteration history
\`\`\`

## Interpretation
- **>80% pass rate** = Platform is highly versatile
- **60-80%** = Good base, needs targeted improvements
- **<60%** = Significant gaps in platform capabilities

Generated: $(date)
EOF

echo ""
echo -e "${VIOLET}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${VIOLET}║  📊 VERSATILITY TEST COMPLETE                    ║${NC}"
echo -e "${VIOLET}╠══════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  ✅ Passed: $PASSED / $TOTAL                              ║${NC}"
if [ $FAILED -gt 0 ]; then
echo -e "${RED}║  ❌ Failed: $FAILED / $TOTAL                              ║${NC}"
fi
echo -e "${VIOLET}║  📄 Report: $REPORT_FILE              ║${NC}"
echo -e "${VIOLET}╚══════════════════════════════════════════════════╝${NC}"
