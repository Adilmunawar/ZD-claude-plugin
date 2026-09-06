# Changelog

All notable changes to this repository are documented here. Versions follow semantic versioning; the bundle and all modules share one version.

## 7.3.3 — 2026-09-06

Fixed
- The release workflow failed to parse (the `secrets` context is not usable in a step `if`, and an indented heredoc corrupted the YAML), so a tag produced a red run with no jobs. Both are fixed and a test now parses every workflow, checks each `run` block with `bash -n`, and rejects `secrets.` in `if`.

Changed
- Release pipeline hardened: the tag is checked against every manifest (not just the bundle), a matching `CHANGELOG.md` section is required, the full validation and a credentials audit run first, and both release assets are **verified before publishing** — the archive must pass `claude plugin validate` and the package tarball must install and execute. Publishing is idempotent, so re-tagging never fails a release.
- Release notes now include install commands for Claude Code, the standalone CLI and offline use.
- `scripts/release.sh` prepares a release in one command: bumps every manifest, checks the changelog, regenerates the command reference and runs the full validation.

## 7.3.2 — 2026-09-06

Fixed
- Installers and the upgrade script no longer pass `--yes` to `claude plugin`; the flag does not exist in Claude Code 2.1.226 and earlier and is not needed for this marketplace. A test guards it.

## 7.3.1 — 2026-09-06

Fixed
- `install.ps1` no longer calls `exit`, which closed the PowerShell window when run via `irm … | iex` and hid the error; each step now reports `[ok]`/`[x]`.
- Installers, README, templates and the bundle README use the HTTPS repository URL; `owner/repo` shorthand resolved to SSH on machines where `gh` had chosen SSH, and failed without keys.
- Installers warn when Claude Code is older than 2.1.110 (dependency auto-install).
- `usage-report` shows readable project names for Windows-encoded transcript directories.

Added
- CI now runs the Node tests, the package build and the PowerShell syntax check on Windows and macOS as well as Linux.
- Structure tests that fail if shorthand marketplace sources, `exit` in the PowerShell installer, or unquoted `${CLAUDE_PLUGIN_ROOT}` paths ever return.

## 7.3.0 — 2026-09-06

Added
- npm package `@adilmunawar/zd-tools` (`packages/zd-tools`): `secrets-audit`, `usage`, `budget-check`, `upgrade`, `guard-bash`, `guard-write` runnable with `npx` in terminals and CI without Claude Code. Zero dependencies; built from the plugin scripts at publish time so it cannot drift.
- Release workflow now validates, publishes the package to GitHub Packages (and npmjs when `NPM_TOKEN` is set), and attaches the marketplace archive, package tarball and SHA-256 sums to the GitHub Release for offline installs.
- README: Zaraat Dost logo (theme-aware), Claude Code badge, six use-case walkthroughs, dependency map, FAQ.

## 7.2.0 — 2026-09-06

Changed
- Version scheme moves to 7.x (tag `v7.2` or `v7.2.0`); no functional change from 0.7.0 other than the fixes below.

Fixed
- `secrets-audit --history` now honours `--ignore`, so test fixtures in git history no longer fail CI.
- Release workflow accepts two-part tags (`v7.2` → 7.2.0); validate workflow checks out full history for the audit.

## 0.7.0 — 2026-09-05

Added
- `zd-usage`: private usage monitoring from Claude Code transcripts — `/zd-usage:report` (by project/model/day/week, today/week/month/range, JSON/CSV/export), `/zd-usage:budget` (weekly token budget with 80 %/100 % session-start warnings), `/zd-usage:team-report` (merge exported CSVs), `usage-hygiene` skill, SessionEnd ledger hook. Four tests with synthetic transcripts.
- `docs/USAGE.md`: where usage is visible (`/usage`, `/context`, `/skill-doctor`), how to keep sessions cheap, a weekly routine.

Changed
- Every skill and agent description trimmed (2,623 → ~1,300 words) to reduce always-on context; `effort: low` on trivial commands.

## 0.6.0 — 2026-09-05

