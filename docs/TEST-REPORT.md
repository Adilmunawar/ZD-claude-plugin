# Test report

Scope: every way a person can obtain, install, verify, run, upgrade and uninstall this toolkit. Executed against the **published repository and releases**, from empty user profiles, not against a local working copy.

- Date: 2026-09-06
- Version under test: **7.3.2**
- Environment: Ubuntu 24, Node 22.22, Claude Code CLI 2.1.261, npm 11
- Cross-platform: GitHub Actions matrix on `windows-latest` and `macos-latest` (Node tests, package build, PowerShell syntax) — green
- Real Windows machine: Windows 11, PowerShell 5.1, Node 22.11, Claude Code 2.1.226

## 1. Installation

| # | Path | Method | Result |
|---|---|---|---|
| 1a | Claude Code, HTTPS marketplace URL | `claude plugin marketplace add https://github.com/Adilmunawar/ZD-claude-plugin.git` | pass |
| 1b | Bundle install | `claude plugin install zaraat-dost@zaraatdost` | pass — bundle + 14 dependencies |
| 1c | Component count | `claude plugin list` | 15 plugins, all enabled |
| 1d | Versions aligned | `claude plugin list` | 15/15 at 7.3.2 |
| 1e | Single module | `claude plugin install zd-vector@zaraatdost` | pass |
| 1f | Shell installer from raw URL | `bash <(curl -fsSL …/install.sh)` | pass — 15 plugins |
| 1g | Installer with module argument | `install.sh zd-gis` | pass |
| 1h | Offline / air-gapped | release zip → `claude plugin marketplace add ./ZD-claude-plugin-7.3.2` → install | pass |
| 1i | Windows PowerShell one-liner | `irm …/install.ps1 \| iex` on the real machine | pass after two fixes (see §6) |

## 2. Upgrade

| # | Scenario | Result |
|---|---|---|
| 2a | Fresh install pinned at 7.2.0 (git tag as marketplace) | 15/15 at 7.2.0 |
| 2b | Session-start update check against the live repository | announces "7.3.2 is available" |
| 2c | `upgrade.js` (what `/zaraat-dost:upgrade` runs) | 15/15 moved to 7.3.2, including a module that did not exist in the older release |

## 3. npm package `@adilmunawar/zd-tools`

| # | Check | Result |
|---|---|---|
| 3a | Install from the release tarball URL (no registry, no token) | pass |
| 3b | `zd-tools --version` / `--help` | pass |
| 3c | `secrets-audit` on a clean directory | pass (exit 0) |
| 3d | `guard-bash` blocks `DROP TABLE` | exit 2 |
| 3e | `guard-bash` allows `git status` | exit 0 |
| 3f | `usage` with no transcripts present | pass (empty table, exit 0) |
| 3g | `npx -y <tarball-url> secrets-audit` (CI one-liner) | pass |
| 3h | Installing the scoped name from npmjs (`npm i` @-scoped name) | **404 by design** — the package is on GitHub Packages, not npmjs. Documented in the README, the package README and the troubleshooting table; a test now fails if any document implies otherwise |

## 4. Module inventory (read back from the CLI after install)

| Module | Skills | Agents | Hooks |
|---|---|---|---|
| zaraat-dost | 6 | 0 | 1 |
| zd-core | 4 | 1 | 2 |
| zd-gis | 7 | 3 | 0 |
| zd-vector | 5 | 1 | 0 |
| zd-models | 6 | 1 | 0 |
| zd-ml | 4 | 1 | 0 |
| zd-gee | 5 | 0 | 0 |
| zd-agis | 7 | 1 | 0 |
| zd-mobile | 4 | 1 | 0 |
| zd-deploy | 4 | 1 | 0 |
| zd-quality | 6 | 1 | 0 |
| zd-security | 3 | 1 | 0 |
| zd-ops | 5 | 0 | 0 |
| zd-usage | 4 | 0 | 2 |
| zd-reports | 3 | 0 | 0 |
| **total** | **73 (41 commands, 32 background skills)** | **12** | **5** |

