---
title: SWMPC Website Suite
slug: swmpc-suite
status: complete
category: platform
year_started: 2025
year_ended: 2026
client: Southwest Michigan Planning Commission
live_url: https://swmpc.org
featured: true
stack:
  - Python
  - PHP 8
  - WordPress
  - WP-CLI
  - MySQL
  - Leaflet.js
  - ACF Pro
  - mdbtools
  - Custom Plugins
  - Nexcess
summary: >
  Three public-facing websites built and launched under a hard March 31, 2026 deadline,
  replacing a Classic ASP / Microsoft Access stack for the Southwest Michigan Planning Commission.
  Includes a fully custom interactive Leaflet.js map and 8 WordPress plugins.
---

## The Project

Southwest Michigan Planning Commission (SWMPC) runs regional transportation planning, transit coordination, and heritage trail programming for six counties in southwest Michigan. Their web presence was running on Classic ASP and Microsoft Access — infrastructure that was effectively unsupportable, inaccessible, and blocking their ability to serve the public.

Three sites needed to be built and launched under a hard March 31, 2026 deadline:

- **swmpc.org** — the primary planning commission site
- **mywaythere.org** — regional transit information and Find-a-Ride trip planning
- **us12heritagetrail.com** — US-12 Heritage Trail tourism site with interactive map

## Data Engineering Pipeline

The legacy data was stored in Microsoft Access `.mdb` files. Getting it out and into WordPress required a migration pipeline:

1. **Extraction**: Python + `mdbtools` to read `.mdb` files on Linux without a Windows dependency
2. **Normalization**: Python scripts to clean, deduplicate, and restructure records into well-typed CSVs — particularly the meeting archive (523 records spanning years of commission history)
3. **Import**: PHP scripts run via WP-CLI to create custom post types, insert records, and set ACF field values; 11 custom database tables for records that don't fit WordPress's post model

**Scale of migrated data:**

| Dataset | Records |
|---|---|
| Commission meetings | 523 |
| Traffic count locations | 2,784 |
| Documents | 576 (8 GB) |
| Transit providers | 56 across 153 jurisdictions |
| Points of interest | 316 |

## The US-12 Interactive Map

The us12heritagetrail.com site centers on an interactive map of the 212-mile US-12 corridor. The `us12-asset-map` plugin wraps a custom Leaflet.js implementation with:

- **Real-time taxonomy filtering** — visitors filter points by category (lodging, dining, history, recreation, etc.) without a page reload
- **URL query parameter pre-filtering** — regional landing pages pass `?region=coldwater` style parameters; the map initializes to that region's bounds and filters automatically, so each region's page shows only its relevant POIs
- **Custom tile configuration** and responsive layout across devices

The map data is managed through WordPress custom post types, so SWMPC staff can add and update points without touching code.

## Plugin Ecosystem

Eight custom WordPress plugins delivered:

- **swmpc-permissions** — three-tier role architecture shared across all three sites via a network-aware design: admin, staff, and public contributor roles with capability sets tuned to each site's editorial workflow
- **swmpc-meetings** — meeting archive with minutes/agenda document attachments, filterable by committee and date range
- **swmpc-traffic-counts** — 2,784 count locations in a custom database table, JOIN-based filtering by location and year
- **swmpc-documents** — document library with category taxonomy and search
- **swmpc-transit** — 56 transit providers across 153 jurisdictions, with service area maps
- **swmpc-pois** — points of interest backing the US-12 map
- **us12-asset-map** — the Leaflet.js interactive map described above
- **mwt-transit-lookup** — mywaythere.org transit provider search by county

## Legacy URL Redirect Map

The Classic ASP site had URLs like `/meetings.asp?id=123` and `/documents.asp?cat=transit`. Every significant legacy URL pattern was mapped to the corresponding WordPress URL and implemented as nginx rewrite rules, preserving existing links and search indexing.

## Strategic Context

This contract was a significant revenue event for DICE. It directly enabled hiring a new staff role — Maddie joined as a junior developer during the project and I mentored her through the WordPress development workflow, plugin architecture, and the data migration pipeline.
