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
  A production home rehabilitation intake and case-management platform with 79 submitted
  applications across 7 active communities as of October 5, 2026. Market One reports roughly
  halving income-eligibility and document-review time. Includes guided applications,
  staff-assisted paper intake, secure document handling, and community-scoped workspaces.
---

## Making Home Rehabilitation Assistance Easier to Access

Market One administers CDBG home rehabilitation programs for participating communities in Van Buren and Cass counties. Residents must provide detailed household, property, income, and supporting-document information. A paper-based process adds travel, repeated data entry, and follow-up calls for people already facing transportation or work-schedule barriers.

Working with Market One and the county development team, I built the application and supporting infrastructure for a shared intake and case-management platform. Residents can apply remotely and return to saved progress; staff can help applicants and manage their records in the same system.

**As of October 5, 2026**, the project board report confirmed:

- **191 registered applicant accounts**, excluding staff and test accounts
- **79 submitted applications**, including staff-entered paper applications
- **7 communities with actual program activity**

Market One's applicant-facing coordinator reported that the portal reduced the time needed to review **income eligibility and required documents by about half**. This is staff-reported improvement in that review task; homes repaired and grant funds paid are separate program outcomes.

## Guided Intake and Document Preparation

The React / TypeScript application saves progress through a multi-step workflow covering program information and accommodation needs, property details, household composition, income, requested repairs, and declarations.

County parcel lookup helps applicants find their property and prefill information. Document requirements are derived from the household's answers, so the checklist reflects the income sources and supporting records relevant to that application. Residents can review their information before submission, receive an email confirmation through Brevo, and return to see status and respond to staff requests.

The Node.js / Express backend generates program paperwork from application data, filling HUD PDF forms and combining them with supporting documents into a downloadable packet. Community-specific headers and return information identify the correct program office. Staff review the packet before submission to MSHDA.

## Case Management Across Communities

The staff experience has grown beyond an intake queue into community workspaces. Market One administrators can work across communities, while municipal staff access their assigned community. Applicant profiles bring application details, documents, status, and related records together.

Staff can correct individual application sections, request missing information, use an income calculator, and record calls, emails, and follow-up notes in a private contact log. Application change history helps colleagues understand what has already happened when multiple people assist a household.

**Paper applications use the same system.** Staff can create a record and enter information on a resident's behalf, then use the same document storage, contact notes, and status tracking as online applicants. This preserves an assisted path for residents who lack a computer or prefer paper.

Assigned inspectors can access specific applications and supporting property records, including before-and-after photos. Financial and identity documents and the SSN-bearing packet have separate access restrictions. A dedicated digital inspection form remains future work.

## Security and Operational Ownership

The production stack uses Firebase Auth, a Cloud Run API, Firestore, Cloud Storage, and Cloud KMS. Authorization is enforced by the **server-side API**, using the caller's identity, role, and assigned community or application. The API uses the Firebase Admin SDK, which bypasses Firestore security rules; those rules are not the enforcement path for these requests.

Social Security numbers are encrypted with Cloud KMS before being written to the application database. Uploaded documents are held in private storage, with document access controlled by the API. Generated packets contain sensitive information and require their own access controls.

Operational work includes durable logging when document download URLs are issued, alerts for document reads outside the application, an access register and review cadence, and narrower CI deployer permissions. These controls make access and operational responsibilities easier to investigate and maintain as the team grows.

Separate staging and production GCP projects isolate testing from production resources. GitHub Actions runs frontend and backend checks, deploys changes from main to staging, and requires manual production promotion after verification. Workload Identity Federation supplies CI credentials without long-lived service-account JSON keys. A database recovery exercise was completed on October 5, 2026, alongside work on code and data rollback procedures.

## Financial Administration — Built, Pending Release

The next major extension replaces repeated entry across staff time spreadsheets, invoices, and grant payment paperwork. The time-and-effort tracker and invoice generation were demonstrated to Market One on October 2; production rollout remains to be confirmed.

Implemented work includes community-and-period time sheets, per-person hourly rates and fringe percentages, activity logs, printable records, invoice PDFs, and tracking through municipal approval and payment. Rates are copied into each sheet so changing a staff rate does not silently alter an existing invoice. Date changes that would discard recorded hours are blocked for explicit review.

Payment-request and combined-packet work extends the same records toward MSHDA reporting. These financial tools remain under review and development, with no measured time-savings claim yet.

## Jurisdiction Modeling and Next Steps

Recent production feedback exposed an important distinction: a mailing city does not necessarily identify a property's geographic municipality, and that municipality is distinct from the grant program serving it. Parcel-based routing and clearer community labels address that mismatch; historical corrections require additional care.

I prepared dry-run migration reports and human-reviewed exceptions for existing applications, keeping geographic municipality separate from proposed grant assignment and leaving ambiguous parcel matches unresolved. Applying the historical production migration remains pending.

Further work includes a planned Django / PostgreSQL backend and scoped authorization model, environmental-review paperwork and deadline tooling, and document accept/reject workflows. These are separate from the intake and case-management capabilities already in use.
