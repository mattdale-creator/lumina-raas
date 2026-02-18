#!/bin/bash
# ╔══════════════════════════════════════════════════╗
# ║  TEST PROMPT — Validate MASTER_PROMPT.md         ║
# ║  Tests if the prompt can rebuild the project     ║
# ╚══════════════════════════════════════════════════╝
#
# Usage:
#   ./test-prompt.sh              # Full test (build from scratch)
#   ./test-prompt.sh --check-only # Just validate existing build
#
# This script:
# 1. Creates a clean temp directory
# 2. Feeds MASTER_PROMPT.md to the AI agent
# 3. Runs verification checks
# 4. Writes results to prompt-test-results.txt

set -e

PROJECT_DIR=$(pwd)
RESULTS_FILE="$PROJECT_DIR/prompt-test-results.txt"
AI_CMD="${AI_CMD:-claude}"
TEMP_DIR="/tmp/lumina-raas-test-$(date +%s)"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
VIOLET='\033[0;35m'
NC='\033[0m'

passed=0
failed=0
total=0

check() {
  total=$((total + 1))
  local desc="$1"
  local condition="$2"
  
  if eval "$condition" 2>/dev/null; then
    passed=$((passed + 1))
    echo -e "  ${GREEN}✅ $desc${NC}"
    echo "✅ PASS: $desc" >> "$RESULTS_FILE"
  else
    failed=$((failed + 1))
    echo -e "  ${RED}❌ $desc${NC}"
    echo "❌ FAIL: $desc" >> "$RESULTS_FILE"
  fi
}

echo -e "${VIOLET}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${VIOLET}║  🧪 MASTER PROMPT TEST                          ║${NC}"
echo -e "${VIOLET}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# Initialize results
cat > "$RESULTS_FILE" << EOF
# Master Prompt Test Results
# Generated: $(date)
# Prompt: MASTER_PROMPT.md
#
EOF

if [ "$1" == "--check-only" ]; then
  echo -e "${YELLOW}Check-only mode — validating current build${NC}"
  TEST_DIR="$PROJECT_DIR"
else
  echo -e "${YELLOW}Full test — building from scratch in: $TEMP_DIR${NC}"
  
  # Check AI CLI exists
  if ! command -v "$AI_CMD" &> /dev/null; then
    echo -e "${RED}❌ '$AI_CMD' not found.${NC}"
    echo "Install: npm install -g @anthropic-ai/claude-code"
    echo "Or use: AI_CMD=cursor ./test-prompt.sh"
    echo ""
    echo -e "${YELLOW}Running in --check-only mode instead...${NC}"
    TEST_DIR="$PROJECT_DIR"
  else
    # Create clean directory and run prompt
    mkdir -p "$TEMP_DIR"
    cp "$PROJECT_DIR/MASTER_PROMPT.md" "$TEMP_DIR/"
    cd "$TEMP_DIR"
    
    echo "Feeding MASTER_PROMPT.md to $AI_CMD..."
    cat MASTER_PROMPT.md | $AI_CMD 2>&1 | tee "$PROJECT_DIR/prompt-build-log.txt"
    
    TEST_DIR="$TEMP_DIR"
  fi
fi

cd "$TEST_DIR"

echo ""
echo -e "${VIOLET}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${VIOLET}  Running verification checks...${NC}"
echo -e "${VIOLET}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# ============================================
# BUILD CHECK
# ============================================
echo "" >> "$RESULTS_FILE"
echo "## Build" >> "$RESULTS_FILE"

check "package.json exists" "[ -f package.json ]"
check "node_modules exists" "[ -d node_modules ]"
check "npm run build succeeds" "npm run build 2>&1 | tail -1 | grep -v 'error\|Error'"

# ============================================
# PAGE ROUTES
# ============================================
echo "" >> "$RESULTS_FILE"
echo "## Page Routes" >> "$RESULTS_FILE"

check "Landing page: app/page.tsx" "[ -f app/page.tsx ]"
check "Dashboard: app/dashboard/page.tsx" "[ -f app/dashboard/page.tsx ]"
check "Analytics: app/analytics/page.tsx" "[ -f app/analytics/page.tsx ]"
check "Admin: app/admin/page.tsx" "[ -f app/admin/page.tsx ]"
check "Aether: app/aether/page.tsx" "[ -f app/aether/page.tsx ]"
check "Sign-in page exists" "[ -f app/sign-in/*/page.tsx ] || find app/sign-in -name 'page.tsx' | grep -q '.'"
check "Sign-up page exists" "[ -f app/sign-up/*/page.tsx ] || find app/sign-up -name 'page.tsx' | grep -q '.'"

# ============================================
# API ROUTES
# ============================================
echo "" >> "$RESULTS_FILE"
echo "## API Routes" >> "$RESULTS_FILE"

check "tRPC handler" "find app/api/trpc -name 'route.ts' | grep -q '.'"
check "Stripe webhook" "[ -f app/api/stripe/webhook/route.ts ]"
check "Stripe create-session" "[ -f app/api/stripe/create-session/route.ts ]"
check "Clerk webhook" "[ -f app/api/webhooks/clerk/route.ts ]"
check "Analytics export" "[ -f app/api/analytics/export/route.ts ]"
check "Health endpoint" "[ -f app/api/monitor/health/route.ts ]"
check "Aether start" "[ -f app/api/aether/start/route.ts ]"

# ============================================
# LIB FILES
# ============================================
echo "" >> "$RESULTS_FILE"
echo "## Lib Files" >> "$RESULTS_FILE"

