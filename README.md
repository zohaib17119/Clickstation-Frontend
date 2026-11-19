# ClickStation — marketing site and Windows customer portal

React (Vite) SaaS marketing website with an authenticated Windows software customer portal.

## Setup

```bash
npm install
npm run dev
```

App: `http://localhost:5173`

Env (`.env`):

- `VITE_API_URL` — backend (default `http://localhost:4000`)
- `VITE_WHATSAPP_URL` — payment / activation chat link
- `VITE_LOGO_URL` — optional externally hosted ClickStation logo

## Routes

- Marketing: `/`, `/features`, `/template-designer`, `/photo-experiences`, `/how-it-works`, `/use-cases`, `/gallery`, `/pricing`, `/downloads`, `/resources`, `/contact`
- Compatibility aliases: `/download` and `/windows` redirect to `/downloads`
- Customer portal: `/login`, `/register`, `/app` (account, activation, and authorised download)
- Admin: `/admin` (subscription, cloud-storage, plan, and camera-management controls)

The public marketing site intentionally does not replace the portal APIs. See [the marketing roadmap](docs/clickstation-marketing-roadmap.md) for the retained integrations, asset-capture brief, and future Stripe work.
