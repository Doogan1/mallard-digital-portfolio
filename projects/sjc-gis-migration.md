---
title: SJC GIS Migration — Infrastructure for Agentic Data Work
slug: sjc-gis-migration
status: development
year_started: 2026
client: St. Joseph County / DICE
featured: false
stack:
  - Google Cloud
  - Compute Engine
  - Cloud Storage
  - PostgreSQL
  - PostGIS
  - Python
  - GDAL
  - Claude API
summary: >
  Designed and implemented an isolated cloud environment for St. Joseph County's
  AI-assisted GIS migration. Established the infrastructure and operating plan that
  enabled the GIS lead's work on searchable archives, reconstructed address histories,
  and parcel migration into PostGIS.
---

## Building a Home Base for AI-Assisted GIS Work

St. Joseph County's GIS holdings spanned decades of spatial data, historical snapshots, maps, scans, and ESRI files. Initial planning estimated roughly 716 GB across 147,000 files, including about 440 GB of aerial imagery. The challenge was to identify authoritative data, preserve useful history, and establish an operating environment for modernization.

My role was to **design and implement the infrastructure and operating plan**. I authored the cloud environment proposal, coordinated the setup and approval process, and built the environment in September 2026. Maria reviewed the architecture and shared administrative responsibility. Once the environment was established, **Jerry, the county's GIS lead, directed the GIS and AI work with Claude**.

This division of responsibility mattered: the domain expert could guide the analysis and ratify decisions using his knowledge of county data, supported by a dedicated workspace for processing and storing the results.

## An Isolated Cloud Workspace

County IT required the AI work to remain separate from the county network. The plan used a dedicated Google Cloud project, with a processing VM and Cloud Storage for transferred source files, working data, curated outputs, and exports.

The transfer approach preserved county originals and avoided a standing connection back into county file shares. The design required no VPN, network peering, or inbound county firewall opening, and kept county network credentials off the processing VM. Agents worked against cloud copies rather than the operational county network.

The implemented workspace provided the storage and compute foundation for inventory and processing. Subsequent transfer work verified and extracted source archives and locked the source snapshots read-only, separating evidence from working outputs.

## Sequencing Infrastructure Around the Work

The setup plan distinguished the **temporary migration environment** from the smaller ongoing environment. A full source mirror was useful for inventory, validation, and archive indexing; it did not need to become permanent operational storage.

I planned staged provisioning around those needs, with storage and processing available first and managed database capacity tied to the migration's readiness. Phase 1 then required a catalog database earlier than the original sequence anticipated. I owned the catalog-hosting decision, and the project log records the PostgreSQL/PostGIS catalog environment established in early October, including catalog and reference schemas and separate database identities.

The plan also documented county-side transfer options, access responsibilities, expected processing usage, and estimated monthly infrastructure costs. This gave reviewers a concrete implementation sequence and a basis for adjusting capacity as the work progressed.

## What the Environment Enabled

With that foundation in place, Jerry led the agent-assisted inventory, interpretation, cleanup, and migration work. The project log records these **team outcomes as of October 20, 2026**:

- **70,930 historic pages read and indexed**, with further OCR and steward review improving difficult scans.
- **31,741 addresses reconstructed from 116 snapshots**, preserving address history rather than treating each snapshot as an unrelated dataset.
- **28,352 county parcels loaded into PostGIS**, alongside published parcel outputs and recorded geometry corrections.
- A searchable map library, archive decisions, and a replication playbook documenting tools, validation, exceptions, and lessons learned.

These are outcomes of the GIS lead's subsequent work in the environment, not claims that I personally implemented each analytical tool or transformation. My contribution was establishing the infrastructure and operating foundation that let that work proceed.

## Current Stage and Ongoing Transition

The environment is built and in use, while the overall migration remains in progress. The October project log records a period of parallel operation with ArcGIS, tested parcel reload tooling awaiting its first real scheduled transfer, and aerial imagery still awaiting a later transfer.

The broader aim is a smaller, maintainable GIS operation centered on authoritative data, searchable archives, deterministic tools, and human stewardship of AI-assisted changes. The project also provides a basis for repeating the approach in other counties.

This project is distinct from [County Data Services](/drake-olejniczak/projects/county-data-services), which covers ongoing schema management and spatial ingestion for the shared county database. Here, the focus is the dedicated migration environment, its isolation and operating plan, and the handoff that enabled sustained agentic work.
