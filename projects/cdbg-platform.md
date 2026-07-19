---
title: CDBG Home Rehabilitation Platform
slug: cdbg-platform
status: live
year_started: 2026
client: Market One / Van Buren & Cass Counties
featured: true
stack:
  - React
  - TypeScript
  - Vite
  - Firebase Hosting
  - Node.js
  - Express
  - Cloud Run
  - Firestore
  - Cloud KMS
  - Cloud Storage
  - Brevo
  - Firebase Auth
  - GitHub Actions
summary: >
  A guided digital intake platform replacing paper-based HUD grant applications across 10 municipalities.
  Handles sensitive PII collection, server-side PDF generation, municipality-scoped staff review workflows,
  and a GitHub Actions pipeline with isolated staging and manual production promotion.
---

## What It Replaces

Van Buren and Cass County residents applying for CDBG (Community Development Block Grant) home rehabilitation assistance used to navigate a paper-based process: physical forms, in-person document submission, phone calls to track status. For elderly and low-income applicants — the primary beneficiaries of this program — that friction is a real barrier to accessing federal housing funds.

The platform digitizes the full application workflow across 10 municipalities, from initial intake through staff review and award tracking.

## The 10-Step Application

The intake flow is a guided, stateful multi-step form with validation at each step:

1. **Household composition** — number of residents, ages, relationship to applicant
2. **Property & municipality** — applicants enter property and location details; the Cloud Run backend calls the county **parcel viewer API** to map ZIP/city to one of the 10 program municipalities (CDBG runs on an isolated GCP project with Firestore, not the shared PostGIS instance)
3. **SSN collection** — Social Security numbers for household members; encrypted via **Cloud KMS** on the server before write to Firestore; masked form stored for display; never persisted in plaintext
4. **Citizenship declarations** — per HUD Form 10-F requirements, one declaration per household member
5. **Income checklist** — 32 income/asset line items per HUD Form 10-G; sources include wages, Social Security, pensions, rental income, assets
6. **Document upload** — document requirements are generated dynamically based on the household's income selections; if a member declared rental income, supporting documents for rental income appear
7. **Project description** — nature and scope of the requested rehabilitation work
8. **Federal certification** — 18 U.S.C. § 1001 oath presented and acknowledged before submission
9. **PDF packet generation** — server generates a complete PDF packet: all 5 HUD AcroForms filled from submission data, uploaded supporting documents appended; packet streamed to applicant for download
10. **Confirmation** — submission record created, applicant receives email confirmation via Brevo

## Completeness Scoring

Not all submissions are genuine attempts to complete the application. Some applicants partially fill out a form to "hold their place" in the queue while they gather documents.

The platform calculates a 0–100 completeness score that weights required fields, document completeness, and declaration acknowledgments. Staff can sort and filter the queue by this score to distinguish actionable applications from placeholders — preventing review capacity from being consumed by incomplete submissions.

## Municipality-Scoped Staff Dashboard

Each municipality in the program has its own scoped view of the application queue. Staff can:

- View all applications within their municipality
- Update application status (pending, under review, approved, denied, on hold)
- Review uploaded supporting documents inline
- Send messages to applicants through the platform
- Access a full audit log of every status change and staff action

Firestore security rules enforce municipality scoping at the data layer — a staff user for Decatur cannot access applications submitted under Lawrence Township, regardless of how the request is constructed.

## Security Architecture

This platform handles some of the most sensitive data in social services: Social Security numbers, household income records, citizenship status. The security decisions were deliberate:

- **Firestore rules block all direct client writes** — every mutation goes through the server-side API, which enforces authentication, authorization, and audit logging before touching the database
- **Cloud KMS encryption** for SSNs — encrypted on the API before Firestore write; decrypted only when generating the PDF packet
- **Pre-production security audit** validated PII handling, Firestore rule coverage, and API authorization logic before launch

## Deployment & CI/CD

CDBG uses a **trunk-based, tag-to-promote** pipeline across two GCP projects: production (`swmpc-491818`) and staging (`cdbg-staging`), each with its own Firestore, Storage, KMS keyring, and Firebase Auth so staging never touches real applicant data.

- **Feature branches** (named for the Linear ticket) → PR → merge to `main`
- **Staging** — every merge to `main` auto-deploys via **GitHub Actions** (`deploy-staging.yml`): build frontend, deploy Cloud Run backend, sync Firebase Hosting
- **Production** — always **manual**: `workflow_dispatch` on `deploy-production.yml` after verification on staging; no auto-promote to prod
- **Auth in CI** — **Workload Identity Federation** with a per-project `github-actions-deployer` service account; no long-lived JSON keys in GitHub

That pattern is the reference for how DICE is moving as the team grows: predictable staging, explicit production promotion, and credentials that aren't tied to a personal account.

Phase 1 (applicant intake) launched May 20, 2026. Phase 2 — applicant profiles, municipal staff login, document accept/reject — is in active development.
