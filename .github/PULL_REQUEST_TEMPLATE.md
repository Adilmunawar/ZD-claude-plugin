## What
<!-- one paragraph -->

## Checklist
- [ ] No client names, AOI data, DB names or credentials
- [ ] Bumped `version` in the affected plugin's `plugin.json` (and the bundle if behaviour changed)
- [ ] `bash scripts/validate.sh` passes
- [ ] `python3 scripts/gen-docs.py` run; `docs/COMMANDS.md` updated
- [ ] CHANGELOG entry added
- [ ] Tested locally: `/plugin marketplace add ./` → `/plugin install <plugin>@zaraatdost`
