# Portfolio Site — Build Spec
**Project:** `mallard-digital-portfolio`
**Target URL:** `portfolio.mallard-digital.com/drake-olejniczak`
**Stack:** Vite + React + TypeScript, markdown-driven project content, nginx on existing Linux VM

---

## What This Is

A single-page portfolio app for Drake Olejniczak — AI & Data Engineer. It serves two purposes simultaneously:

1. **Hiring audience:** A polished, scannable showcase of production AI and data engineering work that lives behind a link on his resume
2. **Personal catalogue:** A structured, version-controlled record of every project Drake has worked on, maintained as markdown files in the repo

The site is multi-tenant by design: the `/drake-olejniczak` path prefix allows future portfolios (e.g., `/maddie`) to be served from the same nginx instance without a new deployment.

---

## Repository Structure

```
mallard-digital-portfolio/
├── projects/
│   ├── zip.md
│   ├── cdbg-platform.md
│   ├── swmpc-suite.md
│   ├── county-plugins.md
│   ├── marty-ai.md
│   ├── find-a-ride.md
│   ├── core-db.md
│   ├── migain-dashboard.md
│   └── skills-network.md          ← placeholder/in-progress
├── src/
│   ├── components/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── SkillsNetwork.tsx
│   │   ├── FilterBar.tsx
│   │   └── Nav.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Projects.tsx
│   │   └── ProjectPage.tsx
│   ├── lib/
│   │   ├── parseProjects.ts        ← loads + parses all markdown files
│   │   └── types.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Project Markdown Schema

Every file in `projects/` follows this frontmatter schema. These fields drive filtering, the skills network, and project card rendering — they are the content API.

```yaml
---
title: ZIP — Zoning Intelligence Platform
slug: zip
status: active            # active | complete | in-progress | archived
category: agentic-ai      # agentic-ai | data-engineering | full-stack | infrastructure | platform
year_started: 2025
year_ended:               # leave blank if active
client: Van Buren County / DICE
live_url: https://zip.dicemi.org
repo_url:                 # leave blank if private
featured: true            # true = appears on home page hero section
stack:
  - FastAPI
  - PostgreSQL
  - pgvector
  - Claude API
  - MapLibre GL JS
  - OpenAI Embeddings
  - Docker
  - Cloud Run
  - Cloud Armor
summary: >
  One or two sentence plain-English description for card display.
  What problem it solves and who uses it.
---

