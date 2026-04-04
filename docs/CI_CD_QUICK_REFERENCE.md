# CI/CD Quick Reference

## 📁 Files Created

```
.github/workflows/
├── playwright-tests.yml          # Main pipeline (6x matrix)
├── pr-validation.yml             # Fast PR checks
└── parallel-browsers.yml         # Full cross-browser testing

docs/
├── CI_CD_GUIDE.md               # Comprehensive documentation
├── GITHUB_SETUP.md              # Step-by-step setup guide
└── CI_CD_QUICK_REFERENCE.md     # This file

scripts/
└── pre-commit.sh                # Local pre-commit validation
```

---

## 🎯 Quick Commands

### Local Development

```bash
# Run all tests locally (like CI)
npm test

# Run with UI (headed)
npm run test:headed

# Run specific browser
npx playwright test --project=chromium

# Run specific test file
npx playwright test tests/specs/sauceDemo.spec.ts

# Pre-commit validation (BEFORE git push)
bash scripts/pre-commit.sh
```

### Git & GitHub

```bash
# Setup (first time only)
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
git remote add origin https://github.com/YOUR_USER/sauce_Demo_AI.git

# Feature branch workflow
git checkout -b feature/my-feature
# ... make changes ...
git add .
git commit -m "Describe changes"
git push origin feature/my-feature
# Create PR on GitHub

# Update main branch
git checkout main
git pull origin main

# Delete old feature branch
git branch -d feature/my-feature
```

### GitHub Actions

```bash
# View workflow status
# Go to: https://github.com/YOUR_USER/sauce_Demo_AI/actions

# Manual workflow trigger (CLI)
gh workflow run parallel-browsers.yml --ref main

# View workflow results
gh run view <RUN_ID>

# Download artifacts
gh run download <RUN_ID> -D ./reports
```

---

## ⚡ Workflow Quick Start

### For Pull Requests

```mermaid
Developer Push
    ↓
pr-validation.yml runs (5 min)
├─ TypeScript ✅
└─ Tests (Chromium only)
    ↓
Results comment on PR
├─ PASS → Can review & merge
└─ FAIL → Fix and push again
```

### For Main Branch Merge

```mermaid
Merge to main
    ↓
playwright-tests.yml runs (45 min)
├─ Node 18 × 3 browsers
└─ Node 20 × 3 browsers
    ↓
Reports generated
├─ HTML interactive reports
├─ JSON test results
└─ Artifacts retained 7 days
```

### For Releases

```mermaid
Manual Trigger / Release Branch
    ↓
parallel-browsers.yml runs (30 min)
├─ Chromium tests
├─ Firefox tests
└─ WebKit tests
    ↓
Comprehensive reports
└─ Artifacts retained 30 days
```

---

## 📊 Test Matrix Details

| Node | Chromium  | Firefox   | WebKit    | Status               |
| ---- | --------- | --------- | --------- | -------------------- |
| 18.x | ✅ auto   | ✅ auto   | ✅ auto   | In Main Pipeline     |
| 20.x | ✅ auto   | ✅ auto   | ✅ auto   | In Main Pipeline     |
| Any  | ✅ manual | ✅ manual | ✅ manual | Parallel Browsers WF |

---

## 🔧 Configuration Reference

### playwright.config.ts

```typescript
// CI auto-settings
workers: process.env.CI ? 1 : 4,        // Serial in CI, parallel locally
retries: process.env.CI ? 2 : 0,        // Retry flaky tests in CI
timeout: 30 * 1000,                     // 30s per test
expect: { timeout: 5 * 1000 },          // 5s per expect
```

### Workflow Triggers

```yaml
# Run on every commit to these branches
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

# Run daily at 2 AM UTC
schedule:
  - cron: "0 2 * * *"

# Manual trigger
workflow_dispatch:
```

---

## 🐛 Common Issues & Fixes

| Issue                 | Cause                 | Fix                              |
| --------------------- | --------------------- | -------------------------------- |
| Workflows not showing | Actions disabled      | Enable in Settings → Actions     |
| Tests fail in CI only | OS differences        | Check for platform-specific code |
| Firefox not found     | Browser not installed | `npx playwright install firefox` |
| Timeout errors        | Tests too slow        | Increase `timeout-minutes`       |
| Permission denied     | SSH setup             | Add SSH key to GitHub            |
| Artifacts expired     | Old runs cleaned      | Increase `retention-days`        |

---

## 💰 Estimated Costs

**GitHub Actions Free Tier:**

- 2,000 minutes/month per user
- 500 MB storage for artifacts

**Estimated Usage (Monthly):**

```
3 workflows × 4 runs × 15 min avg = 180 minutes
Storage: Reports ~500 KB each × 12 = 6 MB
= WELL WITHIN FREE TIER ✅
```

---

## 📱 Recommended Workflow

### Day-to-Day

```
1. Create feature branch
2. Make changes
3. Run: bash scripts/pre-commit.sh (local validation)
4. If ✅: git push
5. Create PR on GitHub
6. pr-validation.yml runs automatically (5 min)
7. If ✅: Request review
8. After approval: Merge PR
```

### Before Release

```
1. Ensure all PRs merged to main
2. Create release branch: git checkout -b release/v1.0.0
3. Manual trigger: parallel-browsers.yml
4. All 3 browsers tested
5. Review reports
6. If ✅: Tag and deploy
```

---

## 🎯 Success Criteria

✅ Workflows visible in Actions tab
✅ PR creates automatic validation check
✅ Tests pass in CI (all combinations)
✅ Reports downloadable from artifacts
✅ Comments appear on PRs
✅ Branch protection enforced (main)
✅ Team can collaboratively develop

---

## 📞 Support

### Debugging Steps

1. Check GitHub Actions logs: **Actions** tab → Click workflow
2. Review error message in job logs
3. Search [GitHub Actions issues](https://github.com/issues)
4. Check [Playwright CI docs](https://playwright.dev/docs/ci)

### Common Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Playwright Documentation](https://playwright.dev)
- [Git & GitHub Guide](https://guides.github.com)

---

## 🚀 Next Level Enhancements

Once basic CI/CD is working, consider:

- ✨ Add Slack notifications on failures
- ✨ Setup code coverage reporting
- ✨ Add visual regression testing
- ✨ Integration with bug tracking (Jira)
- ✨ Automated deployment on green builds
- ✨ Performance benchmarking
- ✨ Security scanning

---

**Quick Links:**

- [Full CI/CD Guide](./CI_CD_GUIDE.md)
- [GitHub Setup Instructions](./GITHUB_SETUP.md)
- [Playwright Docs](https://playwright.dev)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

**Version:** 1.0 | **Updated:** April 2026 | **Status:** ✅ Production Ready
