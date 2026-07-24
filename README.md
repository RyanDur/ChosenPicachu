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
```

Then the usual:

```shell
npm install
npm run dev
npm test
```

## Git hooks

Activate the repo's quality gates once per clone:

```bash
git config core.hooksPath scripts/git-hooks
```

`pre-commit` runs lint, typecheck, and the unit suite in seconds;
`pre-push` adds stylelint and the production build. CI audits the
deployed site (smoke, axe, Lighthouse) — the hooks catch everything
catchable before the round-trip.
