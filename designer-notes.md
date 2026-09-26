# Designer notes — ChosenPicachu

Project memory for the designer. Lives at the repo root; the designer reads it first and appends.

## Thesis

A webpage is three languages working in concert. HTML says what things are, CSS how they show,
JavaScript how they respond. Every demo is built twice — raw and React — and the tutorials show
the work. The site must obey its own thesis; ask whether a change makes the home page's claims
more true or less.

## Purpose (from Ryan, 2026-09-26)

The site exists to teach and to provide examples. The home page is the philosophy of how Ryan
thinks about writing frontend code. The frame the examples sit in (header, nav, tabs, controls,
prose) is to be neutral and naked; the examples themselves should look polished. Judge a frame
change by how well it disappears and an exhibit change by how well it shows.

## Style facts that are easy to get wrong

- `html { font-size: 62.5% }` → `1rem = 10px`. `--text-body` 14px, `--text-title` 18px,
  `--text-headline` 24px, `--text-caption` 12px.
- `--silk` is warm parchment `rgb(220,208,192)`, not grey. `--paper` `rgb(244,244,244)`.
  `--mint` means "tuned by a dial" in the tutorials — not decorative.
- `--measure` 75ch. Sizes are `--base-x-*`. No literal px or colors.
- Voices `.title .sub-title .paragraph .caption` + `.bold .italic .uppercase`. Surfaces
  `.paper .white .silk .rounded-corners .drop-shadow .raised .hairline-outline .padded`.
- Bare `a` is `display: flex`; inline links need `.signpost`.
- No custom fonts. Arial + the mono stack in `PriceChart.css`.
- Custom properties do not work in `@media`; `--tablet`/`--mobile` are documentation.
- `reset.css` zeroes animation, transition, and view-transition under reduced motion. No
  per-component guards.
- The route `<h1>` is in `src/pages/BasePage/Header.tsx`, outside the page. Pages start at `h2`.

## Read sets

- Style layer: `src/styles/*`, `src/index.css` — before any visual note.
- Home: `src/pages/Home/*` + `BasePage/Header.tsx`.
- Tutorials: `Demos/Recipe/Arc.tsx` and `Demos/Tutorials.css` serve BOTH `Demos/Tables/*`
  and `Demos/DragAndDrop/*`. `.design-item/.design-grip/.design-line` belong to the list sketch.
- Vanilla world: `Demos/*/Frame/*/mount.ts`; parity spec is the receipt.

## House rules

- Per-quote receipts: every quotation links, even when neighbours share a source.
- "Cell" means `<td>`. "Sort" is by rule; by hand is "arrange". "Door" is a home-page section.
- New tutorial coinages go through `<Term>`; never in a step title.
- The site's "I" is Ryan; "we" is the profession.

## Known thesis-audit results (2026-09)

Folds script-free: true. No raw colors: true. Reduced motion covers view transitions: undersold.
Keyboard twins both worlds: true. Reorder announcement: true since 2026-09-23 (an off-screen
`<output class="move-report">` in `DragSortableTable/MoveReport.tsx`, same words in the vanilla
builds), except that an eager pointer drag reports once per seat crossed → #3.

## Open work

- #2 The column resize handle can be found with a finger (40px wide on coarse pointers,
  `Table.css` coarse block; grip and toggle already 44).
- #3 A dragged column or row reports once, where it lands (eager drag writes one report per
  neighbour crossed, none at the drop; measured 2026-09-26).
- Audit cards, filed 2026-09-26: #4 roster swipe contained, #5 frame controls 44 on coarse,
  #6 demo controls 44 on coarse, #7 gallery art first on a phone (3 pts), #8 search label
  clipped at 844×390, #9 iPad scrolls the document (a decision; close with a reason if not),
  #10 games page starts under the nav.
- The stories live in GitHub Project 3, "ChosenPicachu stories",
  https://github.com/users/RyanDur/projects/3 (linked to the repo; fields Status and Points).
  File a new card with `gh issue create`, then `gh project item-add 3 --owner RyanDur --url <issue>`.
  Board order is the recommended sequence (set 2026-09-26): #9 first because it moves the frame
  and #5/#10 sit in the same sheet; #4 (one line); #7 then #8, which share the search box and #8
  may fall out of #7; #5, #2, #6 as one pass on the 44px floor, frame before exhibits; #10; #3
  last, independent, in the drag reducer. No hard blocks.
- The first eight cards (drafted 2026-08-23) were checked against the source on 2026-09-26:
  001 phone scrolls, 002 no filter no row, 003 controls fold, 004 accordions one per row and
  006 step stacks first had shipped the same day they were drafted (852d50e5, c49452a4);
  007 table swipe stays was withdrawn on measurement; 005 and 008 were rewritten as #2 and #3.
  There is no stories/ folder in the repo: the issues are the cards.
- Responsive reasoning in `~/Downloads/responsive-layout-spec (1).md` (466 lines); not yet in the
  repo.

## Responsive audit (2026-09-26, dist build, 10 routes × 6 viewports, touch on phone/iPad)

Passing: document never wider than the viewport anywhere; Home and every demos tab start at
76px (9%) on a 390 phone and scroll as a document; tab strips, code blocks, tutorial tables and
the aggregations section all scroll sideways with `overscroll-behavior-x: contain`; the table's
grip and sort toggle are 44 on coarse pointers.

Failing, ranked:
1. Users roster `section.user-candidates` (`UsersPage.css:21`) is `overflow: auto` with
   overscroll `auto`: 648 wide in a 374 box at 390×844, a swipe can leave the page.
2. Coarse-pointer floor was applied to `DragSortableTable` only. Under 44 on touch: users row
   menu toggle 20×20 (`UsersPage.css:54`), list grips 20×20 (`DragAndDrop/Item.css:29`), site
   nav links 50×21 at ≤1000 (`BasePage.css:223` height unset) and 39×24 landscape, explainer
   summaries 14px tall (`DemosPage.css:32`), chart period toggle 51×21 (`chart-card.css:9`),
   banner dismiss 24×24, gallery reset/submit 23px tall in landscape.
3. Gallery chrome before the first work: 260px = 67% at 844×390, 324px = 38% at 390×844,
   27% at 507. Header 80 + nav 48 + search aside `min-height` 112 (`BasePage.css:195`) +
   museum tabs 80 (`Tabs.css:12`).
4. At 844×390 the "Search For:" label is clipped under the header edge: `.gallery-search`
   inherits the header row height (`BasePage.css:177`) and `.search` rows are `20% 1fr 30%`
   (`Search.css:45`).
5. iPad (820 and 1180 wide) keeps the fixed frame with `main` as the scroller; only ≤600 and
   landscape phones scroll the document. A decision, not a defect; noted.
6. Near wrap: z-index controls `li.control` wraps by 14px at 390; `header.step-heading` has 1px
   slack. Reads fine stacked.
7. Games stub is centred by `.app-main`'s `space-evenly`: first content at 48–52% everywhere.

Inline `.signpost` links at 14–16px tall are exempt (inline text).

## Measuring

`node scripts/lighthouse/server.mjs` serves `dist/` at `http://localhost:4517/ChosenPicachu/`;
the e2e page objects in `e2e/__test_support/frame.ts` find headers by `columnheader` role and
drag with 16 mouse steps. The first `th` is the row-header column and does not drag.
