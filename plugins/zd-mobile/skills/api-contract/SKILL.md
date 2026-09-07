---
name: api-contract
paths: ["src/lib/api/**", "**/FarmerFacilitator.Api/**"]
description: Envelope and DTO contract between the Expo app and the .NET farmer API: success from body, verbatim field names, refresh, error mapping, parity checks.
---

Envelope: `{ status, code, success, message, data }`. Success is read from `success` in the body, not the HTTP status. Session responses also carry `accessToken`/`refreshToken` at top level.

- `unwrap()` throws `ApiError(status, message)` when `success` is false; screens never parse envelopes themselves.
- Field names mirror the server verbatim, including inconsistencies (`fullNamePerCNIC`, `accountNumberIBAN`, `sugarcaneArea`); renaming on the client is how contracts drift.
- Base URL must include the API version path segment; the bare path on the same host serves a legacy HTML login page and must be treated as "server unreachable".
- Refresh: on 401 with a refresh token, refresh once and retry; on failure clear tokens and sign out.
- Contract check: `/zd-dotnet:contract-check <mobile-repo> <api-repo>` diffs `endpoints.ts` types against the .NET DTOs both ways; the server's `MobileCompatibilityTests` pin them. When the .NET repo is not available, diff the TS types against the server's OpenAPI JSON.
- Uploads: multipart with field names the server expects; document size and type limits in the client.
