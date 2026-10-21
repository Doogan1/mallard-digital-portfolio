---
title: SWMPC Website Suite
slug: swmpc-suite
status: maintained
year_started: 2025
year_ended: 2026
client: Southwest Michigan Planning Commission
live_url: https://swmpc.org
featured: false
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
  Covers shared data migration and site-specific WordPress plugins for planning records,
  transportation information, and an interactive heritage-trail map.
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

## Plugin Development by Website

### SWMPC — Planning Records and Public Information

The planning commission site brings meeting records, documents, and traffic-count data into WordPress. Custom plugin work includes meeting archives with agenda and minutes attachments, document categories and search, and traffic-count queries over custom tables. Shared permissions support editorial roles across the suite.

### MyWayThere — Transportation Discovery

MyWayThere combines transportation provider information, service coverage, and eligibility guidance. Its current plugin monorepo contains **find-a-ride** (structured search and maps), **mwt-ride-agent** (a conversational interface over the transportation data), and **mywaythere-customizations** (service content types, taxonomy and table synchronization, and meeting shortcodes).

The matching engine and recent iterations have their own [Find-a-Ride project entry](/drake-olejniczak/projects/find-a-ride). Its demo links to staging, which hosts the latest tool within the site's ongoing redesign ahead of migration to production.

### US-12 Heritage Trail — Points of Interest and Interactive Map

Custom point-of-interest management supplies the heritage-trail map described above. WordPress content and taxonomy let staff maintain destinations, while Leaflet provides category filtering and region-specific map views without maintaining separate maps for every landing page.

## Legacy URL Redirect Map

The Classic ASP site had URLs like `/meetings.asp?id=123` and `/documents.asp?cat=transit`. Every significant legacy URL pattern was mapped to the corresponding WordPress URL and implemented as nginx rewrite rules, preserving existing links and search indexing.

## Strategic Context

This contract was a significant revenue event for DICE. It directly enabled hiring a new staff role — Maddie joined as a junior developer during the project and I mentored her through the WordPress development workflow, plugin architecture, and the data migration pipeline.
