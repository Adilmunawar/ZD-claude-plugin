---
name: gee-auth
description: Google Earth Engine authentication and project setup patterns (service account key file in Colab/servers, interactive auth on laptops, quota/project selection). Apply whenever code calls ee.Initialize or a GEE call fails with auth/permission errors.
---

- Servers/Colab: service-account JSON (`gee.json`) referenced by env var `GEE_KEY_FILE`; `ee.ServiceAccountCredentials(email, key_file)` → `ee.Initialize(creds, project=PROJECT)`. Never commit or print the file (zd-core hooks refuse to write it).
- Laptops: `ee.Authenticate()` once, then `ee.Initialize(project=...)`. `project` is mandatory on new accounts.
- Errors: `PERMISSION_DENIED` → service account not added to the project / EE not enabled; `Not signed up` → account needs EE registration; `quota exceeded` → add `ee.data.setDeadline` and reduce concurrent tasks.
- Put the init in one `gee_init()` helper used by every script; test with `ee.Number(1).getInfo()`.
