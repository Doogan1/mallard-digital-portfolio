---
title: County Website Plugin Ecosystem
slug: county-plugins
status: maintained
year_started: 2025
client: Van Buren County / St. Joseph County
live_url: https://stjosephcountymi.gov
featured: false
stack:
  - PHP 8
  - WordPress
  - PostgreSQL
  - ACF Pro
  - WP-CLI
  - Claude Vision API
  - Claude Batch API
  - Cloud SQL
summary: >
  Eight custom WordPress plugins in a shared monorepo, powering VBC and SJC county sites from
  PostgreSQL via county-core sync — plus tag-based releases to Nexcess hosts through the
  dice-devops deploy CLI and inventory matrix.
---

## Architectural Decision: PostgreSQL as Source of Truth

WordPress's built-in data model — posts, meta, terms — is flexible but difficult to query relationally, slow to join across, and awkward to sync across multiple sites. For county government websites where the same staff directory, event calendar, and document library needs to appear on multiple sites and be maintained from a single admin, this is a real problem.

The solution: **PostgreSQL as the canonical data source, WordPress as the rendering layer**.

All authoritative directory data lives in Cloud SQL (PostgreSQL), in schemas managed by **County Data Services** and edited upstream through **Core DB**. WordPress sites pull from it via a 15-minute WP-Cron sync — data flows one direction, from the database into WordPress transient caches and custom tables. When a staff member's title changes in the core database, it appears on both county websites within 15 minutes without manual duplication.

Multi-tenancy is handled via `COUNTY_TENANT_ID` in `wp-config.php` (e.g. `VBC`, `SJC`). The same **county-website-plugins** monorepo serves vanburencountymi.gov and stjosephcountymi.gov with different data in scope. Fields synced from PostgreSQL are read-only in WordPress; edits happen in Core DB or the source system.

## Monorepo vs legacy standalone stack

The eight plugins below ship together in the **county-website-plugins** GitHub monorepo (one WordPress plugin entry point that loads county-core, county-directory, county-events, etc.). St. Joseph County production and the in-progress Van Buren v2 site run this monorepo (tagged releases such as **v2.3.0**). Van Buren v1 production still runs an older standalone-plugin layout; staging uses the monorepo as the migration path.

## The 8 Plugins

### County Core
The sync orchestration layer. Exposes WP-CLI commands for manual syncs and one-time imports, REST push endpoints for real-time updates from the backend, and a full audit log of every sync operation. All other plugins depend on County Core for database connection management and sync infrastructure.

### County Menus
Navigation management synchronized from PostgreSQL menu structures, allowing menu updates to propagate across sites without WordPress admin access.

### County Directory
Staff directory with full search and filter — by department, name, title, and location. Backed by the `core.people` and `core.assignments` tables in PostgreSQL. Built to handle 1,000+ staff records across two counties without performance degradation.

### County Documents
Document library with an archive module for records retention. Notable feature: an expiration notification system using a `notification_types` / `department_notification_subscriptions` schema that allows department heads to subscribe to notifications when documents in their scope are approaching expiration dates. Prevents the "we didn't know that policy had expired" problem that plagues government document management.

### County Events
Calendar system with full RFC 5545 recurring event support (daily/weekly/monthly/yearly patterns, exception dates, RRULE handling). Includes an optional LLM-powered natural-language input mode: staff can type "Board of Commissioners meets the second Tuesday of every month at 6pm in the County Building" and the plugin converts it to the appropriate recurrence rule — reducing the friction of entering complex schedules.

### County Forms
JotForm integration with county-scoped form library management. Keeps form configuration in the database rather than scattered across WordPress page meta.

### County Alerts
Emergency alert system with scheduling, multiple color themes, and a preset library for common alert types. Alerts can be scheduled in advance and expire automatically.

### County Alt Text
WCAG accessibility compliance for media libraries. Uses the Anthropic Batch API (Vision) to generate descriptive alt text for uploaded images. Running a full media library costs approximately **$2** via the Batch API. The plugin operates in two modes: bulk processing of the existing library, and a per-upload hook that generates alt text automatically for new uploads. Surfaces generated text in the WordPress media editor for staff review before publishing.

## Deployment & release (dice-devops)

Releases no longer depend on dragging files over SSH by hand. The separate **dice-devops** repo is the deployment control plane for this plugin suite (and other managed WordPress code across DICE sites).

**Inventory in git** — `servers.yml`, `plugins.yml`, and `matrix.yml` record which plugin versions should be on which Nexcess host (VBC/SJC prod and staging, plus partner sites). The matrix is the source of truth for what's supposed to be installed where.

**CLI deploy** — from dice-devops:

```bash
./scripts/deploy.sh county-website-plugins v2.4.0 sjc-prod
```

The script resolves plugin and server metadata from the inventory, checks out the **git tag** in the local `county-website-plugins` clone, enables WordPress **maintenance mode**, syncs files over SSH (tar stream to the remote plugin directory), writes a **`.version.json`** manifest (version, commit SHA, timestamp, deployer), flushes cache, and drops maintenance mode. Per-server **RSA 4096** deploy keys are required — Nexcess does not reliably accept ed25519.

That gives every install a auditable version stamp and a repeatable path from tag → production. GitHub Actions workflows in dice-devops (`workflow_dispatch` deploy, nightly probe → dashboard) are being wired up (Linear DIC-476 / DIC-475); the **deploy.sh** path is what we use today for promoted releases.

An onboarding **dashboard** (`dashboard/index.html`) compiles inventory YAML into a view of sites, SSH targets, and which custom plugins are active vs legacy — useful when standing up a new county host or debugging drift between servers.