Full markdown narrative below the frontmatter. This is the project detail page content.
Use headers, lists, whatever makes sense. Link to live URLs inline.
```

### Required fields
`title`, `slug`, `status`, `category`, `year_started`, `stack`, `summary`

### Optional fields
`year_ended`, `client`, `live_url`, `repo_url`, `featured`

---

## Project Files to Create

Populate each file with real content from the source material below. Write full narrative sections in the markdown body — this is the portfolio detail view content, not just a data record.

---

### `projects/zip.md`

**Frontmatter:**
- title: ZIP — Zoning Intelligence Platform
- slug: zip
- status: active
- category: agentic-ai
- year_started: 2025
- client: Van Buren County / DICE
- live_url: https://zip.dicemi.org
- featured: true
- stack: FastAPI, PostgreSQL, pgvector, PostGIS, Claude API (tool use), MapLibre GL JS, OpenAI Embeddings, Docker, Cloud Run, Cloud Armor, Cloud SQL, Cloud Build

**Narrative content to include:**
- What it does for an end user (resident clicks a parcel, asks "Can I keep horses here?", gets a precise sourced answer with the ordinance section highlighted)
- The agent loop: user message + parcel context → Claude calls tools (semantic ordinance search via pgvector, parcel attribute lookup) → synthesizes answer with panel-control commands → three-panel UI synchronizes
- Data pipeline: zoning PDF → section chunks → OpenAI embeddings → pgvector
- Infrastructure: Cloud Run, Cloud SQL, Cloud Armor load balancer, Docker Compose for local dev
- Drake's role: built solo end-to-end; now enabling a GIS developer (Jerry) to extend it independently via Cloud Build CI/CD pipeline Drake set up
- Design principle: system cites its source and says "I don't know" rather than fabricating

---

### `projects/cdbg-platform.md`

**Frontmatter:**
- title: CDBG Home Rehabilitation Platform
- slug: cdbg-platform
- status: active
- category: full-stack
- year_started: 2026
- client: Market One / Van Buren & Cass Counties
- featured: true
- stack: React 18, TypeScript, Vite, Firebase Hosting, Node.js, Express, Cloud Run, Firestore, Cloud KMS, Cloud Storage, Brevo, Firebase Auth

**Narrative content to include:**
- What it replaces: paper-based HUD grant applications across 10 municipalities
- 10-step guided intake: household composition, SSN collection (KMS-encrypted end-to-end, never stored in plaintext), citizenship declarations (HUD Form 10-F), income/asset checklist (HUD Form 10-G, 32 line items), dynamic document upload list that adapts to each household's selections, project description, federal 18 U.S.C. § 1001 certification oath before submission
- Parcel database integration: applicants search by owner name, parcel number, or address; selection prefills property data and derives True Market Value (SEV × 2)
- Server-side PDF packet generation: fills all 5 HUD AcroForms, appends uploaded documents, streams to applicant at Step 9
- Completeness scoring (0–100): distinguishes genuine applications from queue-holding placeholder submissions
- Municipality-scoped staff dashboard: status management, document review, applicant messaging, audit log
- Security: Firestore rules block all direct client writes; pre-production security audit validated PII handling
- Phase 1 launched May 20, 2026; Phase 2 (staff review workflow) targeted June 19, 2026

---

### `projects/swmpc-suite.md`

**Frontmatter:**
- title: SWMPC Website Suite
- slug: swmpc-suite
- status: complete
- category: platform
- year_started: 2025
- year_ended: 2026
- client: Southwest Michigan Planning Commission
- live_url: https://swmpc.org
- featured: true
- stack: Python, PHP, WordPress, WP-CLI, MySQL, Leaflet.js, ACF Pro, mdbtools, Custom Plugins (×8), Nexcess

**Narrative content to include:**
- Three sites built and launched under hard March 31, 2026 deadline: swmpc.org, mywaythere.org, us12heritagetrail.com
- Migration from Classic ASP / Microsoft Access infrastructure
- Data engineering pipeline: Python + mdbtools extracted from .mdb → normalized CSVs → PHP/WP-CLI import into custom post types and 11 custom database tables
- Scale: 523 meetings, 2,784 traffic count locations (custom database table with JOIN-based filtering), 576 documents (8 GB), 56 transit providers across 153 jurisdictions, 316 points of interest
- Custom Leaflet.js interactive map (us12-asset-map) with real-time taxonomy filtering and URL query parameter pre-filtering for region landing pages
- 8 custom plugins delivered including swmpc-permissions (three-tier role architecture across all three sites)
- Full redirect map for all legacy .asp URL patterns
- Strategic significance: revenue from this contract enabled DICE to hire a new staff role
- Mentored junior developer Maddie throughout the project

---

### `projects/county-plugins.md`

**Frontmatter:**
- title: County Website Plugin Ecosystem
- slug: county-plugins
- status: active
- category: platform
- year_started: 2024
- client: Van Buren County / St. Joseph County
- featured: false
- stack: PHP 8, WordPress, PostgreSQL, ACF Pro, WP-CLI, Anthropic Claude Vision API, Anthropic Batch API, Cloud SQL

**Narrative content to include:**
- The architectural decision: PostgreSQL as canonical data source, WordPress as rendering layer. 15-minute WP-Cron sync. Multi-tenant via county_id field.
- The 8 plugins: County Core (sync orchestration, WP-CLI commands, REST push endpoints, audit logging), County Menus, County Directory (staff directory with search/filter), County Documents (with archive module, expiration notification system using notification_types / department_notification_subscriptions schema), County Events (RFC 5545 recurring events + LLM-powered natural-language input option), County Forms (JotForm-backed), County Alerts (scheduling, color themes, preset library), County Alt Text (WCAG alt text via Anthropic Batch API ~$2/full media library, bulk + per-upload hook)
- Deployed across vanburencountymi.gov and stjosephcountymi.gov

---

### `projects/marty-ai.md`

**Frontmatter:**
- title: Marty AI & Government Chatbot Platform
- slug: marty-ai
- status: active
- category: agentic-ai
- year_started: 2024
- client: Van Buren County / St. Joseph County
- featured: false
- stack: Chatbase, Python, Cloud Run, BigQuery, Cloud Storage, Looker Studio, Anthropic Claude API, WordPress

**Narrative content to include:**
- Four production chatbots: Marty AI (VBC general — 5,082 conversations / 25,590 messages), Map Buddy (GIS assist — 1,580 conversations / 5,625 messages), Joey AI (SJC general), Find-a-Ride agent (mywaythere.org)
- Conversation logging pipeline for Marty: Chatbase API → NDJSON incremental writes → Cloud Storage → BigQuery → Looker Studio dashboards for usage analysis and policy monitoring
- Find-a-Ride agent: custom WordPress plugin (mwt-ride-agent) that wraps a Claude agentic loop directly via Anthropic API; integrates with the find-a-ride plugin's custom database tables to help residents find transportation options; live at mywaythere.org/find-a-ride/

---

### `projects/core-db.md`

**Frontmatter:**
- title: Core DB — County Directory Admin
- slug: core-db
- status: active
- category: full-stack
- year_started: 2024
- client: Van Buren County / St. Joseph County
- featured: false
- stack: Python, FastAPI, asyncpg, React 18, TypeScript, Vite, Cloud Run, Cloud SQL, PostgreSQL

**Narrative content to include:**
- Staff-facing admin for managing 1,000+ personnel, department, and assignment records
- OTP magic-link auth: email sent via WordPress relay → HMAC-signed session cookie; OTP only issued if email matches active record in core.people
- Audit trail: every PATCH writes before/after JSON to ops.audit_log; conflict-aware undo endpoint checks for intervening edits before allowing revert
- Async backend: asyncpg connection pooling, all DB calls non-blocking
- Full API surface (for portfolio talking points): auth, org hierarchy, people lookup, audited PATCH, audit log, revert endpoint

---

### `projects/migain-dashboard.md`

**Frontmatter:**
- title: MI-GAIN — Michigan Government AI Network
- slug: migain-dashboard
- status: active
- category: data-engineering
- year_started: 2024
- client: MI-GAIN (co-founded)
- live_url: https://dicemi.org/migain-survey-and-results/
- featured: false
- stack: Jotform, Google Sheets, Google Apps Script, Chart.js, Custom HTML/JS, WordPress, SVG

**Narrative content to include:**
- Co-founded MI-GAIN, a statewide peer network for Michigan government AI practitioners
- Built the public survey and results dashboard: Jotform → Google Sheets → Apps Script ETL (sensitive data removal, multi-select normalization) → Apps Script serving layer → live HTML/JS dashboard embedded in WordPress
- Built a complete Michigan county SVG map visualization using Chart.js showing member county representation
- Built mi-lgai-repository WordPress plugin: custom resource submission and browsing system for member governments to share AI policies, project descriptions, and technical documentation
- Coordinated with Maddie on outreach to expand county membership across Michigan

---

### `projects/skills-network.md`

**Frontmatter:**
- title: Skills & Project Network
- slug: skills-network
- status: in-progress
- category: data-engineering
- year_started: 2024
- featured: false
- stack: D3.js, React, TypeScript

**Narrative content to include:**
- Visualization of technology co-occurrence across all portfolio projects
- Each technology is a node; edges connect technologies that appear together in the same project
- Planned as a portfolio section showing systems-level thinking about technology choices
- Status: paused, planned for portfolio site v2

---

## UI Structure & Pages

### Home (`/drake-olejniczak`)

- Hero: Name, title ("AI & Data Engineer"), one-line positioning statement, links to GitHub / LinkedIn / resume PDF
- Featured projects grid (cards for projects where `featured: true`)
- Skills summary: aggregated tag cloud or compact list derived from all project stack arrays
- Brief about section: Ph.D. in mathematics → production AI engineering; working directly with stakeholders to identify and solve real problems

### Projects (`/drake-olejniczak/projects`)

- Full project grid, all projects
- Filter bar: by `category` and/or `stack` tag
- Each card shows: title, summary, stack tags (top 4-5), status badge, live_url link if present

### Project Detail (`/drake-olejniczak/projects/:slug`)

- Full markdown body rendered via `react-markdown`
- Sidebar or header: stack tags, status, client, year, live URL, repo URL
- Back to projects link

### Skills Network (`/drake-olejniczak/skills`) ← optional v1, include as stub

- D3 force-directed graph: technology nodes sized by frequency, edges by co-occurrence
- Clicking a node filters to projects using that technology
- Can be built as a stub page in v1 and filled in later

---

## Design Direction

**Aesthetic:** Precise, technical, confident. Not a creative portfolio — an engineering portfolio. Think documentation-grade clarity with intentional typographic personality. Dark mode default.

**Palette:**
- Background: `#0F1117` (near-black, not pure black)
- Surface: `#1A1D27` (cards, sidebars)
- Border: `#2A2D3A`
- Primary accent: `#4A9EFF` (electric blue — nods to data/tech without being cliché)
- Secondary accent: `#7C6AF7` (violet — for category tags, secondary UI)
- Text primary: `#E8EAF0`
- Text muted: `#7A7F94`
- Success/active: `#3DD68C`

