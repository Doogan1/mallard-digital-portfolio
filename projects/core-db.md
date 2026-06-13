---
title: Core DB — County Directory Admin
slug: core-db
status: active
year_started: 2026
client: Van Buren County / St. Joseph County
featured: false
stack:
  - Python
  - FastAPI
  - asyncpg
  - React
  - TypeScript
  - Vite
  - Cloud Run
  - Cloud SQL
  - PostgreSQL
summary: >
  Staff-facing admin application for managing 1,000+ personnel, department, and assignment
  records across two counties. Features magic-link auth, a full audit trail with conflict-aware
  undo, and async database access throughout.
---

## What It Does

Core DB is the administrative interface for the county personnel data that powers the County Directory plugin. Staff from Van Buren and St. Joseph Counties use it to maintain the people, department, and assignment records that flow downstream to both counties' public websites via the 15-minute sync.

The data it manages: ~1,000 active personnel records, ~60 departments, and the assignment records that tie them together (a person can hold multiple assignments across departments). This is the authoritative source — changes here propagate to the public directory automatically.

## Authentication: OTP Magic Link

No password database. Authentication works as follows:

1. User submits their email address
2. Server checks the email against `core.people` — the OTP is only issued if the email matches an active record (no account registration flow; access is predicated on being in the directory)
3. A time-limited, HMAC-signed one-time token is generated and emailed via WordPress relay (reusing the county's existing email infrastructure)
4. User clicks the link; server validates the HMAC signature and expiration; issues a signed session cookie
5. Session cookie is validated on every authenticated request

This design means there are no passwords to manage, no password reset flows, and no risk of credential stuffing. The access list *is* the personnel directory.

## Audit Trail

Every PATCH operation writes a before/after JSON snapshot to `ops.audit_log`:

```
audit_log
├── id
├── table_name
├── record_id
├── changed_by (staff email)
├── changed_at
├── before_state (jsonb)
└── after_state (jsonb)
```

The audit log feeds a revert endpoint that implements conflict-aware undo: before reverting a field to its previous value, the endpoint checks whether any intervening edits have occurred since the change being reverted. If another staff member has edited the same record in the meantime, the revert is blocked and the conflict is surfaced to the user — preventing silent overwrites of concurrent edits.

## Async Backend

The FastAPI backend uses `asyncpg` for all database access — no blocking calls on the event loop. Connection pooling is managed at the application level, with pool sizing tuned to the Cloud Run concurrency model (multiple requests handled concurrently per instance rather than one-at-a-time).

This matters in practice because Core DB is a Cloud Run service that scales to zero between uses. Async I/O means the first request after a cold start doesn't block while the database connection pool warms up.

## API Surface

- `POST /auth/request-otp` — issue OTP to verified email
- `GET /auth/verify` — validate OTP, issue session cookie
- `GET /org` — org hierarchy tree
- `GET /people` — people lookup with search/filter params
- `PATCH /people/:id` — audited field update
- `GET /audit-log` — paginated audit history
- `POST /audit-log/:id/revert` — conflict-aware revert