No module reported a parse or load error. Always-on context for the full bundle: **3,138 tokens**.

## 5. Hooks, executed the way Claude Code executes them

Each hook was run from the installed cache directory with `CLAUDE_PLUGIN_ROOT` set and the hook JSON on stdin, through `sh -c` exactly as the harness does.

| Hook | Input | Expected | Result |
|---|---|---|---|
| guard-bash | `DROP TABLE` | block | exit 2 |
| guard-bash | `rm -rf ~` | block | exit 2 |
| guard-bash | `git push --force` | block | exit 2 |
| guard-bash | `dotnet ef database drop` | block | exit 2 |
| guard-bash | `npm run build` | allow | exit 0 |
| guard-write | PEM private key | block | exit 2 |
| guard-write | `.env` | block | exit 2 |
| guard-write | `.env.example` | allow | exit 0 |
| guard-write | `os.environ["HF_TOKEN"]` | allow | exit 0 |
| after-write | `parcels.gpkg` | remind | exit 0, message printed |
| welcome (SessionStart) | — | banner | exit 0 |
| check-update (SessionStart) | — | never blocks | exit 0 online and offline |
| session-ledger (SessionEnd) | no transcript | no-op | exit 0 |
| budget-check (SessionStart) | no budget set | silent | exit 0 |
| guard-bash | malformed input (`not json`) | never crash | exit 0 |

## 6. Defects found and fixed

Every one of these was found by running the real paths; each now has a regression test.

| # | Defect | Found by | Fix | Guard |
|---|---|---|---|---|
| 1 | `secrets-audit --history` ignored `--ignore`, so test fixtures failed CI | GitHub Actions | `--ignore` applied to history paths | unit test |
| 2 | `node --test "tests/*.test.js"` needs Node 22's glob; CI ran Node 20 | GitHub Actions | shell glob; CI on Node 22 | CI |
| 3 | Release workflow rejected two-part tags (`v7.2`) | GitHub Actions | tag normalised to `X.Y.0` | release run |
| 4 | `install.ps1` called `exit`, closing the PowerShell window under `irm \| iex` and hiding the error | real Windows machine | rewritten without `exit`; step-by-step output | structure test |
| 5 | `owner/repo` marketplace shorthand resolved to SSH where `gh` had selected SSH; failed without keys | real Windows machine | HTTPS URL in installers, README, templates | structure test |
| 6 | `claude plugin install --yes` does not exist before Claude Code ~2.1.23x | real Windows machine | flag removed everywhere | structure test |
| 7 | Documentation implied `npx @adilmunawar/zd-tools` works from npmjs; it is published to GitHub Packages | real Windows machine | release-tarball command shown first; the 404 explained | structure test |
| 8 | `upgrade.js` read the dependency list before updating the bundle, so a newly added module was skipped | release simulation | re-reads the new manifest and installs missing modules | live upgrade test |

## 7. Not covered here

- **Skill and agent output quality.** Structure, loading and invocation are verified; what an agent *says* on a real repository is reviewed by hand and is the reason for the pilot rollout.
- **GitHub Packages install** could not be exercised from the test sandbox (its egress allow-list blocks `npm.pkg.github.com`). The package is published and public; the registry-free tarball path is tested instead and is the documented default.
- **Real AWS deployment.** `zd-deploy`'s AWS profile is a target design; nothing in the repository provisions cloud resources.

## How to re-run this

```bash
bash scripts/validate.sh          # manifests, hook syntax, 19 node tests, 8 structure tests, docs drift, official validator
claude plugin validate .          # official validator, all 15 plugins
```
The install, upgrade and package matrices in §1–§3 are shell steps against the published release; they are reproduced in this document rather than scripted, because they must run from empty user profiles.
