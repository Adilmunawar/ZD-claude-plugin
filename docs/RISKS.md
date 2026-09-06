# Known risks and how each is contained

An honest list of what can still go wrong, what protects against it today, and what to do if it happens. Reviewed at every release.

## Live, with a guard

| Risk | Blast radius | Guard | If it happens |
|---|---|---|---|
| A guard hook blocks a command you legitimately need | annoyance, one command | Guards only block; they never run anything | Run it yourself in a terminal, or disable per project with `/hooks` |
| A convention doesn't fit one project (CRS, schema, naming) | wrong suggestion in one repo | Project `CLAUDE.md` overrides plugin skills | Put the project's rule in its `CLAUDE.md`, or disable that module for the repo |
| An agent with `permissionMode: acceptEdits` edits more than expected | uncommitted files in one repo | Bash still asks; agents are scoped | Work on a branch, review `git diff`, set `default` in a fork |
| A stale pinned download URL in the docs after a release | a user gets a 404 | `scripts/release.sh` rewrites them; a test fails if any is stale | Run `bash scripts/release.sh <version>` and push |
| Someone tags without bumping the manifests | no release published | The release workflow checks the tag against **every** manifest and requires a changelog section | Fix the version, delete and re-push the tag |
| A workflow file stops parsing | red run with no jobs | A test parses every workflow, `bash -n`s each `run`, and rejects the `secrets` context in `if` | `bash scripts/ci-local.sh` before pushing |
| A release publishes a broken asset | users install something that doesn't work | CI builds the archive and tarball, then **verifies** the archive passes `claude plugin validate` and the tarball installs and executes, before publishing | The release fails; nothing is published |
| A credential is committed | serious | `guard-write` blocks it at write time; `secrets-audit --history` runs in CI on every push | Rotate first, remove second, purge history third — `/zd-core:secrets-audit` walks it |

## Live, accepted

| Risk | Why it is accepted | Mitigation |
|---|---|---|
| **Agent and skill output quality is unproven in the field** | Structure, loading and invocation are tested; what an agent *says* on a real repository cannot be asserted in CI | Pilot with two engineers on branches; fix wrong instructions as one-line PRs |
| `raw.githubusercontent.com` is contacted once a day by the update check | If GitHub is down or blocked, nothing breaks | 3-second timeout, cached, silent on failure, exit 0 always |
| The package is on GitHub Packages, not npmjs | Publishing to npmjs needs an account and an `NPM_TOKEN` secret | The documented install is the release tarball URL, which needs neither. Add the secret and the workflow publishes to npmjs too |
| Cost estimates in `/zd-usage:report` use a public price table | Prices change and are not exposed by any API | Unknown models show `n/a`; override with `ZD_PRICING_FILE`; plan limits come from the built-in `/usage` |
| Claude Code changes plugin behaviour in a future release | Out of our control | Pin nothing; CI runs `claude plugin validate` with the latest CLI on every push, so a breaking change shows up as a red build, not a user report |
| Older Claude Code versions lack features the toolkit assumes | Seen once with `--yes` and dependency resolution | Installers warn below 2.1.110; nothing uses flags that older versions lack |
| A dependency of an npm-published action changes | Supply chain | Dependabot updates actions monthly; every PR must pass CI before merge |
| ~3k tokens of context per session | Less room in very long sessions | Install only the modules a repo needs; product skills activate on matching paths; `/context` shows what is loaded |

## Not covered by anything here

- **AWS**: `zd-deploy`'s AWS profile is a target design. Nothing in this repository provisions or touches cloud resources.
- **The .NET farmer API**: described from the mobile client's side of the contract only. Give the toolkit that repository and the contract can be checked from both ends.
- **Data**: no module reads, moves or deletes production data on its own. Anything that would is behind an explicit command and, for destructive operations, a guard.

## Standing advice

1. Take a database backup before pointing any tool at production for the first time — this one included.
2. Run `bash scripts/ci-local.sh` before pushing and `bash scripts/release.sh X.Y.Z` before tagging.
3. Treat a red CI run as information, not noise: the checks exist to catch exactly the classes of defect listed above.
