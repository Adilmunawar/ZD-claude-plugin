---
name: deploy-profiles
description: How each service runs locally and in the cloud (Firebase App Hosting, Vercel, Hugging Face Spaces, EAS, Docker, AWS) with commands, config, env sources, health checks, rollback. Apply to deploy, hosting, environment or AWS tasks.
---

| Service | Local | Cloud | Config | Env source | Health |
|---|---|---|---|---|---|
| Next.js dashboard | `npm run dev` (port 9002) | Firebase App Hosting (`apphosting.yaml`, `firebase deploy`) or Vercel (`vercel --prod`) | `next.config.js`, `apphosting.yaml` | App Hosting secrets / Vercel env (server: `EE_BASE64_KEY`, `HF_SPACE_URL`, `HF_TOKEN`; client: `NEXT_PUBLIC_FIREBASE_*`) | `GET /` 200 + `/api/gee/tiles` 200 |
| Firestore/Storage | Emulator suite (`firebase emulators:start`) | Firebase | `firestore.rules`, `cors.json` | — | rules deploy dry-run |
| Flask inference backend | `docker compose up backend` | Hugging Face Space (Docker SDK, `git push` to the Space) or any Docker host | `Dockerfile`, `requirements.txt` | Space secrets / container env (`HF_TOKEN`, `EE_BASE64_KEY`) | `GET /health` < 1 s |
| .NET API (FarmerFacilitator) | `dotnet run` / `docker compose up api` | VM or AWS (see below) | `appsettings.{Env}.json`, `Dockerfile` | user-secrets locally; AWS SSM Parameter Store / Secrets Manager in cloud | `GET /health` + one enveloped endpoint |
| Expo app | `npx expo start` | EAS Build (`eas build -p android --profile production`), EAS Update for OTA | `eas.json`, `app.json` | `EXPO_PUBLIC_API_BASE` at build time | `npm run check-bundle` |
| Pipeline scripts | conda env + GPU | GPU VM / Colab / EC2 g-instance | script constants | `.env` loaded by `python-dotenv` | dry-run prints plan |

AWS profile (when a service moves to AWS)
- **Compute**: containers on ECS Fargate behind an ALB (stateless web/API), or EC2 for GPU jobs. One task definition per service; image in ECR tagged with git SHA.
- **Data**: RDS PostgreSQL with PostGIS for spatial tables; S3 for imagery, tiles, model outputs and deliverables (versioned bucket, lifecycle to IA after 90 days); CloudFront in front of S3 for tile serving.
- **Secrets**: SSM Parameter Store (SecureString) or Secrets Manager; tasks read them via task role, never baked into images.
- **Network**: private subnets for RDS and tasks; ALB in public subnets; security groups per service.
- **IaC**: Terraform or AWS CDK in `infra/` with `dev` and `prod` stacks; no console-only resources.
- **Local parity**: `docker-compose.yml` with the same images and env names; LocalStack optional for S3.
- **Observability**: CloudWatch logs per task, an alarm on 5xx and on task restarts, a dashboard with request rate and latency.

Rollback: App Hosting/Vercel → redeploy previous build; ECS → update service to previous task definition revision; Space → `git revert` + push; EAS → previous update channel rollback; database migrations → only additive in the same release as code that tolerates both schemas.
