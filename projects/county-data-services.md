---
title: County Data Services — GIS & Parcel Pipeline
slug: county-data-services
status: maintained
year_started: 2025
client: Van Buren County / St. Joseph County / DICE
featured: false
stack:
  - PostgreSQL
  - PostGIS
  - Cloud SQL
  - Sqitch
  - GDAL
  - ogr2ogr
summary: >
  Schema migrations and GIS ingestion for the shared county Cloud SQL instance — loading
  assessor parcels and other spatial layers from shapefiles into PostGIS, with Sqitch-managed
  deploys. Downstream apps (ZIP, CDBG, directory sync) read from separate schemas on the same database.
---

## What It Is

County Data Services is the repo I maintain for **database structure and spatial data loading** on the counties' shared Cloud SQL PostgreSQL instance. Application repos (Core DB admin, ZIP, WordPress plugins) each own their product code; this repo owns **how the database evolves** and **how county GIS sources land in PostGIS**.

Personnel and org data live under schemas like `core` and `ops` (managed and edited through the Core DB application). Parcel polygons, zoning-related layers, and other county shapefile exports live in **separate PostGIS schemas** loaded and refreshed from this pipeline. Same instance, clear boundaries — apps query what they need without mixing concerns in one monolithic schema.

## Schema Management with Sqitch

Database changes are not applied by hand in production. [Sqitch](https://sqitch.org/) tracks migration plans as versioned deploy/revert scripts:

- **Deploy** scripts add or alter tables, indexes, extensions (`postgis`), views, and grants
- **Revert** scripts undo a change in a controlled order when something needs to roll back
- **Verify** scripts (where used) assert invariants after deploy

That workflow matters because multiple products depend on the same instance: a parcel index change for ZIP must be reproducible, reviewable in git, and deployable the same way to staging and Cloud SQL without drift.

## GIS Ingestion: Shapefiles → PostGIS

County assessor and GIS offices publish parcels and related layers as shapefiles (or equivalent exports). The load path is deliberately boring and reliable:

1. **Source files** — county shapefile drops (parcels, overlays, or other layers as provided)
2. **Transform & load** — `ogr2ogr` (GDAL) into PostGIS with explicit target schema, geometry type, and SRID
3. **Validation** — row counts, geometry validity, key fields present before swap or publish
4. **Refresh** — full or incremental reload depending on the layer; parcel bases typically reloaded when the assessor publishes a new extract

Using GDAL/ogr2ogr keeps the pipeline standard and debuggable: any GIS person can reproduce a load locally with the same commands documented in the repo, without proprietary ETL tooling.

## Who Consumes This Data

| Consumer | Use |
|----------|-----|
| **ZIP** | Map click → parcel attributes and geometry from PostGIS; agent tools query structured parcel fields |
| **CDBG platform** | Property lookup by owner, parcel ID, or address against the parcel layer |
| **Core DB / County plugins** | Personnel in `core.*`; not GIS, but same Cloud SQL instance and Sqitch deploy discipline |

ZIP and CDBG are **readers** of the spatial layers this repo maintains. Core DB is a **reader/writer** of personnel data in sibling schemas. County Data Services is where those worlds stay coherent at the infrastructure layer.

## Why It's a Separate Portfolio Project

The work is ongoing operations, not a one-off import: new layers, assessor refresh cycles, index tuning for map queries, and migration reviews when an app needs a new column or spatial index. Status is **maintained** — the system is live and I remain responsible for schema deploys and load procedures even when GIS staff extend map products independently.
