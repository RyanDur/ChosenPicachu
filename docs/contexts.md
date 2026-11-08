# The site's contexts

The code is organized by what it's about, never by what kind of file it is. Each context below is a domain in Fowler's sense of a [bounded context](https://martinfowler.com/bliki/BoundedContext.html). A context can hold subdomains, and a subdomain follows the same rules as a context. Inside a context, every `.ts` file is one module: an object named for what it does, or a function that builds one when it needs something to be built from (`AGENTS.md`, Code style). A module's behaviors serve its own context. Another context calls them as methods on the module's name, and never imports a loose helper out of it.

The map was first made from the code on `main` at 82efb32b and is redrawn as the debt pass moves files (last at c570c31e). A file sits in its context's domain. A directory holds a subdomain named here, or one part made of more than one module. A single file never gets a directory of its own (Ryan, 2026-11-08: "everything needs to be in its domain/context and somethings make sense to be in src", "not everything needs to be in a directory"). `src` itself is the application: its root holds the shell and the contexts every page shares, and it has no index, because nothing imports `src` as a module.

## Contexts and their subdomains

- **Frame**: what surrounds every page, at `src`'s root: `root.tsx`, `routes.ts`, `Site.tsx`, `SiteProviders.tsx`, `hydrateTheSite.tsx` and the entries.
  - *Page*: the room's shell. `src/page` (`Header`, `Page`, `PageError`, `SideNav`) and `pages/NoRoom`.
  - *Page name*: the name a page gives itself, in `src/page-name`.
  - *Environment*: the React side of the server settings, in `src/environment`: its provider, its context and `useEnvironment`. The values themselves are Transport's.
  - *Navigation*: addresses and arriving at them, in `src/navigation`: `Paths.ts`, `names.json`, `repository.ts`, `arrival` (the opening fragment and the landing), `search-params` and `Tabs`.
  - *Notices*: what the site tells the reader and what the reader tells it, in `src/banners` and `src/feedback`.
- **Transport**: the site's one way to reach a server, in `src/transport`: `http`, `HTTPError`, `queryString`, `trouble`, `decoded`, and the server settings (`environment`, `unconfigured`), since every value in them is a server's address, key or token. It holds no React, so the plain-script builds can read it.
- **Look**: the style vocabulary. `src/styles`, and `classNames` in `src/components`.
- **Parts**: the site's own controls, used by several contexts, in `src/components` behind its index: `Menu`, `Disclosure`, `PillGlider`, `Loading`, `DragSortableTable` (its `model` holds the column-width arithmetic, `shares`), `store` (the store, its reducers and its slices), `arrays.ts`, `useHydrated.ts`, `grip.svg`. A part moves into a context once only one context uses it.
- **Home**: `pages/Home`.
- **Record**: `pages/Record`, made up of its stories, moments, the concert, the timeline and the research shelf (`sources`). `concerns`, the three concerns the site is built by, has a folder of its own, because Practice and the rail read it and must not carry the moments with it. `components/Quotation` joins it once #311 leaves the home without a quotation.
- **Practice**: `pages/Practice`: the page, its address (`practiceAddress`) and its drawings (`drawings`).
  - *Structure*, *Presentation*, *Behavior*: one subdomain per tab, in `structure`, `presentation` and `behavior`. Each holds its tab's prose and the parts only that tab shows: the landmark map and the table carves; the class list and where a rule lives; the carves and the drawn loops.
- **Demos**: `pages/Demos`.
  - *Course*: what every tab shares. `Recipe`, `Controls` (the dials), `SavedTab`, `TabLink.tsx`, the cascade the plain-script builds share, `components/Explainer`, `components/fibs`.
  - *Market*: the live trades the charts and tables read, in `Demos/Market`: the feed (`coinbase`, its history, the period, the live-trades cap, the period history and the candles), the money formatting, and its actions, slice, store, selectors, the arranged view and the exchange, with the rules that feed the tables: the history fetch (`recentTrades`), the fold into windows (`fold`) and the cells a window shows (`cells`). `Market/Trading` holds what only the React build uses: `Trading`, the provider and the hooks. Charts reads Market through its index, and Market imports nothing from Charts. The plain-script frame imports `Market` alone, so React stays out of its bundle.
  - *Accordions*, *Z-index* (`ZIndexDemo`), *Drag sort* (`DragAndDrop`), *Charts*, *Tables*: one subdomain per tab. Each holds its own route.
- **Gallery**: `pages/Gallery`, with `components/room.ts` still outside it. `source.ts` names the museum a tab shows, and `opening.ts` the page the rail's Gallery link opens.
  - *Museums*: `pages/Gallery/museums`, one subdomain per collection: `aic`, `cleveland`, `harvard`, `vam`.
  - *Settings*: `Settings`, `Search` and `PageControl`.
- **Users**: `pages/Users`, its form fields (`FancyFormElements`) and its service worker (`usersServer`, `usersApi`).
- **Games**: `pages/Games`.

A page's `route.tsx` sits in a directory of its own, since `routes.ts` finds pages by that name.

## Where the misplaced files belong

| File today | Imported by | Belongs in |
|---|---|---|
| `components/room.ts` | the gallery only | Gallery › Settings |
| `components/fibs` | Z-index and the demos' tab routes | Demos › Course |
| `components/Explainer` | Charts and Tables | Demos › Course |
| `components/Quotation` | Home and Record (Record only after #311) | Record |

`components` is a directory named by kind. The review's design rubric already calls that a finding (`scripts/review/design.md`). Once every file above has moved, it holds only Parts, and it takes that name.
