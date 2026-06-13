---
title: Marty AI & Government Chatbot Platform
slug: marty-ai
status: active
category: agentic-ai
year_started: 2024
client: Van Buren County / St. Joseph County
featured: false
stack:
  - Chatbase
  - Python
  - Cloud Run
  - BigQuery
  - Cloud Storage
  - Looker Studio
  - Claude API
  - WordPress
summary: >
  Four production AI chatbots deployed across Van Buren and St. Joseph County websites,
  with a full conversation logging and analytics pipeline. Includes a custom agentic
  Find-a-Ride assistant built directly on the Anthropic API.
---

## Four Production Chatbots

### Marty AI (Van Buren County General)
The primary county assistant. Answers resident questions about county services, office hours, meeting schedules, document requests, and general government navigation. 

**Usage to date:** 5,082 conversations / 25,590 messages

Marty is trained on county-specific content — meeting minutes, department pages, FAQ documents — and configured to route questions it can't answer to the appropriate county department rather than fabricating.

### Map Buddy (GIS Assistant)
Helps residents navigate the county's GIS portal. Answers questions about how to use map layers, find parcel information, and interpret GIS data outputs.

**Usage to date:** 1,580 conversations / 5,625 messages

### Joey AI (St. Joseph County General)
Parallel deployment to Marty for St. Joseph County, configured with SJC-specific knowledge base and branding.

### Find-a-Ride Agent (mywaythere.org)
A custom agentic assistant built directly on the Anthropic Claude API (not Chatbase). See below.

## Conversation Logging Pipeline

Chatbase provides usage data but doesn't expose raw conversation logs in a form suitable for policy monitoring and usage analysis. I built a pipeline to address this:

1. **Chatbase API → NDJSON**: scheduled Cloud Run job polls the Chatbase API for new conversations and writes them as newline-delimited JSON to Cloud Storage, with incremental writes (only new conversations since last run)
2. **Cloud Storage → BigQuery**: BigQuery external tables and scheduled loads bring the NDJSON into a queryable warehouse
3. **BigQuery → Looker Studio**: dashboards tracking conversation volume, topic distribution, escalation rate, and flagged content patterns

The monitoring use case is specifically important for government: county staff need to know if residents are receiving inaccurate information about services or benefits, and the logs provide the audit trail to catch that.

## Find-a-Ride Agent

The Find-a-Ride assistant is a different kind of chatbot — it's a fully custom agentic loop built with the Anthropic API directly, deployed as the `mwt-ride-agent` WordPress plugin on mywaythere.org.

Rather than a general-purpose assistant, it has a specific job: help southwest Michigan residents find transportation options for their specific situation — origin, destination, trip purpose (medical, employment, general), and eligibility status.

The agent integrates with the find-a-ride plugin's custom database tables (transit providers, service areas, trip types, eligibility criteria) via tool use. When a resident describes their trip, the agent calls tools to look up which providers serve their geography and trip type, then synthesizes a plain-English response with specific provider contacts and booking instructions.

Live at [mywaythere.org/find-a-ride/](https://mywaythere.org/find-a-ride/)
