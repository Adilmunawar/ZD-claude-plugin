# Architecture

```
marketplace.json ── lists ──▶ zaraat-dost (bundle, no logic; depends on all modules)
                             ├─ zd-core     hooks (Node) · stack-detect · onboard · handoff · stack-analyst · zd-brief
                             ├─ zd-gis      gis-dashboard-manager · db-analyst · geo-data-qa · study-db · study-dashboard …
                             ├─ zd-vector   vector-engineer · raster-to-polygons (+script) · topology-repair · …
                             ├─ zd-ml       seg-trainer · seg-preflight · train-template · colab-ram-safe · model-card
                             ├─ zd-gee      gee-auth · gee-export · sentinel-composite · ndvi-timeseries · harvest-detect
                             └─ zd-reports  deliverable-memo · harvest-report · layer-metadata
```

Design rules
- **Bundle vs modules**: the bundle carries only setup/help/doctor and a session banner; all capability lives in modules so they can be installed alone and versioned together (`^x.y.z`).
- **Stack-agnostic by discovery, not by assumption**: every agent that touches code runs `stack-detect` and prints a Stack summary before acting. Unknown → ask.
- **Read-only vs write agents** are separate (`db-analyst`, `stack-analyst`, `geo-data-qa` have no Edit/Write tools) so studying is always safe.
- **Guardrails are hooks, not prompts**: destructive commands and secret writes are blocked in code (`zd-core/scripts/*.js`), independent of the model's judgement. Node only, for Windows parity.
- **Commands vs background skills**: `disable-model-invocation: true` = user-invoked slash command; otherwise Claude applies it when relevant. `docs/COMMANDS.md` is generated from the frontmatter so docs never drift.
- **No internal data**: public repo; conventions and domain knowledge only. Project specifics live in each repo's `CLAUDE.md`.
- **Model policy**: `inherit` everywhere except cheap validators on `haiku`.
