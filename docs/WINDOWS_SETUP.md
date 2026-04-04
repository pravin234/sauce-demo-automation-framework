# CI/CD Setup for Windows (PowerShell)

This guide shows Windows-specific commands for setting up CI/CD with GitHub.

---

## 🖥️ Windows Prerequisites

### Check What You Have

```powershell
# Check Git version
git --version
# Should show: git version 2.x.x

# Check Node version
node --version
# Should show: v18.x.x or v20.x.x

# Check npm version
npm --version
# Should show: 9.x.x or higher
```

### Install Missing Tools

**Git for Windows:**

```powershell
# Using Chocolatey
choco install git -y

# Or download from: https://git-scm.com/download/win
```

**Node.js:**

```powershell
# Using Chocolatey
choco install nodejs -y

# Or download from: https://nodejs.org
```

**GitHub CLI (optional but recommended):**

```powershell
choco install gh -y
```

---

## 🚀 Step-by-Step Setup (Windows)

### Step 1: Initialize Git Repository

```powershell
# Navigate to project
cd C:\Users\ABC\sauce_Demo_AI

# Initialize repository
git init

# Configure Git (one-time setup)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list | Select-String user.
```

### Step 2: Create .gitignore File

```powershell
# Create .gitignore
@"
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
"@ | Out-File -FilePath .gitignore -Encoding UTF8

# Verify
Get-Content .gitignore
```

### Step 3: Commit Initial Files

```powershell
# Check what will be added
git status

# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Playwright framework with CI/CD"

# Verify
git log --oneline -1
```

---

## 🔗 Connect to GitHub (Windows)

### Option A: HTTPS (Easiest for Beginners)

```powershell
# Go to GitHub.com, create repository "sauce_Demo_AI"

# Add remote URL
git remote add origin https://github.com/YOUR_USERNAME/sauce_Demo_AI.git

# Verify
git remote -v

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main

# Git may prompt for GitHub credentials
# Enter your GitHub username and password (or token)
```

### Option B: SSH (More Secure)

```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# When prompted, press Enter to accept defaults
# If asked for passphrase, leave blank and press Enter

# Start SSH agent
Start-Service ssh-agent

# Add key to agent
ssh-add $env:USERPROFILE\.ssh\id_ed25519

# Display public key (copy this)
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub

# Go to GitHub:
# Settings → SSH and GPG keys → New SSH key
# Paste the public key
# Click "Add SSH key"

# Add remote using SSH
git remote add origin git@github.com:YOUR_USERNAME/sauce_Demo_AI.git

# Test connection
ssh -T git@github.com

# Push to GitHub
git push -u origin main
```

---

## ✅ Verify on GitHub

```powershell
# Open GitHub page
Start-Process "https://github.com/YOUR_USERNAME/sauce_Demo_AI"

# Check that all files are there
# Check that .github/workflows/*.yml files exist
```

---

## 📱 Daily Workflow (Windows)

### Create a Feature Branch

```powershell
# Make sure you're on main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/add-new-tests

# List branches (should show * next to current)
git branch -a
```

### Make Changes & Test Locally

```powershell
# Run pre-commit validation
bash scripts/pre-commit.sh

# Or manually run tests
npm test

# View test report
Start-Process "playwright-report/index.html"
```

### Push & Create PR

```powershell
# Check status
git status

# Stage changes
git add tests/

# Commit
git commit -m "Add new test for checkout flow"

# Push
git push origin feature/add-new-tests

# Output will show a URL to create PR
# Click the URL or go to GitHub and create PR manually
```

### After Approval

```powershell
# Switch to main
git checkout main

# Pull latest
git pull origin main

# Delete feature branch locally
git branch -d feature/add-new-tests

# Delete on GitHub
git push origin --delete feature/add-new-tests
```

---

## 🧪 Local Testing Commands (Windows)

```powershell
# Run all tests
npm test

# Run tests with UI
npm run test:headed

# Run specific browser
npx playwright test --project=chromium

# Run specific test file
npx playwright test tests/specs/sauceDemo.spec.ts

# Show test report
npx playwright show-report

# Debug mode (opens inspector)
npx playwright test --debug

# View trace from failed test
npx playwright show-trace test-results/<trace-zip-file>
```

---

## 🔑 GitHub Credentials (Windows)

### Store Credentials Securely

**Option 1: Credential Manager (Recommended)**

```powershell
# Windows Credential Manager handles this automatically
# First push will prompt for credentials
# After entering, credentials are saved

# To clear credentials:
cmdkey /delete:git:https://github.com
```

**Option 2: GitHub Token**

```powershell
# Create personal access token on GitHub:
# Settings → Developer settings → Personal access tokens → Generate new token
# Scopes: repo, read:user

# When prompted for password, paste the token instead
# (username is your GitHub username)
```

**Option 3: Git Credential Helper**

```powershell
# Configure to use credential manager
git config --global credential.helper wincred

# Or use credential store
git config --global credential.helper store
```

---