**Typography:**
- Display: `Inter` (variable, tight tracking at large sizes) — clean, technical
- Monospace: `JetBrains Mono` — for stack tags, code references, slugs
- Both available from Google Fonts

**Signature element:** Stack tags rendered as monospace pill badges in violet — every project card has them, they're filterable, and they visually encode the technology layer of the work. Hovering a tag highlights all cards sharing that technology.

**Layout:** Two or three column card grid on desktop, single column mobile. Project detail is full-width prose with a sticky sidebar on desktop.

**Motion:** Minimal. Subtle fade-in on page load, hover lift on cards (`transform: translateY(-2px)`). No scroll animations — they read as filler here.

---

## Routing

React Router v6. Base path is `/drake-olejniczak`.

```tsx
// vite.config.ts
base: '/drake-olejniczak'

// App.tsx routes
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/projects" element={<Projects />} />
  <Route path="/projects/:slug" element={<ProjectPage />} />
  <Route path="/skills" element={<Skills />} />
</Routes>
```

Because the base path is `/drake-olejniczak`, all asset paths and router links resolve correctly under that prefix. nginx serves the same `index.html` for all paths under the prefix (SPA catch-all), and React Router handles client-side routing from there.

---

## Markdown Parsing

Use `gray-matter` for frontmatter parsing and `react-markdown` with `remark-gfm` for body rendering.

