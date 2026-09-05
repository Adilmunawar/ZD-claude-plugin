# Zaraat Dost toolkit installer — Windows PowerShell
# Usage: irm https://raw.githubusercontent.com/adilmunawar/ZD-claude-plugin/main/install.ps1 | iex
#        or: .\install.ps1 [-Module zd-gis] [-Source owner/repo|path]
param([string]$Module = "zaraat-dost", [string]$Source = "adilmunawar/ZD-claude-plugin")
$ErrorActionPreference = "Stop"
Write-Host "Claude Plugins for Zaraat Dost — installer" -ForegroundColor Cyan
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Host "Node.js not found. Install Node 18+ from https://nodejs.org and re-run." -ForegroundColor Red; exit 1 }
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) { Write-Host "Claude Code not found — installing" -ForegroundColor Yellow; npm i -g @anthropic-ai/claude-code }
Write-Host ("ok node " + (node --version) + "   ok " + (claude --version | Select-Object -First 1)) -ForegroundColor Green
Write-Host "adding marketplace $Source"
$added = $true
try { claude plugin marketplace add $Source *> $null } catch { $added = $false }
if (-not $added -or $LASTEXITCODE -ne 0) { claude plugin marketplace update zaraatdost *> $null }
Write-Host "installing $Module@zaraatdost"
claude plugin install "$Module@zaraatdost" --yes
if ($LASTEXITCODE -ne 0) { Write-Host "Install failed. Run: claude plugin marketplace list; claude plugin install $Module@zaraatdost" -ForegroundColor Red; exit 1 }
Write-Host "`nInstalled. Open Claude Code in a project and run:  /zaraat-dost:doctor   then   /zaraat-dost:help" -ForegroundColor Green
