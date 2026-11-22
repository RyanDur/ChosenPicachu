# Welcome

I'm just screwing around working on stuff that might be useful

[The Site](https://ryandur.github.io/ChosenPicachu/)

The gallery pulls from three museum APIs: [The Art Institute of Chicago](https://api.artic.edu/docs/),
[Harvard Art Museums](https://harvardartmuseums.org/collections/api), and
[The Victoria and Albert Museum](https://developers.vam.ac.uk/).

## Running it

`@ryandur/sand` installs from GitHub Packages, so npm needs a token with `read:packages` in your
`~/.npmrc`:

```
//npm.pkg.github.com/:_authToken=<your token>
```

The museum domains and keys live in an untracked `.env` (AIC and the V&A need no key; Harvard's is
free at the link above):

```
VITE_APP_API_AIC=https://api.artic.edu/api/v1/artworks
VITE_APP_HARVARD_API=https://api.harvardartmuseums.org/object
VITE_APP_HARVARD_API_KEY=<your key>
VITE_APP_VAM_API=https://api.vam.ac.uk/v2
VITE_APP_USERS_API=/api/users
```

The users have no server of their own. A service worker shipped with the site answers that path
from a roster it draws on every load, in dev and in prod alike, so the last line only says where
the page should ask.

Then the usual:

```shell
npm install
npm run dev
npm test
```

## Running a demo rendered on the server

The site is built ahead of time and served as files. `npm run ssr` serves it another way: it builds the site into `build-ssr/` without writing any pages, then renders each page on port 4520 when a browser asks for it.

```shell
npm run ssr
```

Once it prints `stub ready on 4520`, open http://localhost:4520/ChosenPicachu/demos/accordions/ and view the page source. The text of every accordion is in the HTML the server sent, before any script runs.

To run the Accordions journeys against it, leave it running and point Playwright at its port from a second terminal:

```shell
STAGE_PORT=4520 npx playwright test e2e/accordions.e2e.ts e2e/accordions-measured.e2e.ts e2e/accordion-parts.e2e.ts
```

## Checks

Every pull request that changes code runs the linters, the typecheck, the unit tests, the production build, the journeys,
Lighthouse and the review before it can merge, and nothing reaches main any other way. A pull request of documents alone gets only the review. There is no git hook, so run
the linters before a push: `npm run lint`, `npm run lint:css` and `npm run lint:style`.
CI smoke-tests the deployed site.
