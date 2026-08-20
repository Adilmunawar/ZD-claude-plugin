---
name: aws-plan
disable-model-invocation: true
argument-hint: "[service|all]"
description: AWS architecture, IaC skeleton, migration steps and cost estimate into docs/AWS-PLAN.md.
---

1. Confirm scope: which services (dashboard, backend, .NET API, pipeline jobs, database, storage), expected traffic, data volume, region (default `ap-south-1`), compliance constraints.
2. Map each service to the AWS profile in `deploy-profiles`; choose Fargate vs EC2 vs Lambda per service with one sentence of justification.
3. Draw a Mermaid diagram (VPC, subnets, ALB, ECS services, RDS, S3, CloudFront, Secrets Manager, CloudWatch).
4. IaC skeleton: `infra/` layout (Terraform modules or CDK stacks), state backend, environments.
5. Migration plan from the current hosts (Firebase App Hosting/Vercel, HF Spaces, current API host): order, DNS cutover, data copy (S3 sync, `pg_dump`/`pg_restore` with PostGIS), rollback.
6. Monthly cost estimate table per service with assumptions.
7. Security checklist: IAM least privilege, private subnets, encryption at rest, secrets, WAF on ALB, backups and retention.
Write `docs/AWS-PLAN.md`; do not create AWS resources in this step.
