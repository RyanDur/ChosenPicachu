# The site's contexts

The code is organized by what it's about, never by what kind of file it is. Each context below is a domain in Fowler's sense of a [bounded context](https://martinfowler.com/bliki/BoundedContext.html). A context can hold subdomains, and a subdomain follows the same rules as a context. Inside a context, every `.ts` file is one module: one function that returns an object of behaviors (`AGENTS.md`, Code style). A module's behaviors serve its own context. Another context reaches them only by calling that module's one function, and never by importing a loose helper out of it.

The map was made from the code on `main` at 82efb32b. For each shared file, it counts which contexts import it. Today's directories split some contexts by kind: `src/components/art-gallery` and `src/pages/Gallery` are one context, and `src/components/Users` and `src/pages/Users` are another. The table at the end says where each misplaced file belongs. Files move there when a commit touches them, never in a sweep (Ryan, 2026-11-07).

## Contexts and their subdomains

- **Frame**: what surrounds every page. `root.tsx`, `routes.ts`, `SiteProviders.tsx`, `entry.client.tsx`.
  - *Page*: the room, its name and its state as it arrives. `pages/BasePage`, `components/PageName`, `components/Env`, `env.ts`, `components/hydrated.ts`, `pages/NoRoom`, `pages/PageError.tsx`.
  - *Navigation*: addresses and arriving at them. `pages/Paths.ts`, `pages/names.json`, `components/search-params.ts`, `components/Tabs`, `components/OpeningFragment`, `components/scroll.ts` (to be replaced by the router's own restoration).
  - *Notices*: what the site tells the reader and what the reader tells it. `components/Banners`, `components/Feedback`.
- **Transport**: the site's one way to reach a server. `transport/http.ts`, `transport/trouble.ts`. The gallery's museums and the feedback form use it.
- **Look**: the style vocabulary. `src/styles`, `components/class-names.ts`.
- **Parts**: the site's own controls, used by several contexts. `components/Menu`, `components/Disclosure`, `components/PillGlider`, `components/Loading`, `components/Table`, `components/DragSortableTable`, `components/store.ts`, `components/arrays.ts`, `components/grip.svg`. A part moves into a context once only one context uses it.
- **Home**: `pages/Home`.
- **Record**: `pages/Record`, made up of its stories, moments, the concert, the timeline and the research shelf. `components/Quotation` joins it once #311 leaves the home without a quotation.
- **Practice**: `pages/Practice`.
- **Demos**: `pages/Demos`.
  - *Course*: what every tab shares. `Recipe`, `Controls` (the dials), `Stage`, `SavedTab`, `TabLink.tsx`, `components/Explainer`, `components/fibs`.
  - *Market*: the live trades the charts and tables read. `exchange.ts`, `useExchange.ts`, `store.ts`, `Trading.tsx`, `Provider.tsx`.
  - *Accordions*, *Z-index* (`ZIndexDemo`), *Drag sort* (`DragAndDrop`, with `components/glide.ts`), *Charts*, *Tables*: one subdomain per tab. Each holds its own route, as 734456f7 arranged.
- **Gallery**: `pages/Gallery` and `components/art-gallery`, with `components/room.ts`.
  - *Museums*: one subdomain per collection: `aic`, `cleveland`, `harvard`, `vam`.
  - *Settings*: search and page control.
- **Users**: `pages/Users`, `components/Users` and `components/FancyFormElements`.
  - *Resource*: the users' service worker and its API.
- **Games**: `pages/Games`.

## Where the misplaced files belong

| File today | Imported by | Belongs in |
|---|---|---|
| `components/room.ts` | the gallery only | Gallery › Settings, or gone (dev-6d's note) |
| `components/scroll.ts` | `root.tsx`, Tabs, the gallery | Frame › Navigation, or gone (dev-6d's note) |
| `components/search-params.ts` | twelve places across Demos, Gallery, Users, Banners | Frame › Navigation |
| `components/glide.ts` | Drag sort only | Demos › Drag sort |
| `components/fibs` | Z-index and the demos' tab routes | Demos › Course |
| `components/Explainer` | Charts and Tables | Demos › Course |
| `components/FancyFormElements` | Users only | Users |
| `components/art-gallery` | `pages/Gallery`, BasePage | Gallery, with `pages/Gallery` |
| `components/Users` | `pages/Users` | Users, with `pages/Users` |
| `components/Quotation` | Home and Record (Record only after #311) | Record |
| `components/Banners`, `Feedback`, `PageName`, `Env`, `Tabs`, `OpeningFragment`, `hydrated.ts` | the frame and every page | Frame |
| `components/class-names.ts` | nineteen places | Look, beside `src/styles` |

`components` is a directory named by kind. The review's design rubric already calls that a finding (`scripts/review/design.md`). Once every file above has moved, it holds only Parts, and it takes that name.
