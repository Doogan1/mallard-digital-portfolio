---
title: ZIP — Zoning Intelligence Platform
slug: zip
status: active
year_started: 2025
client: Van Buren County / DICE
live_url: https://zip.dicemi.org
featured: true
stack:
  - FastAPI
  - PostgreSQL
  - pgvector
  - PostGIS
  - Claude API
  - MapLibre GL JS
  - OpenAI Embeddings
  - Docker
  - Cloud Run
  - Cloud Armor
  - Cloud SQL
  - Cloud Build
summary: >
  An AI-powered zoning assistant for Van Buren County residents. Residents click a parcel on
  an interactive map and ask plain-English questions about what they can do with their land —
  the system answers with precise citations from the actual zoning ordinance.
---

## What It Does

A resident wants to know whether they can keep horses on their rural parcel. They open ZIP, click their property on the map, and ask: *"Can I keep horses here?"*

Within seconds they have an answer: yes, horses are permitted as a matter of right in the AG district, subject to a minimum lot size requirement and setbacks from neighboring structures — with the exact ordinance section quoted inline.

That's the product. No phone calls to the zoning office, no trying to interpret 200 pages of legal text, no vague answers. Just a precise, sourced response grounded in the actual ordinance.

## The Agent Loop

ZIP's intelligence is an agentic loop built on the Claude API's tool use capability. The flow looks like this:

1. **User message arrives** with the parcel they've selected as context (zone district, overlay status, parcel attributes)
2. **Claude calls tools** — a semantic ordinance search via pgvector (finding the most relevant sections from the zoning code) and a structured parcel attribute lookup against PostGIS
3. **Results return to Claude**, which synthesizes a plain-English answer, cites the relevant sections by number, and emits panel-control commands that synchronize the three-panel UI (map panel, chat panel, ordinance panel)
4. **The UI updates**: the ordinance panel scrolls to and highlights the cited section; the map panel may update parcel styling

The critical design constraint is that the system **cites its source and says "I don't know"** rather than fabricating. If a question falls outside the zoning ordinance's scope, ZIP says so explicitly and suggests where to look instead. This was non-negotiable for a government-facing tool.

## Data Pipeline

The zoning ordinance is a PDF. Getting it into a form the agent can reason over required a pipeline:

1. **PDF extraction**: section-aware chunking that preserves article/section boundaries
2. **Embedding**: OpenAI text-embedding-3-small over each chunk
3. **Storage**: pgvector in Cloud SQL — each chunk is a row with its embedding, section number, and raw text
4. **Query time**: user question → embedding → cosine similarity search → top-k relevant chunks returned to Claude as tool results

The chunks are sized to fit cleanly in context while preserving enough surrounding text that Claude can understand regulatory language in context.

## Infrastructure

- **Cloud Run**: stateless FastAPI backend, autoscaled to zero between uses
- **Cloud SQL (PostgreSQL + pgvector + PostGIS)**: single database for both ordinance chunks and parcel geometry
- **Cloud Armor**: load balancer with WAF rules protecting the public endpoint
- **Docker Compose**: local development mirrors production — same database schema, same API surface
- **Cloud Build**: CI/CD pipeline for automated builds on push to main

## My Role

Built entirely solo, end-to-end — from the initial PDF parsing pipeline through the agent architecture, PostGIS integration, MapLibre frontend, and Cloud Run deployment.

The project is now in a maintenance and extension phase. I've set up a Cloud Build CI/CD pipeline so that Jerry, a GIS developer at Van Buren County, can extend the map layers and ordinance data independently without requiring my direct involvement on every change. The handoff pattern — clear build pipeline, documented schema, working CI — is something I try to build into every project I hand over.
