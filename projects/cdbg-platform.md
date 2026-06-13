---
title: CDBG Home Rehabilitation Platform
slug: cdbg-platform
status: active
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
summary: >
  A guided digital intake platform replacing paper-based HUD grant applications across 10 municipalities.
  Handles sensitive PII collection, server-side PDF generation, and municipality-scoped staff review workflows
  for Community Development Block Grant home rehabilitation programs.
---

## What It Replaces

Van Buren and Cass County residents applying for CDBG (Community Development Block Grant) home rehabilitation assistance used to navigate a paper-based process: physical forms, in-person document submission, phone calls to track status. For elderly and low-income applicants — the primary beneficiaries of this program — that friction is a real barrier to accessing federal housing funds.

The platform digitizes the full application workflow across 10 municipalities, from initial intake through staff review and award tracking.

## The 10-Step Application

The intake flow is a guided, stateful multi-step form with validation at each step:

1. **Household composition** — number of residents, ages, relationship to applicant
2. **Property lookup** — applicants search by owner name, parcel number, or address; selection pre-fills property data and derives True Market Value (SEV × 2) from the county parcel database
3. **SSN collection** — Social Security numbers for all household members, encrypted client-side before transmission using Cloud KMS; never stored in plaintext at any layer
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
- **Cloud KMS encryption** for SSNs — encrypted before leaving the browser, decrypted only server-side when generating the PDF packet; never stored as plaintext
- **Pre-production security audit** validated PII handling, Firestore rule coverage, and API authorization logic before launch

Phase 1 launched May 20, 2026. Phase 2 — staff review workflow with document annotation and award tracking — targeted June 19, 2026.
