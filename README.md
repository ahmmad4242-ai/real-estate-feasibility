# Real Estate Feasibility Pro | دراسة الجدوى العقارية المتقدمة

## 1. Project Overview
- **Name:** Real Estate Feasibility Pro
- **Goal:** Provide a bilingual (Arabic/English) feasibility and financial analysis workspace for mixed-use real estate projects.
- **Current Scope:** Land/acquisition modelling, uses management, cost and revenue aggregation, KPI snapshots, and i18n infrastructure. The legacy cash-flow engine has been intentionally disabled pending a redesigned integration.

## 2. System Status (October 2025)
| Module / Feature | Status | Notes |
| ---------------- | ------ | ----- |
| Cost system + breakdowns | ✅ Active | Full GFA/GLA cost allocation with extra cost factors.
| Revenue modelling | ✅ Active | Rental & sales income aggregation with occupancy handling.
| OPEX & KPI snapshots | ✅ Active | NOI, gross yield, net yield derived from active revenue streams.
| Translation guard rails | ✅ Active | `public/static/app.js` maintains i18n safety layers and RTL/LTR helpers.
| Cash-flow analytics (tables + charts) | 🚫 Disabled | All render/update routines now stubbed in `public/static/app.js` & `src/index.tsx`.
| Legacy debug/test microsites | ⚠️ Archived | Routes now show maintenance messages via `renderDeprecatedPage` helper.

## 3. Key Routes & Endpoints
| Route | Method | Purpose |
| ----- | ------ | ------- |
| `/` | GET | Main single-page experience with costs/revenues/KPI dashboards.
| `/enhanced-uses` | GET | Standalone “Enhanced Uses” sandbox (React-in-HTML prototype).
| `/api/calculate` | POST | Server-side calculation of GFA/GLA, cost & revenue breakdowns, NOI, and simple KPI set.
| `/api/translations/:lang` | GET | Returns static translation bundle for requested language (fallback to `en`).
| `/api/test-cashflow` | GET | Returns JSON flagging the cash-flow system as **disabled** until the new engine ships.
| `/debug-test`, `/investment-update-test`, `/custom-categories`, `/investment-test`, `/test`, `/investment-root-fix-test`, `/investment-stability-test`, `/debug-investment-value` | GET | Each now responds with a short maintenance notice produced by `renderDeprecatedPage(..)`; no legacy HTML payloads remain.

Static assets are served from `/public/static` through `serveStatic` with `nodejs_compat` enabled.

## 4. Tech Stack & Tooling
- **Runtime:** Cloudflare Pages / Workers (edge), Hono 4.x.
- **Build tooling:** Vite 6.x for bundling; `@hono/vite-build` for Worker output.
- **CLI:** `wrangler` **4.42.0** (upgraded from 4.4.0), with `compatibility_date = 2025-09-22` and `nodejs_compat` flag.
- **Languages:** TypeScript for Worker (`src/index.tsx`), vanilla JS in `public/static/app.js`.
- **Process manager (sandbox):** PM2 (see `ecosystem.config.cjs`).

## 5. Local Development & Testing
```bash
npm install          # installs/updates deps (wrangler 4.42.0 included)
npm run build        # produces dist/_worker.js and front-end bundle
npm run dev          # Vite dev server (default 5173)
npm run dev:sandbox  # Cloudflare Pages dev server on port 3000 (uses wrangler)
npm run pm2:start    # Start the wrangler dev daemon under PM2 in sandbox
```
Validation quick checks:
- `npm run test:dev` (ping Vite), `npm run test:preview`, `npm run test` for combined curl probes.
- Inspect `pm2 logs webapp --nostream` for runtime warnings.

## 6. Deployment Notes
1. **Build:** `npm run build` (required before wrangler dev/deploy).
2. **Preview (local Workers runtime):** `wrangler pages dev dist --ip 0.0.0.0 --port 3000` (wrapped by `dev:sandbox`).
3. **Production deploy:** `npm run deploy` (uses configured Cloudflare project name `webapp`).
4. **Secrets / Bindings:** None currently defined. Future storage (KV/D1/R2) can be set via commented templates in `wrangler.jsonc`.
5. **Compatibility:** Keep `compatibility_date` at or below production deployment date; adjust if adopting new Workers APIs.

## 7. Cleanup & Safe Deletion Notes
- **Cash-flow stubs:**
  - `public/static/app.js` functions `renderCashFlowChart`, `renderCashFlowTable`, `updateCashFlowSummary`, and `initializeCashFlowAutoUpdate` now log informative “disabled” messages and early-return.
  - `src/index.tsx` functions `calculateCashFlow`, `renderCashFlowChart`, and `updateCashFlowTable` mirror that behaviour (clearing DOM targets and returning `null`). Summary badges set `—` placeholders.
- **Legacy guards:** `(function installCashFlowChartGuard)` and related Chart.js bootstrap logic removed from the production bundle.
- **Maintenance pages:** `renderDeprecatedPage(..)` centralises the placeholder HTML for previously large debug/test routes.
- **Obsolete backups:** `public/static/app.js.backup` and `dist/static/app.js.backup` deleted to prevent regression to deprecated logic (refer to backup archive if you need them).
- **API signalling:** `/api/test-cashflow` explicitly reports the disabled state for monitoring dashboards.
- **Backup archive:** `webapp_pre_cleanup_backup.tar.gz` was generated via `ProjectBackup` prior to edits and is available for download from the session artifacts.

### Restoring/Extending Cash-Flow Functionality
1. Reimplement calculation & rendering logic inside the stubbed functions mentioned above.
2. Re-enable UI triggers within `DOMContentLoaded` handlers in `public/static/app.js`.
3. Replace maintenance responses in placeholder routes once the new subsystem ships.
4. Update `/api/test-cashflow` to expose the new health status.

## 8. Recommended Next Steps
1. **Design the new cash-flow engine** (data model, chart strategy, Worker API surface) and replace stubs accordingly.
2. **Audit translation & test assets** – many README references to historic `.js` snippets (e.g., `i18n_guards_v2_test.js`) can migrate to a docs folder or modern test framework.
3. **Confirm Tailwind runtime warnings** – rerun the build after re-enabling components to ensure no purged classes are required.
4. **Evaluate persistence** – if long-term storage is required, integrate Cloudflare D1 or KV (placeholders already present in `wrangler.jsonc`).
5. **Harmonise developer tooling** – streamline scripts or adopt `npm run lint` / `npm run fmt` once ESLint/Prettier are configured.

## 9. Changelog (2025-10-04)
- Removed legacy cash-flow logic and replaced with explicit placeholder stubs in both front-end and Worker layers.
- Replaced eight large debug/test HTML routes with succinct maintenance pages powered by `renderDeprecatedPage`.
- Upgraded `wrangler` to 4.42.0 and refreshed `package-lock.json` via `npm install`.
- Deleted obsolete `app.js.backup` artifacts from `public/static` and `dist/static`.
- Documented state of disabled modules, deployment workflow, and recovery steps in this README.

## 10. Contact & Support
For further enhancements or to resume cash-flow development, consolidate requirements and restore from `webapp_pre_cleanup_backup.tar.gz` if necessary, then iterate within the stub locations referenced above.
