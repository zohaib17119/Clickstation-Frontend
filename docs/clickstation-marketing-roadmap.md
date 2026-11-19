# ClickStation marketing-site roadmap

## Audit snapshot

- **Stack:** Vite 6, React 19, TypeScript, React Router 7, and a single global stylesheet. There is no animation, form, SEO, testing, or analytics dependency to preserve or replace.
- **Public product surface:** the original repository exposed `/`, `/features`, `/pricing`, and `/download`; this implementation adds dedicated product, template, experiences, workflow, use-case, gallery, resources, contact, and canonical `/downloads` pages. `/download` and `/windows` remain as redirects so existing entry links are preserved.
- **Customer portal:** `/login`, `/register`, `/app`, and `/admin` stay protected by the existing `AuthProvider` and `RequireAuth`. Do not move the `cs_token` storage or change their routes as part of marketing work.
- **Backend/API contract retained:** authentication (`/auth/login`, `/auth/register`, `/me`); entitlement/download (`/me/subscription/request-review`, `/me/download/windows`); public/admin plans; customer subscription management; cloud R2 settings; and camera compatibility endpoints. Marketing pages make no new API calls except the existing public plan list on pricing.
- **Assets available locally:** logo, an interface composite, and a laptop product image. There are no local event photos, full-res desktop captures, testimonials, customer-logo permissions, or verified metrics. The Gallery page documents the exact next captures required instead of inventing them.
- **Deployed-site observation:** the existing deployed Windows portal contains unsupported public figures. Do not carry those figures into the redesigned marketing site until they are verifiable and approved.

## Design-system ownership

| Concern | Files |
| --- | --- |
| Global tokens, responsive layouts, motion, reduced-motion support | `src/styles.css` |
| Public/portal separation and footer | `src/components/Layout.tsx` |
| Reusable hero, section, product-shot, check-list, and CTA patterns | `src/components/Marketing.tsx` |
| Per-page title, description, canonical URL, and client-side Open Graph updates | `src/components/Seo.tsx` |
| Route map | `src/App.tsx` |

## W1 — Audit and architecture

**Implementation order**

1. Keep the existing `AuthProvider`, `RequireAuth`, `api/client.ts`, `api/types.ts`, `AppPage`, and `AdminPage` untouched except where a route link needs its maintained alias.
2. Use `Layout` for a public-product navigation plus a separate customer-portal entry point. Never mix account controls into conversion copy.
3. Add `Seo` and use it on every public page. Keep the generic static metadata in `index.html` for the initial document response.
4. Establish CSS tokens and reusable marketing building blocks before adding page-specific layout.

**Responsive and animation requirements**

- Mobile navigation groups product links and portal links separately.
- Layouts shift to a single column below the desktop breakpoint; comparisons and process grids shrink before collapsing.
- Entrance animations are CSS-only and disabled with `prefers-reduced-motion`.

**Risks and acceptance criteria**

- Risk: public navigation makes users think authentication lives in marketing pages. Mitigation: a distinct “Customer portal” route and portal-only download/activation controls.
- Test: unauthenticated `/app` redirects to `/login`; non-admin `/admin` redirects to `/app`; `/download` and `/windows` resolve to `/downloads`; existing environment variables keep working.

## W2 — Homepage redesign

**Files and components**

- `src/pages/HomePage.tsx`
- `src/components/Marketing.tsx`
- `src/styles.css`

**Sections in order**

1. Product-positioning hero with demo and Windows-download calls to action.
2. Four-step event workflow.
3. Product-control story using the existing laptop image.
4. Capability grid: capture, design, experiences, delivery, organisation, and offline operation.
5. Audience paths for photographers, rental businesses, and event agencies.
6. Honest plan-preview framework, Help Center FAQ preview, and final conversion band.

**Assets required to complete the visual story**

- A real 16:9 video of a complete session.
- A high-resolution capture-screen recording and designer-screen recording.
- Consented event photos that include branded output and the booth in use.

**Acceptance criteria**

- Above the fold communicates audience, platform, and primary outcome without an invented statistic.
- Each CTA leads to a real local route or an existing configured support channel.
- Current screenshots use native lazy-loading below the hero.

