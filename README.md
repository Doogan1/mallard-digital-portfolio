# mallard-digital-portfolio

Portfolio site for Drake Olejniczak — AI & Data Engineer.  
Served at `portfolio.mallard-digital.com/drake-olejniczak`.

**Stack:** Vite + React + TypeScript, markdown-driven project content, nginx on GCE VM.

---

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173/drake-olejniczak/`.

## Adding a Project

1. Create `projects/your-slug.md` following the frontmatter schema in any existing project file
2. Required fields: `title`, `slug`, `status`, `year_started`, `stack`, `summary`
3. Run `npm run build` (or push — deploy script handles it)

## Build

```bash
npm run build
# Outputs to dist/
```

---

## Deployment

Deployment is automated via GitHub Actions. Every push to `main` triggers a build on GitHub's
infrastructure and copies the compiled `dist/` to the VM. Node.js is **not** required on the VM.

### Required GitHub Secrets

Add these under **Settings → Secrets and variables → Actions** in the repo:

| Secret | Value |
|---|---|
| `VM_HOST` | VM external IP or hostname |
| `VM_USER` | SSH username (your GCP account username) |
| `VM_SSH_KEY` | Private SSH key (public key must be in `~/.ssh/authorized_keys` on the VM) |

**GCP note:** If the VM doesn't have a static external IP, it can change on reboot and break `VM_HOST`.
Check GCP Console → VPC Network → External IP addresses — reserve a static IP if not already done.

### First-Time VM Setup

The VM only needs the target directory and nginx configured. No Node.js required.

```bash
gcloud compute ssh [INSTANCE_NAME] --zone=[ZONE] --project=[PROJECT_ID]

# On the VM:
mkdir -p /var/www/mallard-portfolio/dist
```

Then push to `main` — the Action handles the rest.

### Manual deploy (fallback)

```bash
npm run build
gcloud compute scp --recurse dist/ [INSTANCE_NAME]:/var/www/mallard-portfolio/dist --zone=[ZONE]
```

---

## nginx Configuration

Add this block inside the existing `server {}` block (typically at `/etc/nginx/sites-available/mallard-digital`):

```nginx
# Portfolio — Drake Olejniczak
location /drake-olejniczak {
    alias /var/www/mallard-portfolio/dist;
    index index.html;
    try_files $uri $uri/ /drake-olejniczak/index.html;
}

location /drake-olejniczak/assets/ {
    alias /var/www/mallard-portfolio/dist/assets/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**Why `alias` not `root`:** `root` appends the location prefix to the path, giving you `.../dist/drake-olejniczak` (doesn't exist). `alias` substitutes the prefix entirely, giving you `.../dist`.

**Why `try_files` uses `/drake-olejniczak/index.html`:** The fallback must include the prefix so nginx resolves it within the same location block. Without this, direct navigation to any sub-route (e.g. `/drake-olejniczak/projects/zip`) returns 404.

After editing:

```bash
sudo nginx -t          # test config
sudo nginx -s reload   # reload without dropping connections
```

### Adding a second portfolio (e.g. /maddie)

```nginx
location /maddie {
    alias /var/www/maddie-portfolio/dist;
    index index.html;
    try_files $uri $uri/ /maddie/index.html;
}
```

No other changes needed.
