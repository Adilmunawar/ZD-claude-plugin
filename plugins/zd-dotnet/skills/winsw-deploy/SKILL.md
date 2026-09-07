---
name: winsw-deploy
description: Deploying the dashboard as Windows services on the existing EC2 host — self-contained publish, package without local settings, stop/rename/swap/start with a health check and automatic rollback, YARP gateway on the public port. Apply to deploy, package, update, rollback or service questions for the .NET stack.
paths: ["tools/deploy/**", "**/DEPLOYMENT.md", "**/*.ps1", "**/winsw*"]
---

Shape: three WinSW-wrapped services beside the untouched legacy stack — `<Product>Api` (self-contained win-x64, loopback port), `<Product>Web` (Next standalone under a bundled node.exe, loopback), `<Product>Gateway` (YARP, TLS from the host cert store, the one public port). DB over loopback. One origin for web and `/api/v1`, so CORS stays empty.

Update, never reinstall
1. `tools/deploy/package.ps1`: publish both .NET projects self-contained; `next build` with `NEXT_PUBLIC_API_BASE` baked; **grep the package for `appsettings.Local.json` and fail if present** (publish copies it); package with `robocopy` + `tar.exe` (Next's standalone tree exceeds MAX_PATH for `Copy-Item`/`Compress-Archive`).
2. On the server `update.ps1`: stop Gateway → Web → Api; rename `api`/`gateway`/`web` to `*.bak-<stamp>`; move new folders in; copy the preserved `api\appsettings.Local.json` back; start Api → Web → Gateway; health check; **roll back to the `.bak` folders if the health check fails**.
3. `install.ps1` is first-install only (aborts if ports are taken or the cert is missing; never stops anything). `uninstall.ps1` removes only the three services and the firewall rule.

Checks: ports free/owned as expected, cert present in the store, firewall + security group for the public port, forwarded-headers middleware on, logs under the service root, health endpoint answering before the swap is declared done. Record the package builder and date in `DEPLOYMENT.md`.
