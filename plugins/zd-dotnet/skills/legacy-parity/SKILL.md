---
name: legacy-parity
description: Porting a legacy page or endpoint: reproduce the figure digit-for-digit first, reconcile against production, record known inconsistencies, fix only under a decision. Units, area rules, text-sorted dates and dual-id traps. Apply when rebuilding, reconciling or comparing old and new dashboard behaviour.
paths: ["apps/web/app/**", "apps/api/src/**", "**/KNOWN-GAPS.md", "**/BLUEPRINT*.md"]
---

- **Parity first.** The new figure must equal the legacy figure on the same inputs; reconcile on a frozen snapshot or a named unit/circle/mauza/season and record the counts (rows × fields = 0 diffs, timings before → after).
- **Reproduce, don't silently correct.** A legacy inconsistency (double `/8`, an 8× display gap, a sort that targets the wrong column) is either reproduced and logged in `KNOWN-GAPS.md`, or fixed under a `DECISIONS.md` entry. Never quietly.
- **Units in one place.** Area arrives as square metres or pre-divided values depending on the proc; the `/8` and `/4046.86` rules live in `lib/area.ts` (or its API twin) with a comment saying which procs already applied them. Route-local overrides must say why.
- **Known traps** (see `CONVERSION.md`): tables with two id columns where the FK is the unobvious one; sign-in by CNIC first then username; season filters as first-year prefix `LIKE`s; dates stored as text and sorted as text; numerics stored as nvarchar; vendor scoping by `VendorId` not role; procs that return one row for a list.
- **Exports**: legacy client-side Excel/PDF is not rebuilt without a decision; CSV with identical columns is the default; server-generated reports stay server-generated.
- **Not verified against a running API** is a legitimate status — say it in the gap entry rather than implying a live check.
