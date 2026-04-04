# n8n Integration Setup Guide

# Repository: https://github.com/pravin234/sauce-demo-automation-framework

## 📋 Complete Setup Checklist

### Phase 1: Account & Webhook Setup

- [ ] Create n8n account at https://n8n.cloud
- [ ] Create new workflow in n8n
- [ ] Add Webhook node (POST method, path: github-test-webhook)
- [ ] Copy the webhook URL (looks like: https://xxxxx.n8n.cloud/webhook/github-test-webhook)

### Phase 2: GitHub Secret

- [ ] Go to: https://github.com/pravin234/sauce-demo-automation-framework/settings/secrets/actions
- [ ] Click "New repository secret"
- [ ] Name: N8N_WEBHOOK_URL
- [ ] Value: [paste your n8n webhook URL]
- [ ] Click "Add secret"

### Phase 3: n8n Workflow

- [ ] Import the workflow from: n8n-slack-workflow.json
- [ ] Connect Slack credentials (get bot token from Slack)
- [ ] Update channel name (#tests or your preferred channel)
- [ ] Activate the workflow

### Phase 4: Test Integration

- [ ] Run: .\test-n8n-webhook.ps1
- [ ] Check n8n workflow executions
- [ ] Verify Slack notification (if configured)

## 🚀 Quick Commands

### Add GitHub Secret (after getting n8n webhook URL)

```powershell
& "C:\Program Files\GitHub CLI\gh.exe" secret set N8N_WEBHOOK_URL --body "YOUR_N8N_WEBHOOK_URL_HERE"
```

### Test Webhook

```powershell
.\test-n8n-webhook.ps1
```

### Trigger GitHub Actions (to test full flow)

```powershell
git add .
git commit -m "Test n8n integration"
git push origin main
```

## 📊 Data Flow

```
GitHub Actions (.github/workflows/n8n-integration.yml)
    ↓
Runs tests → Parses results → Sends webhook
    ↓
n8n Webhook receives JSON payload
    ↓
IF condition checks: status == "failure"
    ↓
Slack sends notification to #tests channel
```

## 🔧 Troubleshooting

### Webhook not received?

```bash
# Test manually
curl -X POST "YOUR_N8N_WEBHOOK_URL" -H "Content-Type: application/json" -d '{"test": "data"}'
```

### Slack not working?

1. Check Slack bot token is correct
2. Verify bot is added to the channel
3. Check n8n credentials are connected

### GitHub Actions not triggering?

1. Check N8N_WEBHOOK_URL secret exists
2. Verify workflow file: .github/workflows/n8n-integration.yml
3. Check Actions tab for errors

## 📁 Files Created

- `test-n8n-webhook.ps1` - Test webhook connectivity
- `n8n-slack-workflow.json` - Ready-to-import Slack workflow
- `.github/workflows/n8n-integration.yml` - GitHub Actions integration

## 🎯 Success Indicators

- [ ] n8n webhook URL created
- [ ] GitHub secret added
- [ ] n8n workflow active
- [ ] Test webhook works
- [ ] Slack notification received (optional)
- [ ] GitHub Actions trigger n8n automatically

## 📚 Documentation

- `docs/N8N_INTEGRATION.md` - Complete 553-line guide
- `docs/N8N_QUICK_START.md` - 10-minute setup
- `docs/N8N_WORKFLOWS.md` - Additional templates

---

**Ready to start?** Create your n8n account first, then follow the checklist! 🚀
