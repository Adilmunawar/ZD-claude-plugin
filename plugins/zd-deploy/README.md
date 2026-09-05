# zd-deploy

| Component | Type | Purpose |
|---|---|---|
| `release-engineer` | agent | Pre-flight → deploy → verify → rollback note, with approval gates |
| `deploy-profiles` | skill | Local vs cloud per service: Firebase App Hosting, Vercel, HF Spaces, EAS, Docker, AWS |
| `/zd-deploy:preflight` | command | Pre-deployment checklist |
| `/zd-deploy:dockerize` | command | Production Dockerfile + compose |
| `/zd-deploy:aws-plan` | command | AWS architecture, IaC skeleton, migration and cost plan |

Depends on zd-core (secrets audit and guards).
