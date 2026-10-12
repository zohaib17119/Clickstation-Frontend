# Clickstation Fontend — Windows download portal

React (Vite) account portal for Windows software download.

## Setup

```bash
npm install
npm run dev
```

App: `http://localhost:5173` (entry `/windows`)

Env (`.env`):

- `VITE_API_URL` — backend (default `http://localhost:4000`)
- `VITE_SITE_URL` — main site links (default `https://clickstation.pk`)
- `VITE_WHATSAPP_URL` — payment / activation chat link

## Routes

- `/windows` — entry from site Downloads page
- `/login`, `/register`
- `/app` — account, payment/activation, gated download, license placeholder
- `/admin` — activate / deactivate customers

On [clickstation.pk/downloads](https://clickstation.pk/downloads), set `PUBLIC_SOFTWARE_PORTAL_URL` so Windows **Request Free Access** redirects here.
