---
title: Skills & Project Network
slug: skills-network
status: live
year_started: 2026
live_url: https://portfolio.mallard-digital.com/drake-olejniczak/skills
featured: false
stack:
  - D3.js
  - React
  - TypeScript
  - GitHub Actions
summary: >
  A D3 force-directed graph of technology co-occurrence across portfolio projects — live on
  the site, rebuilt on every push to main via GitHub Actions when project stack data changes.
---

## Concept

A portfolio is a set of projects, but it's also a graph. Technologies don't appear in isolation — they appear together. FastAPI and PostgreSQL appear together constantly. Claude API shows up with pgvector. React pairs with TypeScript and Vite.

The Skills Network makes this structure visible: a force-directed graph where technology nodes are sized by how frequently they appear across projects, and edges connect technologies that co-occur in at least one project. Edge weight reflects how many projects share that pairing. Nodes are color-coded by skill category (web, backend, data, DevOps, etc.) using the same taxonomy as project tags sitewide.

The result is a map of how I actually work — not a list of skills, but a picture of the systems-level decisions behind technology choices.

## Interactions

- **Click a node** — navigate to the projects page filtered by that stack tag
- **Hover a node** — highlight connected technologies and show which projects use it
- **Category legend** — filter the graph to one skill category (Web Development, Data Engineering, DevOps & CI/CD, …)
- **Zoom & pan** — scroll to zoom, drag the canvas, double-click or controls to reset
- **Size encoding** — larger nodes = more projects use that technology
- **Edge weight** — thicker edges = stronger co-occurrence across projects

## Deployment

The graph is not a separate service — it is part of this portfolio repo. On every **push to `main`**, GitHub Actions runs `npm ci` and `npm run build`, then deploys `dist/` to the production VM. Any change to project markdown frontmatter (new stack tags, consolidated skills, new projects) shows up in the network on the next deploy without a manual rebuild.

That keeps the visualization honest: it always reflects the same `projects/*.md` source data as the rest of the site.