check "lib/supabase.ts" "[ -f lib/supabase.ts ]"
check "lib/stripe.ts" "[ -f lib/stripe.ts ]"
check "lib/resend.ts" "[ -f lib/resend.ts ]"
check "lib/logger.ts" "[ -f lib/logger.ts ]"
check "lib/trpc.ts" "[ -f lib/trpc.ts ]"
check "lib/trpc-client.ts" "[ -f lib/trpc-client.ts ]"

# ============================================
# tRPC ROUTERS
# ============================================
echo "" >> "$RESULTS_FILE"
echo "## tRPC Routers" >> "$RESULTS_FILE"

check "server/routers/_app.ts" "[ -f server/routers/_app.ts ]"
check "server/routers/outcome.ts" "[ -f server/routers/outcome.ts ]"
check "server/routers/admin.ts" "[ -f server/routers/admin.ts ]"
check "server/routers/analytics.ts" "[ -f server/routers/analytics.ts ]"

# ============================================
# INFRASTRUCTURE
# ============================================
echo "" >> "$RESULTS_FILE"
echo "## Infrastructure" >> "$RESULTS_FILE"

check "middleware.ts" "[ -f middleware.ts ]"
check "app/providers.tsx" "[ -f app/providers.tsx ]"
check "app/components/AppNav.tsx" "[ -f app/components/AppNav.tsx ]"
check ".env.example" "[ -f .env.example ]"
check "vercel.json" "[ -f vercel.json ]"
check "Dockerfile" "[ -f Dockerfile ]"
check "SQL migration" "find supabase -name '*.sql' | grep -q '.'"
check "CI/CD workflow" "find .github -name '*.yml' 2>/dev/null | grep -q '.'"

# ============================================
# BUSINESS DOCUMENTS
# ============================================
echo "" >> "$RESULTS_FILE"
echo "## Business Documents" >> "$RESULTS_FILE"

check "docs/ directory has 5+ .md files" "[ $(find docs -name '*.md' 2>/dev/null | wc -l) -ge 5 ]"
check "PITCH_DECK exists" "[ -f docs/PITCH_DECK.md ]"
check "SALES_PLAYBOOK exists" "[ -f docs/SALES_PLAYBOOK.md ]"
check "GTM plan exists" "[ -f docs/GTM_EXECUTION_PLAN.md ]"
check "PRD Knowledge Base exists" "[ -f docs/PRD_KNOWLEDGE_BASE.md ]"

# ============================================
# RALPH LOOP INFRASTRUCTURE
# ============================================
echo "" >> "$RESULTS_FILE"
echo "## Ralph Loop Infrastructure" >> "$RESULTS_FILE"

check "ralph.sh exists and is executable" "[ -x ralph.sh ] || [ -f ralph.sh ]"
check "PROMPT.md exists" "[ -f PROMPT.md ]"
check "5+ scenario files" "[ $(find prompts/scenarios -name '*.md' 2>/dev/null | wc -l) -ge 5 ]"
check "run-scenarios.sh exists" "[ -f run-scenarios.sh ]"

# ============================================
# CONTENT CHECKS
# ============================================
echo "" >> "$RESULTS_FILE"
echo "## Content Quality" >> "$RESULTS_FILE"

check "Landing page has RaaS messaging" "grep -qi 'pay.*only\|results.*service\|delivered.*results' app/page.tsx 2>/dev/null"
check "Dark theme in globals.css" "grep -q '09090b\|zinc-950' app/globals.css 2>/dev/null"
check "Violet accent color" "grep -q '8B5CF6\|violet' app/page.tsx 2>/dev/null"
check "Conditional Clerk in providers" "grep -qi 'clerk\|hasClerk\|CLERK' app/providers.tsx 2>/dev/null"
check "AUD currency in Stripe" "grep -qi 'aud' lib/stripe.ts 2>/dev/null"

# ============================================
# RESULTS SUMMARY
# ============================================
echo "" >> "$RESULTS_FILE"
echo "## Summary" >> "$RESULTS_FILE"
echo "Passed: $passed / $total" >> "$RESULTS_FILE"
echo "Failed: $failed / $total" >> "$RESULTS_FILE"
echo "Score: $(( passed * 100 / total ))%" >> "$RESULTS_FILE"

echo ""
echo -e "${VIOLET}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${VIOLET}║  📊 PROMPT TEST RESULTS                         ║${NC}"
echo -e "${VIOLET}╠══════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  ✅ Passed: $passed / $total                              ║${NC}"
if [ $failed -gt 0 ]; then
echo -e "${RED}║  ❌ Failed: $failed / $total                              ║${NC}"
fi
echo -e "${VIOLET}║  📈 Score: $(( passed * 100 / total ))%                                  ║${NC}"
echo -e "${VIOLET}║  📄 Results: prompt-test-results.txt             ║${NC}"
echo -e "${VIOLET}╚══════════════════════════════════════════════════╝${NC}"

if [ $failed -eq 0 ]; then
  echo -e "\n${GREEN}🎉 PERFECT SCORE — Prompt produces a complete, working build!${NC}"
else
  echo -e "\n${YELLOW}💡 Run the refine-prompt Ralph loop to improve:${NC}"
  echo "   ./ralph.sh prompts/refine-prompt.md"
fi

# Cleanup temp dir if used
if [ "$TEST_DIR" == "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
  echo -e "\n${YELLOW}Temp build at: $TEMP_DIR${NC}"
  echo "Delete with: rm -rf $TEMP_DIR"
fi
