# n8n Integration with GitHub Actions

Complete guide for integrating n8n automation platform with GitHub Actions CI/CD pipeline.

---

## 🤖 What is n8n?

**n8n** is an open-source workflow automation platform that lets you:

- 🔗 Connect multiple services and APIs
- 🔄 Automate complex workflows
- 📊 Process data between systems
- 📢 Send notifications (Slack, Email, Teams, etc.)
- 📈 Create custom automations

**vs Similar Tools:**

- n8n: Self-hosted, open-source (privacy-focused)
- Zapier: Cloud SaaS (easiest for non-technical users)
- Make.com: Cloud SaaS (more affordable)
- IFTTT: Simpler, fewer integrations

---

## 🚀 Setup Guide (10 minutes)

### Step 1: Create n8n Account

**Option A: Cloud (Easiest)**

1. Go to [n8n.cloud](https://n8n.cloud)
2. Sign up with email
3. Verify email
4. Create workspace

**Option B: Self-Hosted (Most Control)**

```bash
# Using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e N8N_HOST=your-domain.com \
  n8nio/n8n

# Then access: http://localhost:5678
```

### Step 2: Create Webhook Trigger

**In n8n:**

1. Go to **Workflows** → **New**
2. Click **+** to add node
3. Search for **Webhook**
4. Select **Webhook** trigger node
5. Configure:
   - **HTTP Method:** POST
   - **Path:** `/github-test-webhook` (or your choice)
   - **Save**

**Copy the webhook URL:**

```
https://your-n8n-instance.com/webhook/github-test-webhook
```

### Step 3: Add GitHub Secret

**In GitHub:**

1. Repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. **Name:** `N8N_WEBHOOK_URL`
4. **Value:** Paste the webhook URL from Step 2
5. Click **Add secret**

### Step 4: Enable Workflow

**In GitHub:**

1. Go to **Actions** tab
2. Select **Tests with n8n Webhook** workflow
3. Workflows is now enabled and will trigger automatically

---

## 🔌 n8n Workflow Templates

### Template 1: Slack Notification on Test Failure

**Setup in n8n:**

```
Webhook (trigger)
  ↓
IF: status == "failure"
  ↓
Slack: Send Message
  - Channel: #tests
  - Message: "❌ Tests failed on {{ github.branch }}"
  - Mention: @channel
```

**n8n GUI Steps:**

1. Add **Webhook** node (from Step 2)
2. Add **IF** node (Conditionals → If)
   - Condition: `payload.status` `is` `failure`
3. Add **Slack** node (Integration)
   - Connect Slack account
   - Channel: #tests
   - Text: Use expression builder (blue lightning icon)

```
❌ Test Failure Alert

Repository: {{$node.Webhook.json.repository}}
Branch: {{$node.Webhook.json.branch}}
Author: {{$node.Webhook.json.author}}
Status: {{$node.Webhook.json.status}}

Tests: {{$node.Webhook.json.test_results.total}} total
       {{$node.Webhook.json.test_results.passed}} passed
       {{$node.Webhook.json.test_results.failed}} failed

Duration: {{$node.Webhook.json.test_results.duration_seconds}}s

View: {{$node.Webhook.json.workflow_url}}
```

### Template 2: Create Jira Issue on Failure

**Setup in n8n:**

```
Webhook (trigger)
  ↓
IF: status == "failure"
  ↓
Jira: Create Issue
  - Project: TEST
  - Issue Type: Bug
  - Title: "Failing Tests: {{ branch }}"
```

**Jira Configuration:**

1. Add **Jira Cloud** node
2. Connect Jira account
3. Operation: Create issue
4. Fields:
   - Project: TEST
   - Issue Type: Bug
   - Summary: `Tests Failed on {{$node.Webhook.json.branch}}`
   - Description: Test failure details
   - Priority: High

### Template 3: Email Daily Test Report

**Setup in n8n:**

```
Schedule: Daily at 9 AM
  ↓
HTTP: Fetch test results from GitHub API
  ↓
Email: Send report
```

**Email Node Configuration:**

1. Add **Schedule** node
   - Trigger: Daily
   - Time: 09:00
2. Add **HTTP Request** node
   - Method: GET
   - URL: `https://api.github.com/repos/YOUR_USER/sauce_Demo_AI/actions/workflows/playwright-tests.yml/runs`
   - Headers: Authorization: token {{ $env.GITHUB_TOKEN }}
3. Add **Email** node
   - To: team@example.com
   - Subject: Daily Test Report
   - Body: HTML template with results

### Template 4: Post Results to Discord

**Setup in n8n:**

```
Webhook (trigger)
  ↓
Discord: Send Message
  - Channel: #ci-cd
  - Embed rich message with stats
```

**Discord Node:**

1. Add **Discord** node
2. Connect Discord bot
3. Channel: #ci-cd
4. Use Rich Message format:

```
Title: ✅ Test Run Complete
Color: Green (success) / Red (failure)
Fields:
  - Tests Passed: {{ passed }}
  - Tests Failed: {{ failed }}
  - Duration: {{ duration }}s
```

---

## 🔄 Advanced Workflows

### Workflow: Auto-Create Release Notes

```
Webhook: Tests passed on main
  ↓
GitHub: Get latest commits since last release
  ↓
Format: Create markdown changelog
  ↓
GitHub: Create Release with notes
```

### Workflow: Performance Trending

```
Webhook: Test results received
  ↓
Database: Store results (PostgreSQL/MongoDB)
  ↓
Chart: Generate performance graph
  ↓
Slack: Post trend image
```

### Workflow: Multi-Channel Alerts

```
Webhook: Test started
  ↓
Switch: On condition
  ├─ If Success → Slack (quiet)
  ├─ If Failure → Slack + Email + Discord
  └─ If Timeout → PagerDuty (escalate)
```

---

## 📊 Data Flow Example

**GitHub Action sends this JSON to n8n:**

```json
{
  "event": "test_completed",
  "repository": "YOUR_USER/sauce_Demo_AI",
  "branch": "main",
  "commit": "abc123def456",
  "commit_message": "Add new checkout tests",
  "author": "developer",
  "run_id": "12345678",
  "status": "success",
  "test_results": {
    "total": "15",
    "passed": "15",
    "failed": "0",
    "duration_seconds": "120"
  },
  "workflow_url": "https://github.com/YOUR_USER/sauce_Demo_AI/actions/runs/12345678"
}
```

**n8n can transform and route this to:**

- ✅ Slack channel
- ✅ Email recipients
- ✅ Jira/Linear issues
- ✅ Discord
- ✅ Teams
- ✅ Custom webhooks
- ✅ Database
- ✅ Analytics platform

---

## 🔐 Security Best Practices

### 1. **Secure Webhook URL**

```yaml
# Always use GitHub Secrets (NEVER hardcode)
- name: Trigger n8n
  run: curl -X POST "${{ secrets.N8N_WEBHOOK_URL }}" ...
```

### 2. **Webhook Authentication**

**In n8n Webhook node:**

1. Open node settings
2. Enable **Authentication**
3. Set **API Key** header
4. Generate strong key: `head -c 32 /dev/urandom | base64`

**In GitHub action:**

```yaml
curl -X POST "${{ secrets.N8N_WEBHOOK_URL }}" \
  -H "Authorization: Bearer ${{ secrets.N8N_API_KEY }}" \
  -d ...
```

### 3. **IP Allowlist**

**In n8n (if self-hosted):**

```
Settings → Security → IP Allowlist
Add: GitHub Actions IP ranges
https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-githubs-ip-addresses
```

### 4. **Secrets Management**

**GitHub Secrets to Create:**

```
N8N_WEBHOOK_URL           # Webhook URL
N8N_API_KEY               # Optional: Auth key
SLACK_WEBHOOK_URL         # If posting to Slack
JIRA_API_TOKEN            # If posting to Jira
DISCORD_WEBHOOK_URL       # If posting to Discord
```

---

## 🚨 Error Handling

### Retry Logic in GitHub Action

```yaml
- name: Trigger n8n with retry
  uses: nick-invision/retry@v3
  with:
    timeout_minutes: 5
    max_attempts: 3
    retry_wait_seconds: 10
    command: |
      curl -X POST "${{ secrets.N8N_WEBHOOK_URL }}" \
        -H "Content-Type: application/json" \
        -d '{"event": "test_completed", ...}'
```

### Timeout Protection

```yaml
- name: Trigger n8n (with timeout)
  timeout-minutes: 2
  run: |
    timeout 30 curl -X POST "${{ secrets.N8N_WEBHOOK_URL }}" ...
```

---

## 📈 Monitoring & Logging

### View n8n Webhook Logs

**In n8n:**

1. Click workflow
2. Click **Executions** tab
3. See all webhook calls received
4. Click each to view:
   - Input data
   - Node outputs
   - Errors
   - Execution time

### GitHub Action Logs

**In GitHub:**

1. Go to **Actions** tab
2. Click workflow run
3. Click job
4. Expand **Trigger n8n webhook** step
5. See curl command and response

---

## 🔗 Integration Checklist

- [ ] n8n account created (cloud or self-hosted)
- [ ] Webhook trigger set up in n8n
- [ ] Webhook URL copied
- [ ] GitHub secret created (`N8N_WEBHOOK_URL`)
- [ ] `n8n-integration.yml` workflow added
- [ ] First test run completed
- [ ] n8n received webhook data
- [ ] n8n workflow processes data
- [ ] Notifications received (Slack/Email/etc)
- [ ] Webhook authentication enabled (optional)

---

## 📚 n8n Resources

### Documentation

- [n8n Docs](https://docs.n8n.io/)
- [Webhook Node Docs](https://docs.n8n.io/nodes/n8n-nodes-base.webhook/)
- [Slack Integration](https://docs.n8n.io/nodes/n8n-nodes-base.slack/)
- [GitHub Integration](https://docs.n8n.io/nodes/n8n-nodes-base.github/)

### Community

- [n8n Slack Community](https://n8n-community.slack.com)
- [n8n Forum](https://community.n8n.io/)
- [GitHub Discussions](https://github.com/n8n-io/n8n/discussions)

### Hosting Options

- [n8n Cloud](https://n8n.cloud) - Managed (easiest)
- [Docker](https://hub.docker.com/r/n8nio/n8n) - Self-hosted
- [Self-hosted EC2](https://docs.n8n.io/)
- [On-premise](https://docs.n8n.io/hosting/installation/)

---

## 🎯 Common Use Cases

| Use Case                | Workflow                      | N8N Nodes             |
| ----------------------- | ----------------------------- | --------------------- |
| Slack alerts on failure | Test → Condition → Slack      | Webhook, If, Slack    |
| Create Jira tickets     | Test failed → Jira issue      | Webhook, Jira         |
| Email reports daily     | Schedule → Fetch data → Email | Schedule, API, Email  |
| Discord notifications   | Test completed → Discord      | Webhook, Discord      |
| Aggregate metrics       | Tests → Database → Dashboard  | Webhook, Postgres, DB |
| Auto-deploy on success  | Tests passed → Deploy API     | Webhook, If, HTTP     |

---

## 🐛 Troubleshooting

### Webhook Not Received

**Check:**

1. Is n8n running? `curl https://your-n8n-instance.com`
2. Webhook URL correct in GitHub secret?
3. Webhook node active in n8n workflow?
4. Check n8n **Executions** for incoming calls

**Fix:**

```bash
# Test webhook manually
curl -X POST "YOUR_N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Workflow Not Processing

**Check:**

1. Workflow **Active** toggle ON in n8n?
2. Do conditions match? (Check IF node logic)
3. Are integrations (Slack, Jira) connected?
4. View **Executions** tab to see errors

### Authentication Failed

**Check:**

1. Is `N8N_API_KEY` secret set in GitHub?
2. Does key match in n8n webhook settings?
3. Check n8n webhook node logs

---

## 🎓 Example: Complete Setup

### Step 1: Create Simple Notification Workflow in n8n

**n8n Workflow:**

```
1. Webhook node (path: /github-tests)
2. Slack node (action: Post a message)
3. Channel: #ci-cd
4. Message: "Tests completed on {{$node.Webhook.json.branch}}"
5. Save & Activate
```

### Step 2: Add GitHub Secret

**GitHub:**

```
Settings → Secrets → New secret
Name: N8N_WEBHOOK_URL
Value: [copy from n8n]
```

### Step 3: Push Updated Workflow

**Local:**

```bash
git add .github/workflows/n8n-integration.yml
git commit -m "Add n8n integration"
git push
```

### Step 4: Watch It Work

**GitHub Actions:**

- Workflow runs
- Sends webhook to n8n

**n8n:**

- Receives webhook
- Triggers workflow
- Posts to Slack

**Slack:**

- ✅ See notification

---

## ✅ Success Indicators

✅ GitHub Action webhook executes
✅ n8n Executions show incoming data
✅ n8n workflow processes successfully
✅ Notification received (Slack/Email/etc)
✅ No errors in logs
✅ Consistent behavior on multiple runs

---

**Version:** 1.0 | **Updated:** April 2026 | **Status:** ✅ Ready for Production
