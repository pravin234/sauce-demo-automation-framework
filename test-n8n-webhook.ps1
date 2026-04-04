# Test n8n Webhook Integration
# Run this after setting up n8n webhook and GitHub secret

Write-Host "=== Testing n8n Webhook Integration ===" -ForegroundColor Green

# Test data that matches what GitHub Actions sends
$testData = @{
    event = "test_completed"
    repository = "pravin234/sauce-demo-automation-framework"
    branch = "main"
    status = "success"
    commit = "abc123def456"
    author = "pravin234"
    test_results = @{
        total = "15"
        passed = "15"
        failed = "0"
        duration_seconds = "120"
    }
    workflow_url = "https://github.com/pravin234/sauce-demo-automation-framework/actions/runs/123456789"
} | ConvertTo-Json

Write-Host "Test Data:" -ForegroundColor Yellow
Write-Host $testData -ForegroundColor Gray
Write-Host ""

# Get webhook URL from environment or prompt
$webhookUrl = $env:N8N_WEBHOOK_URL
if (-not $webhookUrl) {
    $webhookUrl = Read-Host "Enter your n8n webhook URL"
}

Write-Host "Sending test webhook to: $webhookUrl" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method POST -Body $testData -ContentType "application/json"
    Write-Host "✅ Webhook sent successfully!" -ForegroundColor Green
    Write-Host "Response: $response" -ForegroundColor Gray
} catch {
    Write-Host "❌ Webhook failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next: Check your n8n workflow executions to see if it received the data!" -ForegroundColor Yellow