Changed
- Every command skill declares `argument-hint`; commands that take input read `$ARGUMENTS`.
- Product-specific background skills declare `paths` so they load when matching files are touched.
- Report-style commands run with `context: fork` and least-privilege `allowed-tools`, keeping the main conversation clean.
- Repository applies its own standards: `.editorconfig`, `.gitattributes`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, Dependabot for Actions.
- `docs/COMMANDS.md` now shows argument hints, forked commands and path-activated skills.
- README rewritten for faster reading; per-module detail moved to module READMEs.

## 0.5.0 — 2026-09-05

Added
- Bundle `scripts/upgrade.js`: updates marketplace, bundle and every module (Claude Code updates one plugin per command; verified in a release simulation). Installers accept `--source` for forks and local testing. `docs/VERIFICATION.md` records the real-CLI test run.
- `zd-quality`: `code-reviewer` agent, review standards per stack, conventional commits, `/pr-description`, `/changelog`, `/adr`, `/tech-debt`.
- `zd-security`: `security-reviewer` agent, security checklist, `/dependency-audit`, `/harden-repo` with baseline templates (SECURITY.md, Dependabot, secrets-scan workflow, .gitignore additions).
- `zd-ops`: `/incident`, `/postmortem`, `/runbook`, `/oncall-handoff`, observability conventions.
- Bundle: `/zaraat-dost:upgrade`, `/zaraat-dost:workstation` with Windows and macOS/Linux setup scripts, `/zaraat-dost:standards`; daily update check at session start (`scripts/check-update.js`, offline-safe, tested).
- Templates: `managed-settings.json` for machine-wide policy, `repo-standards/` (.editorconfig, .gitattributes, pre-commit, VS Code, PR template, code of conduct).
- Docs: `GOVERNANCE.md` (per-repo, per-machine, account-level rollout; update policy), `UPGRADING.md` (migration notes per version).

## 0.4.0 — 2026-09-05

Added
- `zd-models`: end-to-end cadastral and land-use pipeline (boundary inference, spectral features, classification, sub-parcelling, SAM2) with a `pipeline-engineer` agent and `/zd-models:script-to-package`.
- `zd-agis`: conventions and tooling for the Next.js/Firebase/Earth Engine dashboard, Pyodide workers and the Hugging Face Spaces inference backend; `/zd-agis:new-tool`, `/zd-agis:audit`.
- `zd-mobile`: Expo/React Native farmer-app rules, API envelope contract, `/zd-mobile:i18n-parity`, `/zd-mobile:release-checklist`.
- `zd-deploy`: local vs cloud profiles (Firebase App Hosting, Vercel, HF Spaces, EAS, Docker, AWS), `/zd-deploy:preflight`, `/zd-deploy:dockerize`, `/zd-deploy:aws-plan`.
- `zd-core`: `/zd-core:secrets-audit` and `scripts/secrets-audit.js` (working tree + git history, CI exit code); shared credential patterns; write guard now detects Hugging Face, GitHub, AWS, Google and generic API keys, connection strings and PEM blocks with placeholder suppression.
- Tests: `tests/hooks.test.js`, `tests/secrets-audit.test.js` (Node test runner) and `tests/test_repo.py` (structure, versions, dependency resolution, no internal secrets). CI runs them and audits the repository itself.

Changed
- `zd-vector`: `straighten-edges` now documents the junction-graph deviation method; `topology-repair` adds raster-side gap and hole filling.
- Module dependencies declared (`zd-models` → zd-vector, zd-gee, zd-ml; `zd-agis` → zd-gee; `zd-deploy` → zd-core).
- Documentation rewritten in a consistent voice; command reference generated from sources.

## 0.3.0 — 2026-09-05
- One-line install bundle, installers, help/doctor/setup, docs and release workflow.

## 0.2.0 — 2026-09-04
- Modules zd-core, zd-gis, zd-vector, zd-ml, zd-gee, zd-reports.

## 0.1.0 — 2026-09-04
- Initial zd-gis plugin and marketplace scaffold.
