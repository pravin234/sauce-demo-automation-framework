# n8n Quick Start Setup (10 Minutes)

⚡ Get GitHub Actions + n8n working in 10 minutes.

---

## 👥 Option 1: n8n Cloud (Easiest)

### Step 1: Sign Up (2 minutes)

```
1. Go to https://n8n.cloud
2. Click "Sign up"
3. Enter: Email, Password, Full name
4. Verify email
5. Create workspace name
```

### Step 2: Create Webhook (3 minutes)

```
In n8n:
1. Click "New" → Workflow
2. Click + to add node
3. Search "Webhook"
4. Click "Webhook" (n8n-nodes-base.webhook)
5. HTTP Method: POST
6. Click "Test" → Copy webhook URL

Your URL looks like:
https://hook.n8n.cloud/webhook/RANDOM-ID
```

### Step 3: Add to GitHub (2 minutes)

```
In GitHub:
1. Go to your repo
2. Settings → Secrets and variables → Actions
3. New repository secret
   Name: N8N_WEBHOOK_URL
   Value: [paste webhook URL]
4. Add secret
```

### Step 4: Add First n8n Node (3 minutes)

```
In n8n (in the workflow):
1. Connect Slack
   - Click + to add node
   - Search "Slack"
   - Click "Slack"
   - Click "Connect account"
   - Paste Slack bot token (see Slack setup below)

2. Configure message
   - Channel: #ci-cd
   - Message: "Tests completed: {{$json.status}}"

3. Save workflow
4. Click "Activate" (top right)
```

### Step 5: Test It (0 minutes - automated!)

```
The workflow is now live!
When tests run in GitHub, n8n receives the notification automatically.
```

---

## 🔐 Option 2: Self-Hosted n8n (Docker)

### Step 1: Install Docker

Visit: https://www.docker.com/products/docker-desktop

### Step 2: Run n8n

```bash
# Create data directory
mkdir -p ~/n8n-data

# Run n8n
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e N8N_HOST=localhost \
  -v ~/n8n-data:/home/node/.n8n \
  n8nio/n8n:latest

# Access at http://localhost:5678
```

### Step 3: First Login

```
1. Go to http://localhost:5678
2. Create admin user
3. Set email and password
4. Create workspace
```

### Step 4: Get Webhook URL

```
In n8n Webhook node:
- By default: http://localhost:5678/webhook/YOUR-PATH

For external access (GitHub):
- Use tunnel service: ngrok, cloudflare, etc.
  ngrok http 5678
  → Copy "Forwarding URL"
  → Use: https://xxxxx.ngrok.io/webhook/YOUR-PATH
```

---

## 🤖 Slack Setup (5 minutes)

### Create Slack App

```
1. Go to https://api.slack.com/apps
2. Click "Create New App"
3. From scratch
4. App name: n8n-bot
5. Workspace: Your Slack workspace
6. Click "Create App"
```

### Add Permissions

```
1. Left sidebar: "OAuth & Permissions"
2. Scroll to "Scopes"
3. Click "Add an OAuth Scope"
4. Add: chat:write
5. Scroll down: "User OAuth Scopes"
6. Add: chat:write (if needed)
```

### Generate Token

```
1. Top of page: "OAuth Tokens for Your Workspace"
2. Click "Install to Workspace"
3. Click "Allow"
4. Copy "Bot User OAuth Token" (looks like: xoxb-xxx)
```

### Add Bot to Channel

```
1. In Slack, go to #ci-cd channel (or create it)
2. Click channel name (top)
3. Members tab
4. "Add members"
5. Search "n8n-bot"
6. Add bot
```

### Connect to n8n

```
In n8n Slack node:
1. Click "Connect account"
2. Paste Bot token
3. Test connection
4. Save
```

---

## 📧 Email Setup (5 minutes)

### Gmail (Recommended)

```
1. Go to myaccount.google.com
2. Security tab
3. Search "App passwords"
4. Select "Mail" and "Windows Computer"
5. Generate password
6. Copy password

In n8n Email node:
- Username: your-email@gmail.com
- Password: [paste app password]
- Host: smtp.gmail.com
- Port: 465
- SSL: Yes
```

### Microsoft 365

```
Similar to Gmail
- Host: smtp.office365.com
- Port: 587
- SSL: STARTTLS
```

### SendGrid