```bash
npm install gray-matter react-markdown remark-gfm
```

**Pattern for loading projects at runtime:**

Vite supports `import.meta.glob` for importing multiple files matching a pattern. Use this to load all markdown files from `projects/` without a build step or API:

```ts
// src/lib/parseProjects.ts
import matter from 'gray-matter';

const modules = import.meta.glob('../../projects/*.md', { as: 'raw', eager: true });

export function loadProjects(): Project[] {
  return Object.entries(modules).map(([path, raw]) => {
    const { data, content } = matter(raw as string);
    return { ...data, content } as Project;
  });
}
```

This runs at build time (Vite bundles the markdown files) — no server, no API, no runtime file reads. Adding a new project means adding a `.md` file and running `npm run build` (or letting the deploy script do it).

---

## Deployment: VM + nginx

### Prerequisites

The VM (`mallard-digital`) is already running nginx. You need:
- SSH access (or `gcloud compute ssh` if it's a GCE instance)
- Node.js installed on the VM (for building), or build locally and `rsync` the dist

### Build

```bash
# Local build
npm run build
# Outputs to dist/
```

### Deploy options

**Option A — Build on VM (simpler, recommended for now):**

```bash
# SSH into VM
gcloud compute ssh [INSTANCE_NAME] --zone=[ZONE] --project=[PROJECT_ID]

# On VM: clone repo, install, build
git clone https://github.com/Doogan1/mallard-digital-portfolio.git /var/www/mallard-portfolio
cd /var/www/mallard-portfolio
npm install
npm run build
# dist/ is now at /var/www/mallard-portfolio/dist/
```

**Option B — Build locally, rsync dist:**

```bash
npm run build
gcloud compute scp --recurse dist/ [INSTANCE_NAME]:/var/www/mallard-portfolio/dist --zone=[ZONE]
```

For ongoing updates with Option A, a deploy script on the VM:

```bash
#!/bin/bash
# /var/www/mallard-portfolio/deploy.sh
cd /var/www/mallard-portfolio
git pull origin main
npm install --production=false
npm run build
echo "Deploy complete: $(date)"
```

Then `bash deploy.sh` whenever you push changes.

### nginx Configuration

The key challenge here is serving an SPA under a sub-path (`/drake-olejniczak`) rather than the root. Two things nginx must do:

1. Serve static assets from the dist directory for requests under `/drake-olejniczak`
2. Return `index.html` for ALL paths under `/drake-olejniczak` (the SPA catch-all), so React Router can handle client-side navigation

Add this block to your nginx config (typically `/etc/nginx/sites-available/mallard-digital` or inside your existing `server {}` block):

```nginx
# Portfolio — Drake Olejniczak
# Serves the Vite SPA build under /drake-olejniczak
# The SPA catch-all (try_files) is essential for React Router to work:
# without it, navigating directly to /drake-olejniczak/projects/zip returns 404

location /drake-olejniczak {
    alias /var/www/mallard-portfolio/dist;
    index index.html;
    try_files $uri $uri/ /drake-olejniczak/index.html;
}

# Static assets (Vite puts hashed assets in /assets/)
# This block is optional if the above alias handles it, but explicit is safer
location /drake-olejniczak/assets/ {
    alias /var/www/mallard-portfolio/dist/assets/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**Why `alias` not `root`:** With `root`, nginx appends the location path to the root path, giving you `/var/www/mallard-portfolio/dist/drake-olejniczak` (which doesn't exist). With `alias`, nginx substitutes the location prefix entirely, giving you `/var/www/mallard-portfolio/dist` (which is exactly where Vite puts the build).

**Why `try_files` points to `/drake-olejniczak/index.html` not `/index.html`:** Because the location block prefix is `/drake-olejniczak`, the fallback path must include that prefix for nginx to resolve it correctly within the same location block.

After editing the config:

```bash
sudo nginx -t          # test config — always do this before reload
sudo nginx -s reload   # reload without dropping connections
```

### Future: adding a second portfolio (e.g., /maddie)

When Maddie's portfolio is ready, add a parallel location block:

```nginx
location /maddie {
    alias /var/www/maddie-portfolio/dist;
    index index.html;
    try_files $uri $uri/ /maddie/index.html;
}
```

No other changes needed. The two SPAs are completely independent deployments under the same nginx instance.

---

## Vite Config Note

Because the app is served under a sub-path, Vite must know the base path at build time so it generates correct asset URLs:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/drake-olejniczak/',   // trailing slash matters
})
```

Without this, Vite generates asset paths like `/assets/index-abc123.js` (root-relative), which nginx won't find because the files are actually at `/drake-olejniczak/assets/index-abc123.js`.

---

## Package.json Starting Point

```json
{
  "name": "mallard-digital-portfolio",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.24.0",
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0",
    "gray-matter": "^4.0.3"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.2",
    "vite": "^5.3.1"
  }
}
```

---

## What Claude Code Should Build in v1

### Must-have (v1 complete)
- [ ] All 8 project markdown files populated with real content per the schemas above
- [ ] `parseProjects.ts` using `import.meta.glob`
- [ ] `types.ts` with full `Project` interface matching frontmatter schema
- [ ] Home page with featured project cards and skills summary
- [ ] Projects page with full grid and category/stack filter
- [ ] Project detail page with rendered markdown and metadata sidebar
- [ ] `Nav.tsx` with links + active state
- [ ] Full design system implemented (palette, typography, card styles) per design direction above
- [ ] React Router configured with `/drake-olejniczak` base
- [ ] `vite.config.ts` with correct `base` setting
- [ ] `README.md` with deploy instructions (the nginx block above, the deploy script)

### Stub / defer to v2
- [ ] Skills network D3 visualization (create the page and route, render a "coming soon" placeholder)
- [ ] Resume PDF download link (add `public/Drake-Olejniczak-Resume.pdf` placeholder)
- [ ] Dark/light mode toggle

---

## Context Claude Code May Need

- The VM is accessed via `gcloud compute ssh` — get the instance name, zone, and project ID from Drake before running deploy commands
- The existing nginx config location is likely `/etc/nginx/sites-available/` or `/etc/nginx/nginx.conf` — check with `nginx -T | grep -n "location\|server_name\|root\|alias"` to see current structure before editing
- The repo will be at `https://github.com/Doogan1/mallard-digital-portfolio` once created
- Drake's GitHub handle is `Doogan1`
ENDOFFILE
echo "Done"