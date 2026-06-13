---
title: County Website Plugin Ecosystem
slug: county-plugins
status: active
category: platform
year_started: 2025
client: Van Buren County / St. Joseph County
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
  Eight custom WordPress plugins powering the public websites for Van Buren County and
  St. Joseph County. PostgreSQL serves as the canonical data source; WordPress is the
  rendering layer. A 15-minute WP-Cron sync keeps them in lockstep.
---

## Architectural Decision: PostgreSQL as Source of Truth

WordPress's built-in data model — posts, meta, terms — is flexible but difficult to query relationally, slow to join across, and awkward to sync across multiple sites. For county government websites where the same staff directory, event calendar, and document library needs to appear on multiple sites and be maintained from a single admin, this is a real problem.

The solution: **PostgreSQL as the canonical data source, WordPress as the rendering layer**.

All authoritative data lives in Cloud SQL (PostgreSQL). WordPress sites pull from it via a 15-minute WP-Cron sync — data flows one direction, from the database into WordPress transient caches and custom tables. When a staff member's title changes in the core database, it appears on both county websites within 15 minutes without any manual duplication.

Multi-tenancy is handled via a `county_id` field on every shared table. The same plugin codebase serves vanburencountymi.gov and stjosephcountymi.gov with different data in scope.

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