## 🐛 Troubleshooting (Windows)

### "fatal: Permission denied (publickey)"

```powershell
# You're using SSH but haven't set up keys yet
# Switch to HTTPS temporarily:
git remote set-url origin https://github.com/YOUR_USERNAME/sauce_Demo_AI.git

# Or setup SSH properly (see SSH section above)
```

### "bash: scripts/pre-commit.sh: No such file or directory"

```powershell
# Make sure you're in project root
Get-Location
# Should be: C:\Users\ABC\sauce_Demo_AI

# Check if script exists
Test-Path scripts/pre-commit.sh

# If not exists, run tests directly
npm test
```

### "npm ERR! 404 Not Found"

```powershell
# Clean install npm packages
npm cache clean --force
npm ci

# If still failing, delete node_modules
Remove-Item -Recurse -Force node_modules
npm ci
```

### Tests Pass Locally but Fail in GitHub

```powershell
# Try running exactly like CI:
# Single worker, no headed mode
npx playwright test --workers=1

# Or use GitHub's test commands:
npm test  # Headless, like CI
```

---

## 📊 Monitoring Workflows (Windows)

### Via Browser

```powershell
# Open GitHub Actions
Start-Process "https://github.com/YOUR_USERNAME/sauce_Demo_AI/actions"

# View specific workflow
Start-Process "https://github.com/YOUR_USERNAME/sauce_Demo_AI/actions/workflows/playwright-tests.yml"
```

### Via GitHub CLI (if installed)

```powershell
# List recent workflow runs
gh run list

# View specific run
gh run view <RUN_ID>

# Download artifacts from run
gh run download <RUN_ID> -D reports

# Watch workflow run in real-time
gh run watch <RUN_ID>
```

---

## 🔐 Security Best Practices (Windows)

```powershell
# Never commit sensitive data
# Add to .gitignore:
# - .env files
# - credentials
# - auth tokens
# - API keys

# Use GitHub Secrets instead:
# Settings → Secrets and variables → Actions → New repository secret

# Check what you're committing before pushing:
git status
git diff

# Use signed commits (optional but recommended)
git config --global commit.gpgsign true
```

---

## 📝 PowerShell Tips & Tricks

### Useful Aliases

```powershell
# Add these to your PowerShell profile for convenience
function gs { git status }
function ga { git add . }
function gc { git commit -m $args }
function gp { git push }
function gl { git log --oneline -5 }

# Save to profile:
# Notepad $profile
# Add functions above
# Save and restart PowerShell
```

### Pretty Git Log

```powershell
# View commit history with graph
git log --all --oneline --graph

# Or shorter alias
function git-graph { git log --all --oneline --graph }
```

### List All Remotes

```powershell
git remote -v
```

---

## 🚀 Quick Commands Reference (Windows)

```powershell
# Initialize & First Push
git init
git config user.name "Name" && git config user.email "email@example.com"
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USER/REPO.git
git branch -M main
git push -u origin main

# Daily Development
git checkout -b feature/my-feature
# ... make changes ...
git add .
git commit -m "Add feature"
git push origin feature/my-feature

# Update from main
git checkout main
git pull origin main

# Clean up
git branch -d feature/my-feature
git push origin --delete feature/my-feature

# Running Tests
npm test
npm run test:headed
npx playwright test --project=chromium

# Pre-push validation (Windows doesn't have bash by default)
# Use Git Bash instead: right-click → Git Bash Here
# Then: bash scripts/pre-commit.sh
```

---

## 🎯 Windows-Specific Troubleshooting

### PowerShell Execution Policy Error

```powershell
# If you can't run scripts:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# To see current policy:
Get-ExecutionPolicy
```

### Line Ending Issues (CRLF vs LF)

```powershell
# Tell Git to not convert line endings
git config --global core.autocrlf false

# Or use true to auto-convert (usually fine)
git config --global core.autocrlf true
```

### Special Characters in Branch Names

```powershell
# Avoid special characters in Windows terminals
git checkout -b 'feature/my-feature'  # Use quotes

# Or just use hyphens-underscores-numbers
git checkout -b feature_my_feature
```

---

## ✅ Success Checklist (Windows)

- [ ] Git installed and configured
- [ ] Node.js 18+ or 20+ installed
- [ ] Repository cloned/initialized
- [ ] Credentials stored securely
- [ ] `.github/workflows/` files present
- [ ] Pushed to GitHub successfully
- [ ] Workflows visible in GitHub Actions tab
- [ ] First test run completed
- [ ] Reports generated and downloadable
- [ ] Team members can access repo

---

## 📚 Resources for Windows Users

- [Git for Windows](https://git-scm.com/download/win)
- [PowerShell Documentation](https://learn.microsoft.com/en-us/powershell/)
- [GitHub CLI Guide](https://cli.github.com/)
- [Playwright on CI](https://playwright.dev/docs/ci)

---

**Version:** 1.0 | **Platform:** Windows 10/11 | **Updated:** April 2026 | **Status:** ✅ Ready
