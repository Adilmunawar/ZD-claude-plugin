#!/usr/bin/env bash
# Zaraat Dost toolkit installer — macOS / Linux / WSL / Git Bash
# Usage: bash <(curl -fsSL https://raw.githubusercontent.com/adilmunawar/ZD-claude-plugin/main/install.sh)
set -euo pipefail
B='\033[1m'; G='\033[32m'; Y='\033[33m'; R='\033[31m'; N='\033[0m'
echo -e "${B}Claude Plugins for Zaraat Dost — installer${N}"
command -v node >/dev/null || { echo -e "${R}✗ Node.js not found.${N} Install Node 18+ from https://nodejs.org then re-run."; exit 1; }
command -v claude >/dev/null || { echo -e "${Y}• Claude Code not found — installing (npm i -g @anthropic-ai/claude-code)${N}"; npm i -g @anthropic-ai/claude-code; }
echo -e "${G}✓${N} Node $(node --version)   ${G}✓${N} Claude Code $(claude --version 2>/dev/null | head -1)"
echo "• Adding marketplace adilmunawar/ZD-claude-plugin"
claude plugin marketplace add adilmunawar/ZD-claude-plugin >/dev/null 2>&1 || claude plugin marketplace update zaraatdost >/dev/null
MODULE="${1:-zaraat-dost}"
echo "• Installing ${MODULE}@zaraatdost"
claude plugin install "${MODULE}@zaraatdost" --yes
echo -e "\n${G}${B}Done.${N} Open Claude Code in a project and run:  /zaraat-dost:help   or   /zaraat-dost:doctor"
