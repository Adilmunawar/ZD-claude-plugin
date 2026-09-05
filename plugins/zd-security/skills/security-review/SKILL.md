---
name: security-review
description: Application security checklist: auth and session, authorisation and Firestore rules, input validation, secrets, PII exposure, dependencies, infra and CI. Apply during any security review.
---

Authentication and session
- Firebase Auth required on all cadastral collections; token refresh handled; sign-out on real 401 only. Expo tokens in secure store, session horizon enforced, device lock on.
- .NET: JWT lifetime and refresh rotation; password hashing (ASP.NET Identity or Argon2/bcrypt); OTP rate limits and expiry; lockout after repeated failures.

Authorisation
- Firestore rules: default deny; per-user paths owner-only; shared collections validated on write; no `allow read: if true`.
- API: object-level checks (a farmer sees only their applications/land); admin routes behind roles; no IDOR on numeric ids.

Input validation
- API routes and Flask endpoints validate body/shape/size; geometry vertex caps; file uploads: type, size, filename sanitised, stored outside the web root; zip-bomb protection on parcel zips.

Secrets and config
- `/zd-core:secrets-audit` clean; server secrets not `NEXT_PUBLIC_`; Space/App Hosting/Vercel secrets set; service-account key rotated after any exposure; least-privilege IAM (Earth Engine read/export only).

Data exposure
- CNIC masked by default; logs never contain response bodies, tokens or PII; error responses without stack traces; Storage URLs not guessable or signed with expiry.

Dependencies
- `npm audit --omit=dev`, `pip-audit`, `dotnet list package --vulnerable`; pin major versions; Dependabot enabled.

Infrastructure and CI
- HTTPS only with the correct certificate chain (custom CA pinned in the app if used); CORS restricted; branch protection on `main` (PR + CI + review); GitHub secret scanning and push protection on; Actions pinned to versions.
