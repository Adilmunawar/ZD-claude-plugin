# Zaraat Dost toolkit installer — Windows PowerShell
# Usage: irm https://raw.githubusercontent.com/Adilmunawar/ZD-claude-plugin/main/install.ps1 | iex
#        or: .\install.ps1 [-Module zd-gis] [-Source owner/repo|path]
# Never calls `exit` (which would close the window when run via iex); all failures return with a message.
param([string]$Module = "zaraat-dost", [string]$Source = "https://github.com/Adilmunawar/ZD-claude-plugin.git")

function Install-ZDToolkit {
  param([string]$Module, [string]$Source)
  $ErrorActionPreference = "Continue"
  Write-Host ""
  Write-Host "Claude Plugins for Zaraat Dost - installer" -ForegroundColor Cyan
  Write-Host "------------------------------------------"

  # 1. Node.js
  $node = Get-Command node -ErrorAction SilentlyContinue
  if (-not $node) {
    Write-Host "[x] Node.js not found." -ForegroundColor Red
    Write-Host "    Install Node 18+ from https://nodejs.org (LTS), close and reopen PowerShell, then run this again."
    return
  }
  Write-Host ("[ok] Node.js " + (& node --version)) -ForegroundColor Green

  # 2. Claude Code
  $claude = Get-Command claude -ErrorAction SilentlyContinue
  if (-not $claude) {
    Write-Host "[..] Claude Code not found - installing with npm (this takes a minute)" -ForegroundColor Yellow
    & npm install -g @anthropic-ai/claude-code
    if ($LASTEXITCODE -ne 0) { Write-Host "[x] npm install failed (exit $LASTEXITCODE). Fix the error above and run again." -ForegroundColor Red; return }
    $claude = Get-Command claude -ErrorAction SilentlyContinue
    if (-not $claude) { Write-Host "[x] Claude Code installed but not on PATH yet. Close and reopen PowerShell, then run this again." -ForegroundColor Red; return }
  }
  Write-Host ("[ok] " + ((& claude --version) | Select-Object -First 1)) -ForegroundColor Green

  # 3. Marketplace
  Write-Host "[..] Adding marketplace $Source"
  $out = & claude plugin marketplace add $Source 2>&1
  if ($LASTEXITCODE -ne 0) {
    if (($out | Out-String) -match "already") {
      Write-Host "[ok] Marketplace already present - refreshing" -ForegroundColor Green
      & claude plugin marketplace update zaraatdost 2>&1 | Out-Null
    } else {
      Write-Host "[x] Could not add the marketplace:" -ForegroundColor Red; Write-Host ($out | Out-String)
      Write-Host "    If the repo is private, run: gh auth login   then try again."
      return
    }
  } else { Write-Host "[ok] Marketplace added" -ForegroundColor Green }

  # 4. Plugin
  Write-Host "[..] Installing $Module@zaraatdost"
  & claude plugin install "$Module@zaraatdost" --yes
  if ($LASTEXITCODE -ne 0) {
    Write-Host "[x] Install failed (exit $LASTEXITCODE). Useful commands:" -ForegroundColor Red
    Write-Host "    claude plugin marketplace list"
    Write-Host "    claude plugin install $Module@zaraatdost"
    return
  }

  Write-Host ""
  Write-Host "Installed." -ForegroundColor Green
  Write-Host "Open Claude Code inside a project (type: claude) and run:"
  Write-Host "    /zaraat-dost:doctor      check this machine"
  Write-Host "    /zaraat-dost:help        list every command"
  Write-Host ""
}

Install-ZDToolkit -Module $Module -Source $Source
