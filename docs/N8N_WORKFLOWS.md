# Example n8n Workflows

Ready-to-use n8n workflow templates for GitHub Actions integration.

---

## 📋 How to Import Workflows

### Method 1: Import JSON (Recommended)

1. **In n8n:**

   - Click **Workflows** → **New** → **Import**
   - Select/paste JSON file
   - Click **Import**

2. **Update credentials:**

   - Each node with integrations (Slack, Jira, etc.)
   - Click node → Select your account
   - Save

3. **Configure paths:**
   - Update webhook paths if different
   - Enable/disable specific workflows
   - Test webhook with sample data

### Method 2: Manual Recreation

Use the workflow diagrams below to recreate workflows step-by-step.

---

## 🟢 Workflow 1: Slack on Test Failure (BASIC)

**Complexity:** ⭐ (Easiest)
**Setup Time:** 5 minutes
**Requirements:** Slack workspace + Slack bot token

### Flow Diagram

```
GitHub Action sends test results
    ↓
n8n Webhook receives data
    ↓
IF: status == "failure"
    ├─ YES → Post to Slack #alerts
    └─ NO → End
```

### n8n JSON Configuration

```json
{
  "nodes": [
    {
      "parameters": {
        "path": "github-test-results",
        "httpMethod": "POST"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.status}}",
              "value2": "failure",
              "operation": "equals"
            }
          ]
        }
      },
      "name": "Check if Failed",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "channel": "#alerts",
        "text": "❌ **Test Failure Alert**\n\n**Repository:** {{$json.repository}}\n**Branch:** {{$json.branch}}\n**Author:** {{$json.author}}\n**Status:** {{$json.status}}\n\n**Test Results:**\n- Total: {{$json.test_results.total}}\n- Passed: {{$json.test_results.passed}}\n- Failed: {{$json.test_results.failed}}\n\n**Duration:** {{$json.test_results.duration_seconds}}s\n\n<{{$json.workflow_url}}|View Workflow>"
      },
      "name": "Slack Notification",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [650, 200]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Check if Failed",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check if Failed": {
      "main": [
        [
          {
            "node": "Slack Notification",
            "type": "main",
            "index": 0
          }
        ],
        []
      ]
    }
  }
}
```

### Setup Steps

1. **Create Slack Bot:**

   - Go to api.slack.com/apps → Create New App
   - From scratch → Name: n8n-bot
   - Copy Bot Token

2. **In n8n:**

   - Add Slack node
   - Connect account (paste token)
   - Channel: #alerts
   - Test message

3. **In GitHub:**
   - Add secret: N8N_WEBHOOK_URL
   - Enable n8n-integration.yml

---

## 🟡 Workflow 2: Jira Ticket on Failure (INTERMEDIATE)

**Complexity:** ⭐⭐ (Medium)
**Setup Time:** 10 minutes
**Requirements:** Jira Cloud account + API token

### Flow Diagram

```
GitHub tests fail
    ↓
n8n Webhook receives data
    ↓
IF: status == "failure"
    ├─ Jira: Create Bug ticket
    ├─ Slack: Notify #alerts
    └─ Email: Send to team lead
```

### Key Nodes Configuration

**Jira Node:**

```
Operation: Create issue
Project: TEST (or your project key)
Issue Type: Bug
Summary: Tests Failed: {{$json.branch}} - {{$json.commit_message}}
Description:
Failed {{$json.test_results.failed}} out of {{$json.test_results.total}} tests
Branch: {{$json.branch}}
Author: {{$json.author}}
Workflow: {{$json.workflow_url}}

Priority: High
Labels: ci-cd, automated
```

**Email Node:**

```
To: team-lead@company.com
Subject: ⚠️ Tests Failed - {{$json.branch}}
Body: HTML with test results and Jira ticket link
```

---

## 🔵 Workflow 3: Daily Test Report (ADVANCED)

**Complexity:** ⭐⭐⭐ (Advanced)
**Setup Time:** 20 minutes
**Requirements:** GitHub API token, Email account

### Flow Diagram

```
Schedule: Every day at 9 AM
    ↓
GitHub API: Get last 24h test results
    ↓
Format: Create HTML report
    ↓
Email: Send to team
```

### Key Nodes Configuration

**Schedule Node:**

```
Trigger: At a specific time
Time: 09:00
```

**GitHub API Node:**

```
URL: https://api.github.com/repos/{{$env.GITHUB_USER}}/sauce_Demo_AI/actions/workflows/playwright-tests.yml/runs?per_page=10
Method: GET
Headers:
  Authorization: token {{$env.GITHUB_TOKEN}}
  Accept: application/vnd.github.v3+json
```

**Function Node (Format Report):**

```javascript
const runs = $input.all();
let report = "<h2>Daily Test Report</h2>";
report += '<table border="1">';
report +=
  "<tr><th>Date</th><th>Branch</th><th>Status</th><th>Duration</th></tr>";

runs.forEach((run) => {
  const row = run.json;
  report += `<tr>
    <td>${new Date(row.created_at).toLocaleDateString()}</td>
    <td>${row.head_branch}</td>
    <td>${row.conclusion === "success" ? "✅" : "❌"}</td>
    <td>${Math.round((row.run_number || 0) / 60)} min</td>
  </tr>`;
});

report += "</table>";
return { report };
```

**Email Node:**

```
To: team@company.com
Subject: Daily Test Report - {{new Date().toLocaleDateString()}}
Body: {{$node["Function"].data.report}}
        (Set as HTML)
```

---

## 🟣 Workflow 4: Multi-Channel Notifications (EXPERT)

**Complexity:** ⭐⭐⭐⭐ (Expert)
**Setup Time:** 30 minutes
**Requirements:** Slack + Discord + Email

