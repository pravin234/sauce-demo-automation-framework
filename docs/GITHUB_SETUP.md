# Quick Start: CI/CD Setup & GitHub Deployment

## 📋 Prerequisites

- ✅ Git installed (`git --version`)
- ✅ GitHub account created
- ✅ Playwright tests passing locally
- ✅ Node.js 18+ or 20+

---

## 🚀 Step 1: Initialize Git Repository

```bash
cd c:\Users\ABC\sauce_Demo_AI

# Initialize git
git init

# Configure user
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Create .gitignore
cat > .gitignore << EOF
node_modules/
test-results/
playwright-report/
auth*.json
*.log
.env
.env.local
dist/
build/
coverage/
EOF

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Playwright test framework with CI/CD pipelines"
```

---

## 📱 Step 2: Create GitHub Repository

**Option A: GitHub Web UI**

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `sauce_Demo_AI`
3. Description: "Playwright test framework with CI/CD"
4. **DO NOT** initialize with README (we already have one)
5. Click "Create repository"

**Option B: GitHub CLI**

```bash
gh repo create sauce_Demo_AI --private --source=. --remote=origin --push
```

---

## 🔗 Step 3: Connect Local Repository to GitHub

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/sauce_Demo_AI.git

# Verify remote
git remote -v
# Should show:
# origin  https://github.com/YOUR_USERNAME/sauce_Demo_AI.git (fetch)
# origin  https://github.com/YOUR_USERNAME/sauce_Demo_AI.git (push)

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## ✅ Step 4: Verify Workflows on GitHub

1. Go to your GitHub repository
2. Click **Actions** tab
3. You should see 3 workflows:
   - ✅ `Playwright Tests`
   - ✅ `PR - Quick Validation`
   - ✅ `Parallel Cross-Browser Tests`

If workflows don't appear:

- GitHub Actions might be disabled
- Go to **Settings** → **Actions** → Enable

---

## 🧪 Step 5: Trigger Your First Workflow

The workflows automatically trigger:

**Option A: Push triggers automatically**

```bash
# Make a small change
echo "# Deployed" >> README.md

# Commit and push
git add README.md
git commit -m "Add deployment note"
git push
```

**Option B: Manual trigger (for parallel-browsers.yml)**

1. Go to **Actions** tab
2. Select `Parallel Cross-Browser Tests`
3. Click **Run workflow** button
4. Select **main** branch
5. Leave inputs default
6. Click **Run workflow**

---

## 📊 Step 6: Monitor Test Results

### In GitHub UI:

1. **Actions** tab → Click workflow run
2. See real-time progress
3. Click job for detailed logs
4. Download artifacts from **Artifacts** section

### Artifacts Available:

- `playwright-report-*` - Interactive HTML reports
- `json-results-*` - Raw test data
- `test-results-*` - Screenshots, traces

### View HTML Report:

1. Go to workflow run
2. Scroll to **Artifacts**
3. Download `playwright-report-*`
4. Extract and open `index.html`

---

## 👥 Step 7: Configure Branch Protection (Optional)

**Require Tests Before Merge:**

1. Repository **Settings** → **Branches**
2. Add rule for branch `main`
3. Enable:
   - ✅ "Require a pull request before merging"
   - ✅ "Require status checks to pass"
   - ✅ Select all test jobs
4. Save

Now PRs must pass all tests before merge!

---

## 💬 Step 8: Add Collaboration (Optional)

**Invite teammates:**

1. **Settings** → **Collaborators**
2. Click **Add people**
3. Search for GitHub username
4. Select permission level
5. Send invite

**Protect main branch:**

- Team members create feature branches
- Push PRs
- Tests run automatically
- Reviewers approve
- Merge to main

---

## 🔄 Step 9: Workflow for Development

### Creating a Feature:

```bash
# Create feature branch
git checkout -b feature/add-checkout-tests

# Make changes, run tests locally
npm run test:headed

# Commit changes
git add tests/
git commit -m "Add checkout workflow tests"

# Push to GitHub
git push origin feature/add-checkout-tests
```

### On GitHub:

1. PR automatically created (or create manually)
2. `pr-validation.yml` runs (fast check)
3. Results show in PR checks
4. Request review from teammates
5. Once approved, click "Squash and merge"

### Back to Local:

```bash
# Switch to main
git checkout main

# Pull latest
git pull origin main

# Delete feature branch
git branch -d feature/add-checkout-tests
```

---

## 🔑 Step 10: Add Secrets (If Needed)

For environment variables in tests:

1. Repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add secrets:
   - **Name:** `BASE_URL`
   - **Value:** `https://saucedemo.com`
4. Repeat for other secrets

### Reference in Workflow:

```yaml
env:
  BASE_URL: ${{ secrets.BASE_URL }}
  API_TOKEN: ${{ secrets.API_TOKEN }}
```

### Use in Tests:

```typescript
test("login", async ({ page }) => {
  await page.goto(process.env.BASE_URL);
});
```

---

## 📈 Monitoring & Maintenance

### Daily Checks:

- Review **Actions** tab for failures
- Check artifact reports weekly
- Keep branch up to date: `git pull origin main`

### Weekly Tasks:

- Review test coverage
- Update dependencies: `npm update`
- Cleanup old branches

### Monthly Tasks:

- Archive old artifacts
- Review workflows for optimization
- Update CI/CD documentation

---

## 🐛 Troubleshooting

### Workflow Not Running

**Problem:** Pushed code but workflow didn't start
**Solution:**

- Check `.github/workflows/*.yml` files exist
- Verify branch is `main` (or your configured branch)
- Trigger manually: **Actions** → workflow → **Run workflow**

### Tests Failing in CI

**Problem:** Tests pass locally but fail in GitHub Actions
**Solution:**

- Check runner OS (Linux vs Windows)
- Review logs in **Actions** tab
- Try `npm ci` instead of `npm install`
- Ensure all browsers installed

### Artifacts Not Downloading

**Problem:** Can't download test reports
**Solution:**

- Artifacts expire after 7 days (configurable)
- Check workflow completed successfully
- Browser might be blocking download
- Try different browser
- Download from GitHub UI

### Permission Denied on Push

**Problem:** `fatal: Permission denied (publickey)`
**Solution:**

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to GitHub
# Settings → SSH and GPG keys → New SSH key

# Switch remote to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/sauce_Demo_AI.git
```

---

## 📚 Next Steps

1. ✅ Tests running in CI
2. ✅ Reports generated
3. ⏭️ Set up Slack notifications (optional)
4. ⏭️ Add code coverage tracking (optional)
5. ⏭️ Setup deployment pipeline (optional)

---

## 🎓 Learning Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [Git Workflow Guide](https://guides.github.com/introduction/git-handbook/)
- [GitHub Skills Course](https://skills.github.com/)

---

**Status:** ✅ Ready to Deploy
**Last Updated:** April 2026
