---
title: Find-a-Ride — Transportation Discovery
slug: find-a-ride
status: live
year_started: 2025
client: Southwest Michigan Planning Commission
live_url: https://staging.mywaythere.org/find-a-ride/
featured: true
stack:
  - PHP 8
  - WordPress
  - MySQL
  - JavaScript
  - Leaflet.js
  - Claude API
  - WP-CLI
  - ACF Pro
  - Nexcess
summary: >
  A transportation discovery tool matching southwest Michigan residents with providers
  by geography, schedule, eligibility, and accessibility needs. Combines configurable
  matching rules, interactive coverage maps, and a conversational assistant.
  The linked staging preview shows the latest iteration ahead of the site migration.
---

## Finding a Provider That Fits the Trip

Finding transportation involves more than locating a nearby bus service. A provider must serve the right origin and destination, operate at the requested time, and accommodate the rider's needs and eligibility.

I rebuilt Find-a-Ride from a legacy Classic ASP tool into a WordPress application for MyWayThere, working with SWMPC's mobility manager to refine its search rules and presentation. The tool helps residents discover providers and contact them to arrange travel; it does not book rides or construct multi-leg itineraries.

**The tool is in use on MyWayThere. The linked demo is the staging preview**, where recent improvements are being reviewed ahead of the redesigned site's migration to production.

## Geographic and Rule-Based Matching

Users select an origin and optional destination through location controls, address lookup, or the interactive map. Jurisdiction boundaries connect those locations to service-area records. Search combines geography with schedule, trip purpose, eligibility groups, and accessibility requirements stored in custom relational tables.

Results show matching services with provider contacts, service details, and links to provider pages. Public transit is prioritized, with grouping and service-type order controlled through WordPress administration. Staff can also configure how blank eligibility and accommodation filters treat restricted services and edit the no-results message.

This keeps policy decisions visible to the staff who maintain the service directory. Matching behavior can evolve with their feedback without turning every ordering or display change into a code release.

## Recent Iteration: Useful Alternatives When Times Do Not Match

The latest staging work adds **nearby schedule suggestions**. If no public transit matches, the tool preserves the trip's origin, destination, accommodations, and eligibility selections while looking for up to two alternatives involving a nearby day or time. An **Update search** control applies the suggested change.

For example, a Saturday search departing Paw Paw at 5 PM can explain that Van Buren Public Transit runs until 4 PM and suggest departing earlier. Other matching services remain visible. Boundary times count as matches, avoiding an unnecessary rejection when the requested trip coincides exactly with a service's opening or closing time.

Other staging improvements replace filter chip clouds with multiselects, use a date-range control, and stack the search form above the map and results. Printable results support residents and staff who need to carry or share the information outside the website.

## Maps and Reusable Provider Lookups

The plugin supports both the full trip search and smaller provider-by-location widgets, including public-transit and senior-transportation views. A coverage map can show multiple providers or focus on the provider whose page is open, with origin and destination coverage controls.

The map and results share the same underlying service data. WordPress provider content supplies contact details and links, while custom tables represent the relationships among providers, services, jurisdictions, and matching criteria.

## A Conversational Interface to the Same Data

The companion **Find-a-Ride Agent** uses the Anthropic API directly. Its tools query the transportation data so residents can describe a trip in ordinary language and receive provider contacts and booking guidance grounded in those records.

The structured search remains useful on its own. The conversational agent adds another way to reach the same service information rather than replacing the matching engine with free-form model answers.

## Plugin Engineering and Release Workflow

The MyWayThere plugin monorepo contains **find-a-ride**, **mwt-ride-agent**, and **mywaythere-customizations**. The last plugin manages service content types, taxonomies, data synchronization, and meeting shortcodes. Shared release tags and deploy manifests identify the version installed on each host; WP-CLI commands support data diagnostics and repeatable searches.

The broader website migration and shared infrastructure are covered in the [SWMPC Website Suite](/drake-olejniczak/projects/swmpc-suite). The MyWayThere redesign continues alongside this tool's development.
