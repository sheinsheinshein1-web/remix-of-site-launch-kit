# Project UI instructions

Before making any UI or UX change in this repository, read `docs/DESIGN_SYSTEM.md` and reuse existing shared components. Do not invent a new visual variant when a documented component already exists.

The rules in `docs/DESIGN_SYSTEM.md` are project requirements and override generic style suggestions. In particular, use `src/components/VerifiedBadge.tsx` for every visible `Проверено` badge and never add an icon inside that badge.

Never add decorative horizontal dividers between page sections or above the shared footer. Do not use `border-t`, `border-b`, `<hr>` or pseudo-element lines to separate page blocks. Borders are allowed only inside functional controls, tables, FAQ rows and other explicitly documented interactive components. The single subtle divider between the two desktop navigation rows in the shared header is an intentional functional exception; do not reuse it as a section separator.
