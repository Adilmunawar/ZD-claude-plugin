# Zaraat Dost workstation setup — Windows (winget). Run: powershell -ExecutionPolicy Bypass -File setup-workstation.ps1 [-WhatIf]
param([switch]$WhatIf)
$pkgs = @(
  "Git.Git", "OpenJS.NodeJS.LTS", "GitHub.cli", "Microsoft.DotNet.SDK.8", "Microsoft.VisualStudioCode",
  "Anaconda.Miniconda3", "OSGeo.QGIS", "Docker.DockerDesktop"
)
foreach ($p in $pkgs) {
  if ($WhatIf) { Write-Host "would install $p" }
  else { winget install --id $p -e --silent --accept-source-agreements --accept-package-agreements }
}
if (-not $WhatIf) {
  npm i -g @anthropic-ai/claude-code
  conda create -y -n zd -c conda-forge python=3.11 geopandas rasterio shapely pyproj gdal
  foreach ($e in @("ms-python.python","ms-dotnettools.csdevkit","dbaeumer.vscode-eslint","esbenp.prettier-vscode","bradlc.vscode-tailwindcss","expo.vscode-expo-tools","anthropic.claude-code")) { code --install-extension $e }
}
Write-Host "Done. Open a new terminal, run: gh auth login; then in Claude Code: /zaraat-dost:doctor"
