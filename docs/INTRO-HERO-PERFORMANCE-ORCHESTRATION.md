# Intro, hero, and loading orchestration

Updated: 2026-10-31

## Outcome

The blocking arrival sequence, desktop scroll hero, deferred motion runtime, WebP delivery, and repeat-visit cache policy are one release unit. A release is complete only when every gate below passes; a successful build alone is not sufficient.

## Agent workstreams

| Workstream | Responsibility | Depends on | Completion gate |
| --- | --- | --- | --- |
| Intro lifecycle | Bounded 6.5–7 second state machine, focus/inert cleanup, fail-open behavior | Hero readiness signal | Overlay detaches automatically and `html` overflow is restored |
| Hero runtime | Critical-frame queue, scroll/reverse-scroll rendering, retries, reduced motion | Versioned frame manifest | Eight critical frames ready; canvas frame changes in both directions |
| Loading performance | Dynamic Lenis/GSAP imports, lazy below-fold media, cache headers | Arrival completion | Motion libraries initialize after arrival; below-fold images remain lazy |
| Media conversion | WebP hero and homepage editorial assets, extraction tooling, manifest | Source media integrity | Converted assets decode and all mapped paths exist |
| Release QA | Type, lint, data validators, production build, browser and HTTP checks | All workstreams | Every command and browser scenario below passes |

## Dependency order

1. Load the hero poster and bounded frames `0–7` with priority.
2. Load the decorative arrival film only after hero-critical readiness or its two-second fallback deadline.
3. At 6.5 seconds, enter automatically when the hero is ready.
4. At 7 seconds, fail open even if a media request failed.
5. Restore scroll and publish arrival completion when the closing fade starts.
6. Import Lenis and GSAP after arrival completion; keep founder, books, journal, gallery details, and footer media lazy.
7. Reuse versioned hero frames and cached public media on later visits.

## Implemented controls

- `muguetli:hero-critical-ready` is emitted after the first eight desktop frames decode, or after the static poster is ready on compact/reduced-motion layouts.
- `muguetli:arrival-complete` is idempotent and releases dependent motion code.
- The hero queue retries failed frames twice and grows its forward buffer after a large scroll jump.
- Hero WebP URLs use `FRAME_VERSION`; one-year immutable caching is applied to `/hero/frames/*`.
- `/media/*` uses a one-day browser cache plus 30-day stale-while-revalidate; fonts are immutable.
- `scripts/extract-hero.mjs` now produces WebP frames and a matching manifest/version.

## Verified release gates

- `pnpm exec tsc --noEmit --incremental false`
- Focused `pnpm exec oxlint` for changed runtime/config/tooling files
- `pnpm run catalog:check` — 75 designs, 126 options, 325 media files
- `pnpm run models:check` — 75/75 model records
- `git diff --check`
- `pnpm run build` — 201/201 static pages generated
- 274/274 WebP hero frames decode; new total is 10,471,486 bytes (former JPEG sequence: 20,667,865 bytes)
- Desktop browser: overlay removed, overflow restored, eight critical frames ready, forward and reverse frame progression confirmed
- Reduced motion: static one-viewport hero, zero canvas elements, normal scrolling
- Persian: automatic handoff, `lang=fa`, `dir=rtl`, no lingering overflow lock
- Browser console: zero warnings/errors in the tested English and Persian flows
- HTTP: hero cache header is immutable; media cache header includes stale-while-revalidate; MP4 range request returns `206` with `Content-Range`

## Guardrails for later edits

- Never make the close button the only exit path.
- Never wait for all 274 frames before entering the site.
- Do not eagerly import motion libraries solely to delay their effect execution.
- Keep `data-panel`, `data-panel-reveal`, and `data-panel-art` hooks intact.
- Preserve the static compact/reduced-motion fallback unless a separate mobile motion budget is approved and measured.
- Re-run extraction, manifest generation, decode checks, browser scroll checks, and cache-header checks whenever the hero source or encoder settings change.
