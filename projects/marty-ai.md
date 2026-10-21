---
title: Marty AI & Government Chatbot Platform
slug: marty-ai
status: live
year_started: 2024
client: Van Buren County / St. Joseph County
live_url: https://vanburencountymi.gov
featured: true
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
  County AI assistants for Van Buren and St. Joseph County, backed by a conversation
  logging and analytics pipeline spanning Cloud Run, Cloud Storage, BigQuery, and Looker Studio.
---

## County AI Assistants

### Marty AI (Van Buren County General)
The primary county assistant. Answers resident questions about county services, office hours, meeting schedules, document requests, and general government navigation. 

**Usage to date:** 5,082 conversations / 25,590 messages

Marty is trained on county-specific content — meeting minutes, department pages, FAQ documents — and configured to route questions it can't answer to the appropriate county department rather than fabricating.

### Map Buddy (GIS Assistant)
Helps residents navigate the county's GIS portal. Answers questions about how to use map layers, find parcel information, and interpret GIS data outputs.

**Usage to date:** 1,580 conversations / 5,625 messages

### Joey AI (St. Joseph County General)
Parallel deployment to Marty for St. Joseph County, configured with SJC-specific knowledge base and branding.

## Conversation Logging Pipeline

Chatbase provides usage data but doesn't expose raw conversation logs in a form suitable for policy monitoring and usage analysis. I built a pipeline to address this:

1. **Chatbase API → NDJSON**: scheduled Cloud Run job polls the Chatbase API for new conversations and writes them as newline-delimited JSON to Cloud Storage, with incremental writes (only new conversations since last run)
2. **Cloud Storage → BigQuery**: BigQuery external tables and scheduled loads bring the NDJSON into a queryable warehouse
3. **BigQuery → Looker Studio**: dashboards tracking conversation volume, topic distribution, escalation rate, and flagged content patterns

The monitoring use case is specifically important for government: county staff need to know if residents are receiving inaccurate information about services or benefits, and the logs provide the audit trail to catch that.

## Related: Find-a-Ride Agent

The custom Anthropic tool-use assistant for MyWayThere is covered in the dedicated [Find-a-Ride project](/drake-olejniczak/projects/find-a-ride), alongside its transportation matching engine, maps, and recent staging improvements.
