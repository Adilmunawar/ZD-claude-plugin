# @adilmunawar/zd-tools

The standalone commands from [Claude Plugins for Zaraat Dost](https://github.com/Adilmunawar/ZD-claude-plugin), for terminals and CI where Claude Code isn't running. Zero dependencies, Node 18+.

> This package is **not on npmjs.com**. `npm i @adilmunawar/zd-tools` will return 404. Use one of the two methods below.

**Method 1 — release tarball (no account, no token, works everywhere):**
```bash
npm i -g https://github.com/Adilmunawar/ZD-claude-plugin/releases/download/v7.3.2/adilmunawar-zd-tools-7.3.2.tgz
zd-tools --help
```
In CI, one line and no install:
```yaml
- run: npx -y https://github.com/Adilmunawar/ZD-claude-plugin/releases/download/v7.3.2/adilmunawar-zd-tools-7.3.2.tgz secrets-audit . --history
```

**Method 2 — GitHub Packages** (needs a token with `read:packages`, see below):
```bash
npm i -g @adilmunawar/zd-tools
```

```
zd-tools secrets-audit . --history     # exit 1 on findings — use as a CI gate
zd-tools usage week --by project       # Claude Code usage from local transcripts
zd-tools usage all --export ./shared   # CSV for the team report
zd-tools upgrade                       # update the Claude Code toolkit (needs the claude CLI)
```

| Command | Purpose |
|---|---|
| `secrets-audit [dir] [--history] [--json] [--ignore=a,b]` | Find committed keys, tokens and connection strings in the tree and git history |
| `usage [today\|week\|month\|all] [--by project\|model\|day\|week] [--json\|--csv\|--export dir\|--merge dir]` | Token usage and estimated cost; team export/merge |
| `budget-check` | Warning line when `ZD_WEEKLY_TOKEN_BUDGET` is 80 % / 100 % used |
| `upgrade [--dry-run]` | Update marketplace, bundle and every module |
| `guard-bash`, `guard-write` | The hook guards, for custom hook setups (JSON on stdin, exit 2 = block) |

The code is copied verbatim from the plugin modules at publish time, so the package and the plugins never drift. Published to GitHub Packages and attached to every GitHub Release (and to npmjs if an `NPM_TOKEN` secret is ever configured).

## Installing from GitHub Packages
GitHub's npm registry needs a token even for public packages. Once, in `~/.npmrc`:
```
@adilmunawar:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<a GitHub token with read:packages>
```
Then `npx @adilmunawar/zd-tools --help`.

MIT © Zaraat Dost (Pvt.) Limited
