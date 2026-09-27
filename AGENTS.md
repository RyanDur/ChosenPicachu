# ChosenPicachu

A React and TypeScript site whose home page states its own principles in three doors: what things are, how they show, how they respond. The code is meant to hold those words up. Every agent working here reads this file first; the pipeline's reviewers are listed at the end.

## Setup

- `npm ci` installs, and its postinstall applies the platform patches in `patches/`.
- `git config core.hooksPath scripts/git-hooks` turns on the hooks that guard every commit and push.
- `npm run dev` serves the site. Feedback appears only with `VITE_APP_FEEDBACK_TOKEN` in `.env`: any value shows it, and a real fine-grained token sends. Never commit a real token.
- `npm run build` typechecks and builds `dist/`.

## Testing

- Unit and component specs: `npx vitest run`. Journeys: `npx playwright test`, against the stub stage, `scripts/lighthouse/server.mjs` on port 4517, which Playwright starts or reuses.
- The hooks run the gates. Pre-commit runs `oxlint`, `stylelint`, `eslint`, `tsc -b` and vitest; pre-push builds and walks every journey. Run any check by hand when you need it; the hooks make sure it runs.
- Tests pin behaviour, what a reader does or meets, not looks or CSS values. Looks are checked by screenshot before a commit. A sentence a card promises has a test.
- Tests find what a reader finds: by role, label and text, never by class. Page objects live in the owner's `__test_support`.
- A test that passes only on retry or alone is a defect. Before blaming a test, check the machine: `pmset -g adapter` should show the full charger, and a killed Playwright run can leave its stage server on 4517 for later runs to reuse.
- While someone else verifies from this checkout, leave its `dist/` alone: build with `--outDir` somewhere else.

## The site's look

- The site teaches by example. The frame is neutral and plain; the exhibits are polished. The home page is Ryan's philosophy of writing frontend code; the demos grow in complexity, accordions first.
- Anything the frame owns (rail, header, footer, dialogs, controls) is dressed from the frame's own words: `backdrop` ground, `field` bars parted by the `--base` gap, `bare card` inputs under a bold `field` label bar, `path attentive field reachable` for a bar with a word, `icon-button borderless field attentive reachable` for an icon, `hairline-outline` for a secondary, `alarm-ink` for a refusal. The gap is the only empty space a reader sees; parts fill their cells edge to edge. The frame never wears `card`, `rounded-corners`, `lifted`, bordered inputs or filled buttons; those belong to the exhibits.
- A primary button is the site's inverted bar, `--field-inverse` with the `--field` word, and every state is drawn: approach on hover and focus, the `--ring` on focus-visible, `--press-glow` on active, `--smoke` or `--ink-muted` when disabled, with no hover.
- Markup is form and HTML5 elements only: `dialog`, `form`, `fieldset` with an off-screen `legend`, `label`, `textarea`, `input`, `output`, `button`, `hgroup`, `section` with a heading. A `footer` inside a dialog is a second landmark; an unnamed `section` owes a heading; a group of controls is a `fieldset`.
- Forms keep their niceties: Enter submits, Shift+Enter makes a new line in a textarea, an empty field is refused in the platform's own words, the phone keyboard's key reads "send", and the contact field offers the reader's email.
- A modal fits the view and never scrolls. On a phone it fills the view, laid out for upright and sideways, and the field is the part that grows. The reset leaves the browser's dialog positioning and backdrop alone and zeroes only its padding and border.
- Text flows: explanatory prose has no line-length clamp, and each run takes the room its row gives it, as the recipe steps do. Look at the other demos before writing a layout rule.
- Touch targets are 44px, gated on `pointer: coarse`, never on width. Check both orientations.
- The site's bold is 600 everywhere, and the frame's sheets declare no font.
- The platform first: `details` and `popover` before script, and script as the enhancement, so a failure leaves a working page (a button with an invoker command keeps a click fallback).
- Every fold moves by transition, never animation. Reduced motion is honoured once, in the reset, and then every fold opens at once.
- Every gesture has a keyboard twin, in the order the eye reads: one order for the eye and the screen reader.
- Diagrams grow to their desktop size and no further, sit centred in a wider column, shrink to a phone's column with their words held at caption size, and draw with non-scaling hairlines.

## Code style

