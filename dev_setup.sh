#!/bin/sh
# dev_setup.sh — First-run setup for the RJK website project.
# Run this once after cloning: ./dev_setup.sh

set -e

echo "Installing dependencies..."
pnpm install

echo "Registering git hooks..."
chmod +x .githooks/pre-commit
git config core.hooksPath .githooks

echo ""
echo "Setup complete."
echo "  - Dependencies installed"
echo "  - Pre-commit hook registered (runs pnpm test before each commit)"
echo ""
echo "Run 'pnpm dev' to start the development server."
echo "Run 'pnpm test' to run the test suite."
