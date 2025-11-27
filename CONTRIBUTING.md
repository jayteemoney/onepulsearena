# Contributing to OnePulse Arena

Thank you for your interest in contributing to OnePulse Arena! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, Sui CLI version)
- Screenshots if applicable

### Suggesting Enhancements

Feature requests are welcome! Please include:
- Clear description of the feature
- Use cases and benefits
- Potential implementation approach
- Mockups or examples if applicable

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests: `npm run test:move` and `npm run lint`
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## 📝 Code Style

### Move (Smart Contracts)

- Follow Sui Move style guide
- Use descriptive function and variable names
- Add comments for complex logic
- Include unit tests for new functions

### TypeScript/React

- Use TypeScript strict mode
- Follow React hooks best practices
- Use functional components
- Prefer composition over inheritance
- Use Tailwind for styling (no inline styles)

### Commit Messages

Follow conventional commits:
```
feat: add new leaderboard filter
fix: resolve pulse cooldown bug
docs: update README with deployment steps
test: add tests for record_pulse function
```

## 🧪 Testing

### Move Contracts

```bash
cd contracts
sui move test
```

### Frontend

- Manual testing with multiple browser tabs
- Check real-time event synchronization
- Verify wallet connection flow

## 📋 Development Workflow

1. **Setup**: Follow README.md installation steps
2. **Branch**: Create feature branch from `main`
3. **Develop**: Make changes with frequent commits
4. **Test**: Run all tests locally
5. **Document**: Update docs if needed
6. **PR**: Submit with clear description

## 🚀 Deployment

Only maintainers can deploy to production. Deployment requires:
- All tests passing
- Code review approval
- Updated documentation
- Changelog entry

## 📞 Communication

- GitHub Issues: Bug reports and features
- GitHub Discussions: Questions and ideas
- OneChain Telegram: Technical support

## 🙏 Recognition

Contributors will be acknowledged in:
- README.md contributors section
- Release notes
- Project documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make OnePulse Arena better! 🚀