## W3 — Product pages and content

**Files and pages**

- `FeaturesPage.tsx` — capture, creation, and delivery capabilities.
- `TemplateDesignerPage.tsx` — template workflow, output configuration, and the exact designer scope.
- `ExperiencesPage.tsx` — photo, GIF, boomerang, and video options.
- `HowItWorksPage.tsx` — preparation through delivery.
- `UseCasesPage.tsx` — photographers, rental businesses, and event agencies.
- `GalleryPage.tsx` — current assets plus production-capture brief.
- `ResourcesPage.tsx` — setup, operating, account, and licensing guidance.

**Content rules**

- Only communicate the capabilities confirmed by the product brief and existing implementation: DSLR/webcam capture, templates, strips/collages, GIF/boomerang/video, filters/chroma key/AI backgrounds, printing, QR, local/R2-backed storage, event/gallery management, and 72-hour offline grace.
- Do not add 360 capture, WhatsApp delivery, cloud-storage quotas, device counts, customer testimonials, reviews, or metrics until their product/legal owners approve the corresponding evidence.

**Next asset capture list**

1. Attract screen through final acceptance.
2. Template designer canvas, layers, properties, and final export.
3. Final photo to physical print and QR retrieval.
4. Each real photo-experience type, including chroma key and AI-background evidence.
5. Event gallery and local/cloud delivery workflow.
6. Account activation and license-status walkthrough.

## W4 — Pricing, conversion, and customer journey

**Files and integration points**

- `src/pages/PricingPage.tsx` retains `api.listPlans()` so active backend plans remain the source of truth.
- `src/pages/ContactPage.tsx` uses `VITE_WHATSAPP_URL` if configured; it intentionally does not pretend an unconnected lead form sends data.
- `src/pages/DownloadPage.tsx`, `src/pages/AppPage.tsx`, `src/api/client.ts`, and `src/api/types.ts` retain the download and entitlement path.

**Stripe implementation order (not live yet)**

1. Confirm the source of truth for Starter, Professional, and Business: currency, price, interval, feature entitlements, device limits, storage limits, and trial terms.
2. Add a backend checkout-session endpoint that maps a public catalog plan to a Stripe Price ID; never expose Stripe secret values in Vite variables.
3. Add a signed Stripe webhook handler that idempotently updates subscription status, period dates, plan ID, and entitlement.
4. Add a billing-portal endpoint and show customer billing state in `/app`.
5. Test payment success, failure, cancellation, renewal, webhook replay, plan changes, download revocation, and offline-grace behaviour.

**Acceptance criteria**

- Static plan names do not imply a live payment product.
- Public price cards load only active catalog plans.
- An activated account can retain its existing authorised download path, while a non-entitled account cannot.

## W5 — SEO, performance, accessibility, and launch QA

**Completed foundation**

- Semantic page sections, headings, lists, descriptive image alternatives, disclosure FAQs, page titles/descriptions, canonical URLs, and client-side OG updates.
- Images below hero content use `loading="lazy"`.
- Responsive styles and reduced-motion support are included without a new animation package.

**Follow-on work before launch**

1. Generate static server/pre-rendered metadata if search-engine social crawlers need route-specific tags without JavaScript.
2. Add page-specific OG images only after approved product and event imagery exists.
3. Add `Product` and `SoftwareApplication` JSON-LD only after verified publisher, operating-system, pricing, and support details are available.
4. Run Lighthouse on desktop and mobile; convert oversized PNGs, create WebP/AVIF variants, and supply `srcset`/sized images for approved production media.
5. Test keyboard navigation, visible focus, skip navigation, contrast, zoom to 200%, screen reader headings, mobile menu, reduced motion, and error states for `/plans`.
6. Add route-level analytics events only after an approved privacy/consent strategy exists.

## Final verification checklist

- `npm run build` succeeds.
- Directly visit every public route and test desktop plus mobile navigation.
- Check all public route titles/descriptions in the final build.
- Exercise sign-up, sign-in, protected-route redirect, plan loading, authorised download, admin-only redirect, and sign-out against a non-production test backend.
- Verify every event photo has permission to be used internationally and every product claim has a product owner.