### Flow Diagram

```
Test webhook
    ↓
    ├─ Success
    │   └─ Slack #general (quiet)
    │
    ├─ Failure
    │   ├─ Slack #alerts (loud)
    │   ├─ Discord #ci-cd (mention everyone)
    │   ├─ Email team (high priority)
    │   └─ Create Jira ticket
    │
    └─ Timeout
        ├─ PagerDuty (page on-call)
        └─ Slack (🚨)
```

### Complex IF Logic Example

```
Switch Node:
  Case 1: status == "success"
    → Slack #general: "✅ Tests passed"

  Case 2: status == "failure" AND failed > 5
    → PagerDuty: Page engineer
    → Discord: "🚨 CRITICAL"

  Case 3: status == "failure"
    → Slack #alerts: "❌ Tests failed"
    → Jira: Create bug
    → Email: Send details

  Default: Unknown status
    → Slack #random: Log error
```

---

## 🚀 Workflow 5: Performance Tracking (ENTERPRISE)

**Complexity:** ⭐⭐⭐⭐⭐ (Most Advanced)
**Setup Time:** 45 minutes
**Requirements:** Database + Charting + Slack

### Flow Diagram

```
Test webhook
    ↓
Database: Store test metrics
    ├─ Timestamp
    ├─ Branch
    ├─ Duration
    ├─ Passed/Failed
    └─ Author
    ↓
Generate Chart
    ├─ Duration trend
    ├─ Pass rate trend
    └─ Tests per day
    ↓
Post to Slack with chart
```

### Database Schema

```sql
CREATE TABLE test_runs (
  id SERIAL PRIMARY KEY,
  run_date TIMESTAMP DEFAULT NOW(),
  repository VARCHAR(255),
  branch VARCHAR(255),
  commit_hash VARCHAR(40),
  author VARCHAR(255),
  total_tests INT,
  passed_tests INT,
  failed_tests INT,
  duration_seconds INT,
  status VARCHAR(20)
);

CREATE INDEX idx_date ON test_runs(run_date);
CREATE INDEX idx_branch ON test_runs(branch);
```

### n8n Database Node Configuration

```
Operation: Execute Query
Database: Your DB connection
Query:
INSERT INTO test_runs
  (repository, branch, commit_hash, author, total_tests, passed_tests, failed_tests, duration_seconds, status)
VALUES
  ('{{$json.repository}}', '{{$json.branch}}', '{{$json.commit}}', '{{$json.author}}',
   {{$json.test_results.total}}, {{$json.test_results.passed}}, {{$json.test_results.failed}},
   {{$json.test_results.duration_seconds}}, '{{$json.status}}')
```

---

## 📝 Quick Setup Checklist

### For Workflow 1 (Slack Notifications)

- [ ] n8n account created
- [ ] Slack bot created and token copied
- [ ] n8n Slack integration connected
- [ ] Webhook URL obtained
- [ ] GitHub secret `N8N_WEBHOOK_URL` created
- [ ] First test run triggered
- [ ] Slack notification received ✅

### For Workflow 2+ (Advanced)

- [ ] All of Workflow 1
- [ ] External service credentials (Jira, Email, Discord)
- [ ] n8n integrations connected
- [ ] Workflow tested with sample webhook data
- [ ] Error handling configured
- [ ] Logging enabled

---

## 🧪 Testing Workflows

### Test Webhook Manually

**In n8n:**

1. Open webhook node
2. Copy webhook URL
3. Test node (sends sample data)

**Via curl:**

```bash
curl -X POST "YOUR_N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "test_completed",
    "status": "failure",
    "repository": "YOUR_USER/sauce_Demo_AI",
    "branch": "main",
    "author": "test-user",
    "test_results": {
      "total": "15",
      "passed": "12",
      "failed": "3",
      "duration_seconds": "120"
    }
  }'
```

### View Execution Logs

**In n8n:**

1. Click workflow
2. Click **Executions**
3. Click execution ID
4. Expand nodes to see inputs/outputs
5. Check for errors

---

## 🔗 Common Integration Patterns

### Pattern 1: Success → Quiet, Failure → Loud

```
IF status == "success"
  → Slack: Send to #general with green emoji

ELSE
  → Slack: Send to #alerts with red emoji + mention
  → Email: Send to team lead
  → Jira: Create bug ticket
```

### Pattern 2: Escalating Alerts

```
IF failed > 10
  → PagerDuty: Critical alert

ELSE IF failed > 5
  → Slack: Send to #oncall

ELSE IF failed > 0
  → Slack: Send to #ci-cd

ELSE
  → Slack: Send to #general
```

### Pattern 3: Conditional Deployment

```
IF status == "success" AND branch == "main"
  → Call deployment API
  → Post success to Slack

ELSE
  → Log to database
  → Post to #alerts
```

---

## 📚 Export Workflows

### Export from n8n

1. Click workflow
2. Menu **...** → **Download as JSON**
3. Save file
4. Share with team

### Import into Another n8n Instance

1. New workflow → **Import**
2. Upload JSON
3. Configure credentials
4. Activate

---

## ✅ Validation Checklist

- [ ] Webhook node receives data from GitHub
- [ ] Condition logic works correctly
- [ ] External integrations connected
- [ ] Test data processed successfully
- [ ] Notifications sent to correct channels
- [ ] No errors in execution logs
- [ ] Workflow is active and enabled
- [ ] Teams can access and monitor

---

**Version:** 1.0 | **Updated:** April 2026 | **Status:** Production Ready

For detailed guides on each workflow, see [N8N_INTEGRATION.md](N8N_INTEGRATION.md)