```
1. Go to sendgrid.com
2. Create account
3. Settings → API Keys
4. Create key
5. Copy key

In n8n: Use SendGrid node (easier than SMTP)
```

---

## 🚀 Deploy GitHub Workflow

### Update n8n-integration.yml

```yaml
# Already created in .github/workflows/n8n-integration.yml
# Just make sure N8N_WEBHOOK_URL secret is set
```

### Push and Test

```bash
# Make a small change to trigger workflow
echo "# Test" >> README.md

git add .
git commit -m "Test n8n integration"
git push

# Watch GitHub Actions run
# Check n8n Executions tab for webhook
# See notification in Slack/Email
```

---

## ✅ Verification Checklist

- [ ] n8n account created
- [ ] Webhook URL obtained and copied
- [ ] GitHub secret N8N_WEBHOOK_URL set
- [ ] Slack app created (if using Slack)
- [ ] Slack bot token in n8n
- [ ] n8n workflow created and activated
- [ ] GitHub workflow file exists (.github/workflows/n8n-integration.yml)
- [ ] Test run completed
- [ ] n8n received webhook
- [ ] Notification sent ✅

---

## 🐛 Troubleshooting

### n8n Not Receiving Webhook

**Check:**

```bash
# Is n8n running?
curl https://your-n8n-instance.com

# Is webhook URL correct?
# Compare in: GitHub secret vs n8n webhook node
```

**Fix:**

```bash
# Test webhook manually
curl -X POST "YOUR_N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Check n8n Executions tab - you should see it
```

### Slack Message Not Sending

**Check:**

1. Is Slack node connected? (Green checkmark)
2. Is channel correct? (`#ci-cd`)
3. Does bot have message:write permission?

**Fix:**

```
In n8n:
1. Click Slack node
2. "Test node" button
3. Check error message
4. Fix permissions or token
```

### GitHub Workflow Not Triggering n8n

**Check:**

1. Is n8n-integration.yml enabled?
2. Does GitHub secret N8N_WEBHOOK_URL exist?
3. Check GitHub Actions logs for errors

**Fix:**

```
In GitHub Actions logs:
- Look for "Trigger n8n webhook" step
- Check curl response
- Verify webhook URL has no typos
```

---

## 📊 What Happens When Tests Run

```
1. GitHub Actions: Tests run in workflows/n8n-integration.yml

2. GitHub (line 52):
   curl -X POST "${{ secrets.N8N_WEBHOOK_URL }}" \
     -H "Content-Type: application/json" \
     -d '{ "status": "success", ... }'

3. n8n:
   Webhook node receives POST data
   ↓
   If condition checks status
   ↓
   Slack node posts message
   ↓
   Notification appears in #ci-cd

4. Done! ✅
```

---

## 🎯 Next: Advanced Workflows

Once basic setup works:

1. **Conditionals:**

   - Only notify on failure
   - Different channels per branch
   - Escalate for critical issues

2. **Multiple Services:**

   - Slack + Email + Discord
   - Jira tickets for failures
   - Database logging

3. **Smart Routing:**
   - Success → quiet channel
   - Failure → loud channel + email
   - Timeout → page engineer

See [N8N_WORKFLOWS.md](N8N_WORKFLOWS.md) for templates!

---

## 💡 Pro Tips

### Tip 1: Use n8n Expressions

```
Instead of: "Tests completed"
Use: "Tests completed on {{$json.branch}} by {{$json.author}}"
→ Personalized messages with actual data
```

### Tip 2: Test with Sample Data

```
In n8n Webhook node:
1. "Test" button
2. Enter sample JSON
3. Execute node
→ Test entire workflow without pushing code
```

### Tip 3: View Execution History

```
In n8n:
Click workflow → Executions tab
See all webhook calls, inputs, outputs, errors
→ Debug issues quickly
```

### Tip 4: Use Error Outputs

```
In n8n nodes:
Enable "Errors" output
Send errors to #errors channel
→ Catch and fix integration issues
```

---

## 🎓 Learn More

- [n8n Documentation](https://docs.n8n.io)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Webhook Best Practices](https://docs.n8n.io/nodes/n8n-nodes-base.webhook/)

---

**Status:** ✅ Ready to Deploy
**Time to Setup:** 10 minutes (if you already have GitHub + Slack)
**Monthly Cost:** $0 (using free tiers)

Start with Step 1 above! Questions? Check [N8N_INTEGRATION.md](N8N_INTEGRATION.md) 🚀
