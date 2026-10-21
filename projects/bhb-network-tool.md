---
title: Be Healthy Berrien — Network Analysis & Asset Explorer
slug: bhb-network-tool
status: development
year_started: 2026
client: Be Healthy Berrien / Southwest Michigan Planning Commission
featured: false
stack:
  - Python
  - Django
  - NetworkX
  - Claude API
  - Vue
  - TypeScript
  - Vite
  - D3.js
  - SQLite
summary: >
  A local prototype that turns a community asset inventory into an interactive network
  exploration workspace. Claude calls NetworkX analysis tools and updates a Vue/D3 graph
  through a structured view contract, with saved conversations and graph views.
  In development; no public deployment yet.
---

## From an Asset Inventory to Questions About a Network

Be Healthy Berrien coordinates work around health, food access, and active living in Berrien County. Its strategic asset inventory describes organizations and community assets through categories, missions, and tags. A curated Kumu presentation helps communicate that inventory, but new analytical questions require constructing new views.

I built a local prototype that lets staff explore those questions in plain English: show the food-access subnetwork, inspect what connects an organization to the rest of the inventory, or resize nodes by a centrality measure. It combines my graph-theory background with an agent interface that runs explicit analytical operations.

**This is an implemented local prototype, with no public deployment yet.** The intended audience is BHB, SWMPC, and DICE staff.

## Constructing the Graph Is Part of the Analysis

The source is an inventory of roughly 200 organization and asset records, not an authoritative list of relationships. The data model retains entities, faceted tags, duplicate references, and review flags.

The tool can build an **organization/tag bipartite graph**, keeping tags visible as nodes, or project shared tags into organization-to-organization connections. Rarity weighting helps distinguish specific shared characteristics from ubiquitous labels; frequency filtering can reduce clutter in exploratory views.

These edges represent shared attributes in the inventory. They are not evidence of an operational partnership, and low connectivity in this graph does not by itself establish a real-world service gap. That distinction matters when translating a network visualization into planning decisions.

## An Agent That Calls NetworkX Tools

A Django backend orchestrates Claude tool use over a registry of Python analysis functions. Tools construct graphs, inspect neighbors, extract subnetworks, filter by tags, identify weakly connected entities, and calculate degree, betweenness, closeness, or PageRank.

Read-only query tools inspect the current view; action tools create or update graph views. This lets the agent chain operations, such as finding neighbors and extracting a subnetwork, while preserving the context of what the user is already viewing.

The tool schemas are **MCP-shaped**, but the prototype calls their handlers in-process. A standalone MCP transport is future work. Adding an analytical capability means registering another tool rather than rewriting the conversation loop.

## Streaming Analysis into an Interactive View

The Vue / TypeScript frontend combines a chat panel with a D3 force-directed graph. Django streams assistant output, tool progress, and graph changes over Server-Sent Events. A structured JSON **view specification** carries nodes, edges, metrics, styling, and layout hints to the renderer.

The model does not generate a new visualization implementation for every question. Tools produce data and display instructions through the shared contract, and the frontend renders them. Users can explore the graph visually, inspect entity details, and continue with a follow-up question about the current view.

## Persistence for Continuing an Exploration

The local implementation includes saved graph views, session selection and resumption, searchable conversation records, and view history. Stored tool-call and result blocks preserve conversation context, while the session's active-view reference keeps follow-up operations tied to the graph on screen.

Django owns the entity and session data, currently stored in SQLite. User accounts associate sessions and saved views with their owners. These features turn a one-off graph demonstration into a workspace that can be revisited.

## Next Steps

The next stage is deployment and staff evaluation using real planning questions. Kumu remains the intended partner-facing presentation surface; export is currently a stub, with the format and integration still to be implemented. Production infrastructure and wider collaboration remain future work.
