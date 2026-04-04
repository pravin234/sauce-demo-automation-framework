#!/bin/bash

# CI/CD Local Testing Script
# Run this before pushing to verify everything works locally
# Usage: bash scripts/pre-commit.sh

set -e

echo "🧪 Running Pre-Commit Validation..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Node version
echo "📦 Checking Node version..."
NODE_VERSION=$(node -v)
echo "  Node: $NODE_VERSION"
if [[ ! $NODE_VERSION =~ "v18" ]] && [[ ! $NODE_VERSION =~ "v20" ]]; then
  echo -e "${YELLOW}⚠️  Node version might not match CI (18.x or 20.x)${NC}"
fi

# Install dependencies
echo ""
echo "📚 Installing dependencies..."
npm ci --silent

# TypeScript check
echo ""
echo "🔍 TypeScript compilation check..."
if npx tsc --noEmit; then
  echo -e "${GREEN}✅ TypeScript OK${NC}"
else
  echo -e "${RED}❌ TypeScript errors found${NC}"
  exit 1
fi

# Playwright browsers
echo ""
echo "🎮 Installing Playwright browsers..."
npx playwright install --with-deps chromium > /dev/null 2>&1

# Run tests
echo ""
echo "🚀 Running tests (Chromium only for speed)..."
echo "  Tests: tests/specs/sauceDemo.spec.ts"
echo "  Tests: tests/specs/storageStateDemo.spec.ts"
echo ""

if npx playwright test --project=chromium; then
  echo ""
  echo -e "${GREEN}✅ All tests passed!${NC}"
  echo ""
  echo "✨ Ready to push!"
  echo ""
else
  echo ""
  echo -e "${RED}❌ Tests failed. Fix issues before pushing.${NC}"
  exit 1
fi

# Show report summary
echo ""
echo "📊 Test Summary:"
if [ -f "test-results/results.json" ]; then
  TOTAL=$(jq '.stats.expected' test-results/results.json)
  PASSED=$(jq '.stats.expected' test-results/results.json)
  echo "  Total: $TOTAL"
  echo "  Passed: $PASSED"
fi

echo ""
echo "Next steps:"
echo "  1. git add ."
echo "  2. git commit -m 'Your message'"
echo "  3. git push"
echo ""