- The reviewers' rubrics below are the style: the three doors on the home page, `scripts/review/design.md`, `scripts/review/tests.md`, and `scripts/review/plain.md` for words.
- The semantic element first; a `div` is the last resort. Native elements before ARIA roles.
- CSS: structure in the component's own sheet, shared needs from `src/styles`, and type only from `src/styles/typography.css` classes on the element.
- `npm run format` formats with ESLint Stylistic.

## Commits and pushes

- Only reader value becomes a story on the board; tooling is done directly. The designer drafts cards, and a card is promoted when agreed. A Done card is never reopened: a change of direction is a new card.
- The dev works on local main so Ryan can watch, uses a worktree only to push a slice ahead, and says "ready" with a clean tree. The designer verifies on main, builds into the checkout's `dist/` and holds it until the verdict. Nobody runs journeys while a push is in flight.
- One commit per fix. A card's batch goes out in one push, after the designer accepts it. Review findings, violations included, are answered in one batch per card.
- A card is Done when it is in production, every pipeline job is green including the review, and every review finding is fixed or argued in a commit message until the reviewer agrees.
- A commit quotes the review finding it answers, and a decline gives its reason in the commit: the pipeline's reviewer reads the log.
- Linear history: no merge commits.

## The review

A lead reads the rubric, sends each reviewer the scope, corroborates every finding that comes back, and answers in the feedback stance: habits first, then plusses and deltas. Every reviewer holds the values in `scripts/review/values.md` and writes by `scripts/review/plain.md`.

`scripts/review/prompt.mjs` builds the lead's prompt and `scripts/review/agents.mjs` builds the reviewers, both from the list under Reviewers below. A reviewer added there joins the next review; one removed there leaves it.

### Run it before a push

The pipeline's own command, from the repo's root, on the commits about to be pushed:

```sh
export REVIEW_SCOPE=changes REVIEW_BEFORE=$(git rev-parse origin/main) REVIEW_AFTER=$(git rev-parse HEAD)
claude --print "$(node scripts/review/prompt.mjs)" \
  --output-format stream-json --verbose \
  --json-schema "$(cat scripts/review/feedback.schema.json)" \
  --agents "$(node scripts/review/agents.mjs)" \
  --allowedTools "Agent,Read,Grep,Glob,Bash(git diff:*),Bash(git log:*)" \
  --max-turns 80 \
  --no-session-persistence | node scripts/review/narrate.mjs
node scripts/review/report.mjs < review.json
```

The pipeline runs the same through `npx --yes @anthropic-ai/claude-code@2.1.281` with its own model. The other scopes are `full`, the whole of `src/` and `e2e/`; `tests`, every test; and `design`, the whole site.

## Reviewers

Each reviewer reads its rubric first and whole, reviews one half of the scope, the site or the tests, and runs in the scopes listed. A reviewer of the site reads the tests only for context; the reviewer of the tests reports on the site only that a test is missing.

### structure
- rubric: `src/pages/Home/Structure.tsx`
- reviews: the site
- scopes: full, changes
- asks: what things are: the element chosen for the content, the landmarks and their names, the headings, the reading order with the styles off

### presentation
- rubric: `src/pages/Home/Presentation.tsx`
- reviews: the site
- scopes: full, changes
- asks: how things show: structure in the component sheet, needs as shared words, the platform's own states before invented ones, constants in the sheet and only runtime values inline

### dynamic-interaction
- rubric: `src/pages/Home/DynamicInteraction.tsx`
- reviews: the site
- scopes: full, changes
- asks: how things respond: state that holds only what cannot be derived, events named for what happened, pure transitions, the platform's behaviour before script, a keyboard twin for every gesture, changes that announce themselves

### design
- rubric: `scripts/review/design.md`
- reviews: the site
- scopes: full, changes, design
- asks: how the code is shaped so that change stays cheap: where a thing lives on the app continuum, what the types allow and forbid, and how failure travels on the two tracks of a Result; a functional core under an imperative shell

### tests
- rubric: `scripts/review/tests.md`
- reviews: the tests
- scopes: full, changes, tests
- asks: what a test is for: readable, worth having, pinning behaviour and not implementation, at the right level, against the real thing, and whether a test is missing; Beck's properties for unit tests, Dodds' practice for component specs, Fowler's journeys and Playwright's practices for e2e, Fowler's page objects beside their owner
