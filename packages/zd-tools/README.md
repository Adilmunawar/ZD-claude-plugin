# @adilmunawar/zd-tools

The standalone commands from [Claude Plugins for Zaraat Dost](https://github.com/Adilmunawar/ZD-claude-plugin), for terminals and CI where Claude Code isn't running. Zero dependencies, Node 18+.

```
npx @adilmunawar/zd-tools secrets-audit . --history     # exit 1 on findings — use as a CI gate
npx @adilmunawar/zd-tools usage week --by project       # Claude Code usage from local transcripts
npx @adilmunawar/zd-tools usage all --export ./shared   # CSV for the team report
npx @adilmunawar/zd-tools upgrade                       # update the Claude Code toolkit (needs the claude CLI)
```

| Command | Purpose |
|---|---|
| `secrets-audit [dir] [--history] [--json] [--ignore=a,b]` | Find committed keys, tokens and connection strings in the tree and git history |
| `usage [today\|week\|month\|all] [--by project\|model\|day\|week] [--json\|--csv\|--export dir\|--merge dir]` | Token usage and estimated cost; team export/merge |
| `budget-check` | Warning line when `ZD_WEEKLY_TOKEN_BUDGET` is 80 % / 100 % used |
| `upgrade [--dry-run]` | Update marketplace, bundle and every module |
| `guard-bash`, `guard-write` | The hook guards, for custom hook setups (JSON on stdin, exit 2 = block) |

The code is copied verbatim from the plugin modules at publish time, so the package and the plugins never drift. Published to GitHub Packages on every release (and to npmjs when an `NPM_TOKEN` secret is configured).

## Installing from GitHub Packages
GitHub's npm registry needs a token even for public packages. Once, in `~/.npmrc`:
```
@adilmunawar:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<a GitHub token with read:packages>
```
Then `npx @adilmunawar/zd-tools --help`.

MIT © Zaraat Dost (Pvt.) Limited
