# The tests door

The home page states what the site is, how it shows, and how it responds. This door states what a test is for. A test earns its place by pinning behaviour a reader can name, at the level where that behaviour lives, against the real thing. You hold every spec, journey, page object and test support file to this door and to nothing outside it.

## Six questions, in order

1. **Is it readable?** The name says what the reader will believe when it passes. The body reads as arrange, act, assert with nothing between them to decode. A reader who knows the domain and not the code can say what it protects.
2. **Is it worth it?** It pins something a person would notice broken. It does not restate another test's protection at a different address. A test nobody would miss is a cost with no return.
3. **Does it pin behaviour, not implementation?** It survives a rename, a moved file, a swapped hook or a reshaped tree. It reads what the page says and does, never how the page is built. Beck calls this structure-insensitive and it is the property that bites most here.
4. **Is it at the right level?** A rule of the domain is a unit test. What a page says and does for one person on one screen is a component spec. What a person does across screens to reach a goal is a journey. A vitest spec that reads like a journey belongs in Playwright; a Playwright spec that pins one component belongs in vitest.
5. **Does it test reality?** Real collaborators: the real router, the real store, the real components beneath. The world is stubbed only at its edge, the network through msw and the clock when time is the subject. Nothing of ours is mocked, spied or replaced. A warning printed during the run is a defect the test is hiding, never something to silence.
6. **Is a test missing?** Read the code under test and ask what it does that no spec names: a state it can be in, a branch it takes, an edge it handles, a thing a person would notice broken. A behaviour with no test pinning it is a finding on this door, pointed at the code line that has no test, with the test it wants named in a sentence.

## Unit tests hold Beck's properties

Kent Beck, Desirable Unit Tests: https://newsletter.kentbeck.com/p/desirable-unit-tests

Isolated, so order and neighbours cannot change the result. Composable, so tests combine without interference. Deterministic, so the same code gives the same answer every run. Specific, so a failure points at one cause. Behavioural, so a change in behaviour changes the result. Structure-insensitive, so a change in structure does not. Fast. Writable, so pinning a behaviour is cheap. Readable. Automated. Predictive, so green means the code works. Inspiring, so a passing run gives real confidence.

A seeded draw is still a gamble; distinctness needs a deck. A test that passes only in one order, or only on a fast machine, fails Deterministic whatever the reporter says.

## Component specs hold Dodds' practice

Kent C. Dodds, Common mistakes with React Testing Library: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

- Query through `screen`, never through `container` or a render result named `wrapper`.
- `getByRole` first, with a name; then label, then text. Never a test id, a class or a tag.
- `userEvent` over `fireEvent`, except where the browser gives user-event no equivalent, such as pointer sequences with coordinates and HTML5 drag.
- `find*` for what arrives later. `waitFor` holds one assertion and no side effects, never an empty callback.
- `query*` only to assert absence.
- Assert with the matcher that says it: `toBeInTheDocument`, `toBeVisible`, `toHaveTextContent`, never `toBeDefined` on a query.
- No manual `act`, no manual `cleanup`. An act warning names an update the test never waited for.
- The spec renders the page or component the way the app does, through TestApp, and finds what a person finds.

## Journeys hold Fowler and Playwright

Martin Fowler, User Journey Test: https://martinfowler.com/bliki/UserJourneyTest.html and Show User Journeys: https://martinfowler.com/articles/lean-inception/show-user-journeys.html
Playwright, Best Practices: https://playwright.dev/docs/best-practices

- A journey is one person with one goal and the steps they take across the site to reach it. It is broad, not deep. There are few of them and each is valuable on its own. A matrix of cases is not a journey.
- It tests what the person sees and does, never the internals. Third parties are not under test; a live museum or exchange is stubbed at the edge or the journey does not depend on it.
- Locators by role with a name, then label, then text. Never CSS, XPath or test ids.
- Web-first assertions that wait: `expect(locator).toBeVisible()`, never `expect(await locator.isVisible())`, and never a manual sleep.
- Each journey stands alone with its own state. It runs in every browser the site ships to.

## Page objects hold Fowler

Martin Fowler, Page Object: https://martinfowler.com/bliki/PageObject.html

- A page object offers the services a page or component offers a person, in the domain's words, and hides how the markup is built. Its methods say what a person does, not what element they touch.
- It lives in `__test_support` beside the page or component it speaks for, never in a shared grab bag. Test support for the app as a whole lives in `src/test-support`.
- It finds by role, label and text, like every test. It makes no assertions of its own; the spec says what is expected.
- A helper repeated across specs is a page object waiting to be named.

## How you report

A finding points at a spec and a line, or at the code line no spec pins, names which question or canon it answers to, and quotes that source. Name a pattern once and list where it recurs. A test that is merely different from how you would write it is not a finding. Nothing wrong is a true answer: never invent a finding to have something to say.
