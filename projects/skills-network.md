---
title: Skills & Project Network
slug: skills-network
status: development
year_started: 2026
live_url: https://portfolio.mallard-digital.com/drake-olejniczak/skills
featured: false
stack:
  - D3.js
  - React
  - TypeScript
summary: >
  A D3 force-directed graph visualizing technology co-occurrence across all portfolio projects.
  Each technology is a node; edges connect technologies that appear together in the same project.
  Node size reflects frequency of use.
---

## Concept

A portfolio is a set of projects, but it's also a graph. Technologies don't appear in isolation — they appear together. FastAPI and PostgreSQL appear together constantly. Claude API shows up with pgvector. React pairs with TypeScript and Vite.

The Skills Network makes this structure visible: a force-directed graph where technology nodes are sized by how frequently they appear across projects, and edges connect technologies that co-occur in at least one project. Edge weight reflects how many projects share that pairing.

The result is a map of how I actually work — not a list of skills, but a picture of the systems-level decisions behind technology choices.

## Planned Interactions

- **Click a node** to filter the portfolio to projects using that technology
- **Hover an edge** to see which projects share both technologies
- **Size encoding**: larger nodes = more projects use this technology
- **Edge weight**: thicker edges = more co-occurrence

## Status

V1 complete and live on portfolio site.
