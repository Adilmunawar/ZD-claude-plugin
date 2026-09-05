# Zaraat Dost toolkit installer — Windows PowerShell
# Usage: irm https://raw.githubusercontent.com/adilmunawar/ZD-claude-plugin/main/install.ps1 | iex
$ErrorActionPreference = "Stop"
Write-Host "Claude Plugins for Zaraat Dost — installer" -ForegroundColor Cyan
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Host "✗ Node.js not found. Install Node 18+ from https://nodejs.org then re-run." -ForegroundColor Red; exit 1 }
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) { Write-Host "• Claude Code not found — installing" -ForegroundColor Yellow; npm i -g @anthropic-ai/claude-code }
Write-Host ("✓ Node " + (node --version) + "   ✓ Claude Code " + (claude --version | Select-Object -First 1)) -ForegroundColor Green
$module = if ($args.Count -gt 0) { $args[0] } else { "zaraat-dost" }
Write-Host "• Adding marketplace adilmunawar/ZD-claude-plugin"
try { claude plugin marketplace add adilmunawar/ZD-claude-plugin | Out-Null } catch { claude plugin marketplace update zaraatdost | Out-Null }
Write-Host "• Installing $module@zaraatdost"
claude plugin install "$module@zaraatdost" --yes
Write-Host "`nDone. Open Claude Code in a project and run:  /zaraat-dost:help  or  /zaraat-dost:doctor" -ForegroundColor Green
