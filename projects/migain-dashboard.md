---
title: MI-GAIN — Michigan Government AI Network
slug: migain-dashboard
status: active
category: data-engineering
year_started: 2026
client: MI-GAIN (co-founded)
live_url: https://dicemi.org/migain-survey-and-results/
featured: false
stack:
  - Jotform
  - Google Sheets
  - Google Apps Script
  - Chart.js
  - Custom HTML/JS
  - WordPress
  - SVG
summary: >
  Co-founded MI-GAIN, a statewide peer network for Michigan government AI practitioners.
  Built the public survey, live results dashboard, a Michigan county SVG map visualization,
  and a member resource repository plugin.
---

## MI-GAIN

Michigan Government AI Network (MI-GAIN) is a statewide peer network for practitioners in Michigan local and state government who are working on, evaluating, or thinking about AI adoption. The network exists because the questions government faces around AI — procurement, policy, liability, equity — are different from what the private sector faces, and government practitioners don't have many peer venues to work through them together.

I co-founded MI-GAIN and built the technical infrastructure that makes it a publicly visible, data-driven network rather than just a mailing list.

## Survey & Live Results Dashboard

The public-facing survey collects information from member governments about AI tool adoption, use cases, policy status, and interest areas. Results are published as a live dashboard so that the broader government community can see the state of AI adoption across Michigan.

**Pipeline:**

1. **Jotform** — survey collection with conditional logic and multi-select fields
2. **Google Sheets** — Jotform pushes responses automatically on submission
3. **Google Apps Script ETL** — a scheduled script runs on the connected sheet to:
   - Strip personally identifiable organization details from the public-facing view
   - Normalize multi-select fields (Jotform stores them as semicolon-delimited strings; the ETL splits and restructures them into arrays)
   - Compute aggregate statistics used by the dashboard
4. **Apps Script serving layer** — a `doGet()` web app endpoint serves the processed data as JSON to the frontend
5. **Dashboard** — custom HTML/JS with Chart.js visualizations, embedded in WordPress via an iframe-free widget pattern

The dashboard updates live as new survey responses come in — no manual export/import cycle.

## Michigan County SVG Map

A custom SVG map of all 83 Michigan counties, built in-house, visualizes which counties have member representation in the network. Counties are highlighted as membership grows, providing a visual signal of network coverage that's more compelling than a list.

Built with Chart.js data binding to the same Apps Script data layer as the dashboard — when a new county government joins, the map updates automatically.

## Member Resource Repository

The `mi-lgai-repository` WordPress plugin provides a structured resource submission and browsing system for network members. Governments can submit:

- AI policies and governance documents
- Project descriptions and case studies
- Technical documentation and implementation guides

The submission form is role-gated (members only) and feeds a browsable, searchable public library. The goal is a practical, peer-contributed knowledge base — not a curated institutional resource library, but a living record of what Michigan governments are actually doing.

## Outreach

I coordinated with Maddie on outreach efforts to expand county membership across Michigan, using the dashboard's geographic visualization to identify and prioritize counties with no current representation.
