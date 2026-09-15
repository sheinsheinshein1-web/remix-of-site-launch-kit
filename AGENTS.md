# Project UI instructions

Before adding, enriching or changing manufacturer/project data, read `docs/MANUFACTURER_PLATFORM_OPERATIONS.md`. It is the authoritative architecture and editorial operations contract for the manufacturer platform. A local convenience shortcut must not override its single-source, audit-separation or release-gate rules.

Before making any UI or UX change in this repository, read `docs/DESIGN_SYSTEM.md` and reuse existing shared components. Do not invent a new visual variant when a documented component already exists.

The rules in `docs/DESIGN_SYSTEM.md` are project requirements and override generic style suggestions. In particular, use `src/components/VerifiedBadge.tsx` for every visible `Проверено` badge and never add an icon inside that badge.

Never add decorative horizontal dividers between page sections or above the shared footer. Do not use `border-t`, `border-b`, `<hr>` or pseudo-element lines to separate page blocks. Borders are allowed only inside functional controls, tables, FAQ rows and other explicitly documented interactive components. The single subtle divider between the two desktop navigation rows in the shared header is an intentional functional exception; do not reuse it as a section separator.

## Manufacturer onboarding completion gate

Adding or enriching a manufacturer is a source-audit task, not just creating its registry entry. Before reporting the manufacturer as complete:

1. Crawl the complete official catalog, including pagination, category pages and product links surfaced through “other projects”; import every distinct current product or document an explicit exclusion.
2. Check the official contacts, office/production locations, portfolio, legal documents, independent review sources and first-party testimonials.
3. Fill `profile.sourceAudit` with the audit date, official catalog count and an explicit status plus source and note for legal data, reviews, built objects, production/office location, YouTube and Telegram. Never silently omit a section.
4. The number of projects linked by `manufacturerId` must equal `sourceAudit.catalog.expectedProjectCount`; the registry test is a release gate.
5. Do not attach a legal entity to a brand unless the official source and public registry provide a defensible identity match. Record uncertain evidence as `unverified` instead.
6. Do not treat testimonials published on the manufacturer’s own site as an independent rating. Record them as `first-party-only` unless a verified external provider exists.
7. Verify that all imported project routes are included in prerender and sitemap generation, then run the manufacturer registry, presentation and editorial tests.
8. In the handoff, state what was imported, what was excluded and why. Do not say “complete” while an audit item is absent or unexplained.

## Canonical manufacturer UI contract

Do not rely on conversation memory for manufacturer-page behavior. The production contract is encoded in `docs/DESIGN_SYSTEM.md`, the shared selectors/components, and release-gate tests.

The canonical visual and behavioral reference is `/proizvoditeli/platforma/`. When a shared change makes another manufacturer diverge from that page, treat the divergence as a regression unless the user explicitly changes the contract.

1. Every production manufacturer page uses `src/pages/ManufacturerProfile.tsx`; never add a manufacturer-specific production layout or a condition by manufacturer id.
2. The review section always exposes the two canonical sources `Яндекс` and `Много места`. Missing data renders a truthful empty state and never removes the source tab.
3. Every audited profile keeps the canonical section skeleton: about, projects, legal data, built objects, production/office, reviews and social media. Missing legal data, portfolio, location or social source renders its explicit audit state instead of removing the section.
4. `Дома` and `Бани` are mutually exclusive object types. `Для бизнеса` is an overlapping use-case view and may repeat cards from those object types. Empty object-type tabs are hidden.
5. A rule is not considered implemented until a shared implementation and a regression test cover every audited Yekaterinburg manufacturer, including missing-data states. Do not maintain manufacturer-name allowlists for shared profile or project behavior.
6. Every source-backed Yekaterinburg project uses the canonical expanded project description. Publication readiness must be decided from verified project fields, never from a manufacturer-name allowlist.
