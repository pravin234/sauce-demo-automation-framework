# Sauce Demo Automation Framework

[![Playwright Tests](https://github.com/rajdhani234/sauce-demo-automation-framework/actions/workflows/playwright-tests.yml/badge.svg)](https://github.com/rajdhani234/sauce-demo-automation-framework/actions/workflows/playwright-tests.yml)
[![PR Validation](https://github.com/rajdhani234/sauce-demo-automation-framework/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/rajdhani234/sauce-demo-automation-framework/actions/workflows/pr-validation.yml)
[![n8n Integration](https://github.com/rajdhani234/sauce-demo-automation-framework/actions/workflows/n8n-integration.yml/badge.svg)](https://github.com/rajdhani234/sauce-demo-automation-framework/actions/workflows/n8n-integration.yml)

A comprehensive test automation framework for SauceDemo built with Playwright, featuring CI/CD pipelines and n8n workflow integration.

## 🚀 Features

- **15 End-to-End Tests** - Complete coverage of SauceDemo functionality
- **Page Object Model** - Maintainable and scalable test architecture
- **Parallel Browser Testing** - Chrome, Firefox, WebKit support
- **Storage State Management** - Advanced authentication and session handling
- **CI/CD Pipeline** - GitHub Actions with matrix testing
- **n8n Integration** - Automated notifications and workflow triggers
- **Comprehensive Documentation** - Setup guides and best practices

## 🧪 Test Suite

### Main Tests (`tests/specs/sauceDemo.spec.ts`)

- ✅ Valid and invalid login scenarios
- ✅ Product browsing and cart management
- ✅ Checkout flow with multiple items
- ✅ Price calculations and assertions
- ✅ Remove items functionality

### Storage State Demos (`tests/specs/storageStateDemo.spec.ts`)

- ✅ Authentication state persistence
- ✅ Multi-user parallel testing
- ✅ Context isolation and sharing
- ✅ Performance optimization techniques

## 🏗️ Architecture

```
├── tests/
│   ├── page-objects/     # Page Object Model classes
│   ├── specs/           # Test specifications
│   └── utils/           # Utilities and assertions
├── .github/workflows/   # CI/CD pipelines
├── docs/               # Documentation
└── n8n/               # Workflow templates
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or 20+
- GitHub CLI (for repository management)

### Installation

```bash
# Clone the repository
git clone https://github.com/rajdhani234/sauce-demo-automation-framework.git
cd sauce-demo-automation-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run tests
npm run test
```

### Running Tests

```bash
# Run all tests
npm run test

# Run with UI (headed mode)
npm run test:headed

# Run specific test file
npm run test -- tests/specs/sauceDemo.spec.ts

# Generate report
npm run test:report
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

1. **Playwright Tests** - Full matrix testing (Node 18/20 × Chrome/Firefox/WebKit)
2. **PR Validation** - Fast feedback on pull requests
3. **Parallel Browsers** - On-demand cross-browser testing
4. **n8n Integration** - Automated notifications via webhook

### n8n Integration

The framework includes n8n workflow templates for:

- Slack notifications on test failures
- Jira ticket creation
- Email reports
- Discord notifications
- Performance tracking

See [n8n Integration Guide](docs/N8N_INTEGRATION.md) for setup instructions.

## 📚 Documentation

- [CI/CD Guide](docs/CI_CD_GUIDE.md) - Pipeline architecture and best practices
- [GitHub Setup](docs/GITHUB_SETUP.md) - Step-by-step deployment guide
- [n8n Quick Start](docs/N8N_QUICK_START.md) - 10-minute setup guide
- [n8n Workflows](docs/N8N_WORKFLOWS.md) - Ready-to-use workflow templates
- [Windows Setup](docs/WINDOWS_SETUP.md) - Windows-specific instructions

## 🛠️ Technologies

- **Playwright** - Modern web testing framework
- **TypeScript** - Type-safe test development
- **GitHub Actions** - CI/CD automation
- **n8n** - Workflow automation platform
- **Node.js** - Runtime environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SauceDemo](https://www.saucedemo.com/) - Test application
- [Playwright](https://playwright.dev/) - Testing framework
- [n8n](https://n8n.io/) - Workflow automation
- [GitHub Actions](https://github.com/features/actions) - CI/CD platform

---

**Built with ❤️ for automated testing excellence**
