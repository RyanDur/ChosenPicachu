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
- Tests pin behaviour, what a reader does or meets, not looks or CSS values. Looks are checked by screenshot before a commit. A sentence a card promises has a test. Why: a test of a style value pins the sheet, not the page. It breaks when the sheet is reworded and passes when the page is wrong ([Dodds on testing what users see](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library), [Fowler's user journey tests](https://martinfowler.com/bliki/UserJourneyTest.html)).
- Tests find what a reader finds: by role, label and text, never by class. Page objects live in the owner's `__test_support`.
- A test that passes only on retry or alone is a defect. Before blaming a test, check the machine: `pmset -g adapter` should show the full charger, and a killed Playwright run can leave its stage server on 4517 for later runs to reuse.
- While someone else verifies from this checkout, leave its `dist/` alone: build with `--outDir` somewhere else.

## The site's look

Each rule gives its reason, and a source where one exists outside this repo. A rule whose reason no longer holds is a question for Ryan, not a rule to drop.

- The site teaches by example. The frame is neutral and plain; the exhibits are polished. The home page is Ryan's philosophy of writing frontend code; the demos grow in complexity, accordions first. Why: a reader comes for the exhibits, and a plain frame keeps their eye there. The order lets each demo lean on the one before.
- A tutorial is written for a working developer who has hit the bug its tab is about, often a seasoned one from other work (back end, native, data) who hasn't learned how CSS and the browser work underneath, with newcomers kept in mind. Every term is defined where it first appears, basics included. Headings and captions carry the answer. Every idea has an example to press, and a drawing where it helps. A tab opens with the problem and its point of view, never with how to build. Accordions start with HTML alone, and on the simple tabs depth sits in a fold below the point. Why: a reader who lands from a search with a bug in hand needs the answer before the build, and the less a learner has to attend to, the more room they have to understand. The review holds tutorials to this through `scripts/review/tutorials.md`.
- Anything the frame owns (rail, header, footer, dialogs, controls) is dressed from the frame's own words: `backdrop` ground, `field` bars parted by the `--base` gap, `bare card` inputs under a bold `field` label bar, `path attentive field reachable` for a bar with a word, `icon-button borderless field attentive reachable` for an icon, `hairline-outline` for a secondary, `alarm-ink` for a refusal. The gap is the only empty space a reader sees; parts fill their cells edge to edge. The frame never wears `card`, `rounded-corners`, `lifted`, bordered inputs or filled buttons; those belong to the exhibits. Why: when the frame borrows an exhibit's dress, a reader can no longer tell the site from what it shows. One vocabulary means a new control is dressed by naming its needs, not by writing new rules.
- A primary button is the site's inverted bar, `--field-inverse` with the `--field` word, and every state is drawn: approach on hover and focus, the `--ring` on focus-visible, `--press-glow` on active, `--smoke` or `--ink-muted` when disabled, with no hover. Why: a state that isn't drawn is a state the reader can't see. Keyboard users need to see focus ([WCAG 2.4.7, focus visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)), and a disabled button that still lights on hover invites a press that does nothing.
- Markup is form and HTML5 elements only: `dialog`, `form`, `fieldset` with an off-screen `legend`, `label`, `textarea`, `input`, `output`, `button`, `hgroup`, `section` with a heading. A `footer` inside a dialog is a second landmark; an unnamed `section` owes a heading; a group of controls is a `fieldset`. Why: the element is the meaning a screen reader announces, and a `div` means nothing ([HTML, the div element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element)). A native element brings its role, states and keys with it, so ARIA comes last ([the first rule of ARIA](https://www.w3.org/TR/using-aria/)). A group of controls needs its legend to be named ([WCAG technique H71](https://www.w3.org/WAI/WCAG21/Techniques/html/H71)).
- Prose reaches across the container it sits in. No width cap, a measure or any other, stops a paragraph partway across its part of the page. Where words sit beside code or a drawing, that column is their container and they fill it. Why: Ryan, 2026-10-04, "I do not want the text to just suddenly stop in a random part of the page", after the tab introductions were capped at 75 characters and sat beside an empty half of the page. He had said the same on 2026-09-26. A cap for line length leaves a hole that reads as unfinished, and the site's lines are his to set.
- Forms keep their niceties: Enter submits, Shift+Enter makes a new line in a textarea, an empty field is refused in the platform's own words, the phone keyboard's key reads "send", and the contact field offers the reader's email. Why: these are what a reader's hands already expect from every other form. The platform's refusal is worded and translated by the browser and read by assistive tech. The keyboard's key comes from [enterkeyhint](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/enterkeyhint). Errors follow the established patterns rather than invented ones ([GOV.UK validation](https://design-system.service.gov.uk/patterns/validation/), [Nielsen Norman Group on form errors](https://www.nngroup.com/articles/errors-forms-design-guidelines/)).
- A modal fits the view and never scrolls. On a phone it fills the view, laid out for upright and sideways, and the field is the part that grows. The reset leaves the browser's dialog positioning and backdrop alone and zeroes only its padding and border. Why: a modal that scrolls hides its own buttons, and on a phone the keyboard takes half the view already. The browser's [dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) already centres itself, dims the page and traps focus, so the reset takes away only what the design replaces.
- Text flows: explanatory prose has no line-length clamp, and each run takes the room its row gives it, as the recipe steps do. Look at the other demos before writing a layout rule. Why: Ryan's ruling, so every demo reads the same way.
- Touch targets are 44px, gated on `pointer: coarse`, never on width. Check both orientations. Why: 44px is the size a finger can hit ([WCAG 2.5.5, target size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)). Width says nothing about the pointer: a narrow window on a desktop has a mouse, and a wide tablet has a finger. The [pointer media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) asks the right question.
- The site's bold is 600 everywhere, through the `bold` modifier in `src/styles/typography.css`, and the frame's sheets declare no font. Why: one weight in one place. A sheet that writes its own weight or size drifts from the rest, and a change to the type scale has to reach every word.
- The platform first: `details` and `popover` before script, and script as the enhancement, so a failure leaves a working page (a button with an invoker command keeps a click fallback). Why: what the browser does can't break when the script doesn't load, and it comes with keys and announcements already ([details](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details), [the Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API), [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)). Browsers without [invoker commands](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API) still need the button to work.
- Every fold moves by transition, never animation. Reduced motion is honoured once, in the reset, and then every fold opens at once. Why: a [transition](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions) turns around from wherever it is when the reader presses again midway; an animation plays out on its own clock. CSS owns all motion, so script only sets state. A reader who asks for [less motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) gets none, from one block, and no component can forget it ([WCAG 2.3.3, animation from interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)).
- Every gesture has a keyboard twin, in the order the eye reads: one order for the eye and the screen reader. Why: a drag with no keys shuts out anyone without a mouse ([WCAG 2.1.1, keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)), and focus that jumps against the reading order loses the reader ([WCAG 2.4.3, focus order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html), [1.3.2, meaningful sequence](https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html)).
- Diagrams grow to their desktop size and no further, sit centred in a wider column, shrink to a phone's column with their words held at caption size, and draw with non-scaling hairlines. Why: stretched to their column, a label read 27px on an upright iPad and 11px on a phone (#29). Capped at the drawing's own 320px, they read too small on a desktop, so Ryan set the cap at the desktop size. Lines stay hairlines through [vector-effect](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/vector-effect).

## Code style

- The reviewers' rubrics below are the style: the three doors on the home page, `scripts/review/design.md`, `scripts/review/tests.md`, and `scripts/review/plain.md` for words.
- The semantic element first; a `div` is the last resort. Native elements before ARIA roles.
- CSS: structure in the component's own sheet, shared needs from `src/styles`, and type only from `src/styles/typography.css` classes on the element. A tag is styled only in the reset; everywhere else a rule names a class, so a table's cells and a fold's parts wear a word. Why: the home page's Presentation door says "Tag selectors are for resets only". A rule on a bare tag reaches every such element a later change puts inside the component, and the class list no longer says what the element is.
- `npm run format` formats with ESLint Stylistic.

## Commits and pushes

- The dev writes and tests code. The designer may change documents and CI directly: this file, the review's rubrics and prompts in `scripts/review/*.md`, and the workflows. Why: Ryan, 2026-10-03, "the dev is in charge of writing and testing code, you can update documents and ci".
- Only reader value becomes a story on the board; tooling is done directly. The designer drafts cards, and a card is promoted when agreed. A Done card is never reopened: a change of direction is a new card. Why: the board is the product's backlog, and the designer verifies each card against what a reader meets. Tooling has no reader to verify for. A reopened card rewrites what was already shipped and checked.
- The dev works on local main so Ryan can watch, uses a worktree only to push a slice ahead, and says "ready" with a clean tree. The designer verifies on main, builds into the checkout's `dist/` and holds it until the verdict. Nobody runs journeys while a push is in flight. Why: Ryan sees work only once it's on local main. A verifier who builds from a tree with someone else's uncommitted work measures something that will never be pushed. The journeys share one stage port, so two runs at once test each other's build.
- One commit per fix. A card's batch goes out in one push, after the designer accepts it. Review findings, violations included, are answered in one batch per card. Why: every push costs a full pipeline and a review, and a batch lets the review read the answers together.
- A card is Done when it is in production, every pipeline job is green including the review, and every review finding is fixed or argued in a commit message until the reviewer agrees. Why: the pipeline's reviewer reads the git log, not the board. A finding answered only in a comment is never seen by the one who raised it.
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

### tutorials
- rubric: `scripts/review/tutorials.md`
- reviews: the site
- scopes: full, changes
- asks: what a tutorial on the demos tab owes its reader: claims that are true, terms defined where they first appear, headings that lead with the answer, an example to press for every idea, a tab that opens with why, the mechanism said in plain words, one idea in each run
