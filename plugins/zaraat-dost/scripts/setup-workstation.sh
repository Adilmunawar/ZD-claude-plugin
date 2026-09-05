#!/usr/bin/env bash
# Zaraat Dost workstation setup — macOS (Homebrew) or Debian/Ubuntu (apt). Usage: bash setup-workstation.sh [--dry-run]
set -euo pipefail
DRY=${1:-}
run() { if [ "$DRY" = "--dry-run" ]; then echo "would run: $*"; else "$@"; fi; }
if [[ "$OSTYPE" == darwin* ]]; then
  command -v brew >/dev/null || { echo "Install Homebrew first: https://brew.sh"; exit 1; }
  run brew install git node gh dotnet-sdk miniforge gdal
  run brew install --cask visual-studio-code qgis docker
else
  run sudo apt-get update
  run sudo apt-get install -y git curl gdal-bin libgdal-dev build-essential
  run bash -c "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
  echo "Install .NET SDK 8 and GitHub CLI per https://learn.microsoft.com/dotnet/core/install/linux and https://cli.github.com"
fi
run npm i -g @anthropic-ai/claude-code
command -v conda >/dev/null && run conda create -y -n zd -c conda-forge python=3.11 geopandas rasterio shapely pyproj gdal
for e in ms-python.python ms-dotnettools.csdevkit dbaeumer.vscode-eslint esbenp.prettier-vscode bradlc.vscode-tailwindcss expo.vscode-expo-tools anthropic.claude-code; do command -v code >/dev/null && run code --install-extension "$e"; done
echo "Done. Run: gh auth login; then in Claude Code: /zaraat-dost:doctor"
