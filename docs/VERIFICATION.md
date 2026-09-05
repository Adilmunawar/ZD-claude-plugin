# Verification log

Run before each release against a clean environment. Last run: 2026-09-06 (v7.3.1), Claude Code 2.1.261, Node 22, Ubuntu 24.

| Step | Command | Result |
|---|---|---|
| Static validation | `bash scripts/validate.sh` | manifests ok, hook syntax ok, 17 node tests pass, python structure tests pass, docs current |
| Official validator | `claude plugin validate .` and per plugin | 16/16 passed |
| Marketplace add | `claude plugin marketplace add ./ZD-claude-plugin` | added as `zaraatdost` |
| Bundle install | `claude plugin install zaraat-dost@zaraatdost --scope user` | installed + 14 dependencies |
| Inventory | `claude plugin details <plugin>@zaraatdost` ×14 | all skills, agents and hooks listed; always-on ≈ 4.9k tokens total |
| Hook execution | JSON on stdin via `sh -c "<hook command>"` with `CLAUDE_PLUGIN_ROOT` set to the cache path | `TRUNCATE` blocked (exit 2), PEM key write blocked (exit 2), env-var reference allowed (exit 0), SessionStart banner printed, update check exits 0 with and without network |
| Release simulation | bump all manifests → `marketplace update` → `scripts/upgrade.js` | bundle and 13 modules moved together (0.5.0 → 0.5.1 in the first run, 0.5.0 → 0.6.0 in the second) |
| New-dependency upgrade | bundle 0.6.0 installed without zd-usage → `scripts/upgrade.js` against the 0.7.0 marketplace | bundle updated, zd-usage installed, all 15 plugins at 0.7.0 |
| Usage hooks | SessionStart budget check and SessionEnd ledger run from the cache with hook JSON on stdin | exit 0, ledger written when a transcript exists, silent otherwise |
| Context cost | sum of `details` always-on figures | 4,960 → 3,138 tokens after description trimming (−37 %), zd-usage included |
| Frontmatter extensions | `argument-hint`, `context: fork`, `allowed-tools`, `paths` on the relevant skills | accepted by the validator and listed by `details`; `details` does not model `paths` activation, so the context saving is confirmed only via `/context` in a live session |
| Secrets audit | `node plugins/zd-core/scripts/secrets-audit.js . --history --ignore=tests` | no findings |
| npm package |  in packages/zd-tools, install the tarball into a temp project, run every subcommand via  | version, help, secrets-audit, usage, upgrade --dry-run, guard-bash exit 2 all correct |
| Cross-platform CI | GitHub Actions matrix: Node tests, package build and PowerShell syntax on windows-latest and macos-latest | see the validate workflow badge |
| Real Windows machine |  installer, HTTPS marketplace add, bundle install | passed after fixing the -under-iex and SSH-shorthand issues found there |
| Installer | `bash install.sh --source ./ZD-claude-plugin` on a clean profile | marketplace added, bundle installed |

Not covered here (needs an authenticated session): skill invocation output quality, agent behaviour. Those are reviewed manually on each module change.
