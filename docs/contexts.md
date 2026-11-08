# The site's contexts

The code is organized by what it's about, never by what kind of file it is. Each context below is a domain in Fowler's sense of a [bounded context](https://martinfowler.com/bliki/BoundedContext.html). A context can hold subdomains, and a subdomain follows the same rules as a context. Inside a context, every `.ts` file is one module: an object named for what it does, or a function that builds one when it needs something to be built from (`AGENTS.md`, Code style). A module's behaviors serve its own context. Another context calls them as methods on the module's name, and never imports a loose helper out of it.

The map was made from the code on `main` at 82efb32b. For each shared file, it counts which contexts import it. Today's directories split some contexts by kind: `src/components/Users` and `src/pages/Users` are one context. The gallery's two halves were joined in `src/pages/Gallery` by its debt slice (3023a27c). The table at the end says where each misplaced file belongs. Files move there in the debt pass, one context per slice (Ryan, 2026-11-07: "we will then stop feature work to address the technical debt").

## Contexts and their subdomains

- **Frame**: what surrounds every page. `root.tsx`, `routes.ts`, `SiteProviders.tsx`, `entry.client.tsx`.
  - *Page*: the room, its name and its state as it arrives. `pages/BasePage`, `components/PageName`, `components/Env`, `env.ts`, `components/hydrated.ts`, `pages/NoRoom`, `pages/PageError.tsx`.
  - *Navigation*: addresses and arriving at them. `pages/Paths.ts`, `pages/names.json`, `components/search-params`, `components/Tabs`, `components/OpeningFragment`, `components/scroll` (to be replaced by the router's own restoration).
  - *Notices*: what the site tells the reader and what the reader tells it. `components/Banners`, `components/Feedback`.
- **Transport**: the site's one way to reach a server, in `src/transport`: `http.ts`, `trouble.ts`, `types.ts`, `url.ts` and `validate.ts`. The gallery's museums, the feedback form and the users' service worker reach their servers through it. The address's search params and the saved tab use its `url.ts` to write a query.
- **Look**: the style vocabulary. `src/styles`, `components/class-names`.
- **Parts**: the site's own controls, used by several contexts. `components/Menu`, `components/Disclosure`, `components/PillGlider`, `components/Loading`, `components/Table`, `components/DragSortableTable`, `components/store.ts`, `components/arrays.ts`, `components/grip.svg`. A part moves into a context once only one context uses it.
- **Home**: `pages/Home`.
- **Record**: `pages/Record`, made up of its stories, moments, the concert, the timeline and the research shelf. `components/Quotation` joins it once #311 leaves the home without a quotation.
- **Practice**: `pages/Practice`.
- **Demos**: `pages/Demos`.
  - *Course*: what every tab shares. `Recipe`, `Controls` (the dials), `Stage`, `SavedTab`, `TabLink.tsx`, `components/Explainer`, `components/fibs`.
  - *Market*: the live trades the charts and tables read, in `Demos/Market`: its actions, slice, store, selectors, the arranged view and the exchange. `Market/Trading` holds what only the React build uses: `Trading`, the provider and the hooks. The plain-script frame imports `Market` alone, so React stays out of its bundle.
  - *Accordions*, *Z-index* (`ZIndexDemo`), *Drag sort* (`DragAndDrop`, with `components/glide.ts`), *Charts*, *Tables*: one subdomain per tab. Each holds its own route, as 734456f7 arranged.
- **Gallery**: `pages/Gallery`, with `components/room.ts` still outside it. `source.ts` names the museum a tab shows, and `opening.ts` the page the rail's Gallery link opens.
  - *Museums*: `pages/Gallery/museums`, one subdomain per collection: `aic`, `cleveland`, `harvard`, `vam`.
  - *Settings*: `Settings`, `Search` and `PageControl`.
- **Users**: `pages/Users`, `components/Users` and `components/FancyFormElements`.
  - *Resource*: the users' service worker and its API.
- **Games**: `pages/Games`.

## Where the misplaced files belong

| File today | Imported by | Belongs in |
|---|---|---|
| `components/room.ts` | the gallery only | Gallery › Settings, or gone (dev-6d's note) |
| `components/scroll` | `root.tsx`, Tabs, the gallery | Frame › Navigation, or gone (dev-6d's note) |
| `components/search-params` | Demos, Gallery, Users, Banners | Frame › Navigation |
| `components/glide.ts` | Drag sort only | Demos › Drag sort |
| `components/fibs` | Z-index and the demos' tab routes | Demos › Course |
| `components/Explainer` | Charts and Tables | Demos › Course |
| `components/FancyFormElements` | Users only | Users |
| `components/Users` | `pages/Users` | Users, with `pages/Users` |
| `components/Quotation` | Home and Record (Record only after #311) | Record |
| `components/Banners`, `Feedback`, `PageName`, `Env`, `Tabs`, `OpeningFragment`, `hydrated.ts` | the frame and every page | Frame |
| `components/class-names` | nineteen places | Look, beside `src/styles` |

`components` is a directory named by kind. The review's design rubric already calls that a finding (`scripts/review/design.md`). Once every file above has moved, it holds only Parts, and it takes that name.
