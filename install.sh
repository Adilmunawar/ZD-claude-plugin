#!/usr/bin/env bash
# Zaraat Dost toolkit installer — macOS / Linux / WSL / Git Bash
# Usage: bash <(curl -fsSL https://raw.githubusercontent.com/adilmunawar/ZD-claude-plugin/main/install.sh) [module] [--source <owner/repo|path>]
set -euo pipefail
MODULE="zaraat-dost"; SOURCE="https://github.com/Adilmunawar/ZD-claude-plugin.git"
while [ $# -gt 0 ]; do case "$1" in --source) SOURCE="$2"; shift 2;; *) MODULE="$1"; shift;; esac; done
B=$'\033[1m'; G=$'\033[32m'; Y=$'\033[33m'; R=$'\033[31m'; N=$'\033[0m'
echo "${B}Claude Plugins for Zaraat Dost — installer${N}"
command -v node >/dev/null || { echo "${R}Node.js not found.${N} Install Node 18+ from https://nodejs.org and re-run."; exit 1; }
command -v claude >/dev/null || { echo "${Y}Claude Code not found — installing (npm i -g @anthropic-ai/claude-code)${N}"; npm i -g @anthropic-ai/claude-code; }
echo "${G}ok${N} node $(node --version)   ${G}ok${N} $(claude --version 2>/dev/null | head -1)"
echo "adding marketplace ${SOURCE}"
if ! claude plugin marketplace add "${SOURCE}" >/dev/null 2>&1; then claude plugin marketplace update zaraatdost >/dev/null; fi
echo "installing ${MODULE}@zaraatdost"
claude plugin install "${MODULE}@zaraatdost" --yes
echo
echo "${G}${B}Installed.${N} Open Claude Code in a project and run:  /zaraat-dost:doctor   then   /zaraat-dost:help"
