#!/bin/sh
# dev_setup.sh — First-run setup for the RJK website project.
# Run this once after cloning: ./dev_setup.sh

set -e

echo "Installing dependencies..."
pnpm install

echo "Setting up environment variables..."
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "  - Created .env.local from .env.example"
  echo "  *** ACTION REQUIRED: Fill in your Notion credentials in .env.local before running pnpm dev ***"
else
  echo "  - .env.local already exists, skipping"
fi

echo "Registering git hooks..."
chmod +x .githooks/pre-commit
git config core.hooksPath .githooks

echo ""
echo "Setup complete."
echo "  - Dependencies installed"
echo "  - .env.local configured (fill in Notion credentials if not already done)"
echo "  - Pre-commit hook registered (runs pnpm test before each commit)"
echo ""
echo "Run 'pnpm dev' to start the development server."
echo "Run 'pnpm test' to run the test suite."
