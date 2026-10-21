---
title: Vibby — Website Operations Automation
slug: vibby
status: development
year_started: 2026
client: DICE / Van Buren County / St. Joseph County
featured: true
stack:
  - Python
  - Django
  - PostgreSQL
  - Claude API
  - WordPress
  - PHP 8
  - Cloud Run
  - Cloud SQL
  - Cloudflare R2
  - Docker
  - GitHub Actions
  - Linear API
summary: >
  An AI-assisted website operations platform that turns maintenance requests into structured
  plans, requires human approval of the exact plan version, and executes and verifies
  constrained WordPress actions. The notice workflow is proven on staging; email intake
  and document accessibility integration are next.
---

## From Website Requests to Reviewable Actions

County website maintenance is a steady stream of small but consequential requests: replace a meeting packet, correct a contact number, post an office closure, or publish an accessible document. Each request requires interpreting the intent, finding the right destination, making the change, and checking the public result.

I am building **Vibby** to turn that work into a structured, auditable workflow. A review of 260 issues across the Van Buren and St. Joseph County website projects helped identify recurring document publishing, page editing, and maintenance patterns. That review informed the scope; it is not a measure of work already automated.

## The Working Loop

The first implemented website action is **creating a temporary notice**. A request submitted through the intake API moves through:

1. **Planning:** a Claude-powered planner reads relevant public website content and proposes actions with typed parameters.
2. **Review:** the proposed plan appears in Linear, where a person reviews the target site, content, and intended changes.
3. **Approval:** an explicit workflow transition approves that specific plan version. Editing the plan invalidates the earlier approval.
4. **Execution:** a background worker sends approved actions to a purpose-built WordPress REST plugin.
5. **Verification:** the system checks the result, records execution details, and updates the Linear issue with completion or failure information.

The end-to-end loop was first proven locally with a deterministic planner, then extended to a real LLM planner and staging smoke test. The staging deployment supports creating notices on designated pages. The email-drafting action also produces suggested forwarding text for a person to send.

## An Agent with Constrained Tools

The planner can search public pages, read page content, and look up departments and staff through the website provider. Staff lookups use the site's public content, keeping visibility rules at the website boundary.

Reads can happen during planning; mutations require approval. The model proposes actions from a registry of supported operations, with schemas validated before execution. The WordPress provider exposes those operations through authenticated REST endpoints rather than giving the agent shell access or unrestricted database writes.

Provider requests are signed, timestamped, and protected against replay. Execution records and idempotency checks support retries without repeating a completed action. Audit events connect requests, plan versions, approvals, reads, and execution attempts.

## Architecture and Operational Controls

The core is a **Django application on Cloud Run**, backed by **Cloud SQL / PostgreSQL**. A database-backed task queue handles asynchronous execution, and **Cloudflare R2** is the selected attachment store for the document workflow. Linear serves as the human review and approval interface. A separate PHP plugin implements the WordPress provider contract.

The staging deployment uses GitHub Actions for release deployment, Secret Manager for credentials, and Sentry for error monitoring. Planner controls include bounded tool calls and token usage, a spending cap, a kill switch, and explicit handling of requester and website text as untrusted input. A planner evaluation set covers representative requests, ambiguity, unsupported operations, and injection attempts.

## Current Stage and Next Work

**As of October 2026:** the local notice workflow, Cloud Run staging deployment, LLM planner, public website read tools, and email drafting are implemented. Vibby remains in development; the full production intake-to-completion service is still being built.

The next extensions are inbound email intake, approved email sending, and document remediation through a separate accessibility pipeline. Event creation and document publishing are intended action types. These extensions build on the same plan, approval, execution, and verification contracts established by the notice workflow.
