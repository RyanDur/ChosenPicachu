# The design rubric

The home page states what the site is, how it shows, and how it responds. The tests rubric states what a test is for. This rubric states how the code is shaped so that change stays cheap: where a thing lives, what the types allow, and how failure travels. Under all three sits one stance: a functional core and an imperative shell. Transitions, rules and shapes are pure functions of their inputs; the shell holds the state, listens, commits and reconciles what stands on screen. You hold every file that ships to this rubric and to nothing outside it.

## Where a thing lives

Tim Spann and Initial Capacity, The App Continuum: https://www.appcontinuum.io/

- The site stands at one stage of the continuum, a single application with namespaces and components: `src/pages` holds the application, `src/components` the components, `src/transport` the edge. It stays there until a reason moves it; "not all applications need to evolve and could stop anywhere on the continuum." A push that moves a thing off its stage says why.
- Files group by feature or bounded context, so that all the gallery's files are in one place, never by kind. A directory named common, util, helpers or shared reveals nothing and is a finding.
- A component keeps what it needs local: its data access, its store, its wiring, its sheet, its page object. A directory is a namespace and the import path reads as one: `@components/DragSortableTable/arrangement` names the arrangement of that table, and importing it is not reaching in. An index is pure and curated: it exports only what the directory means to offer, by name, and does nothing else, no stylesheet, no side effect. An index that carries a side effect, that exports what nobody outside needs, or that re-exports a child module whole under a name so the namespace shows at the use site instead of in the import, is a finding.
- "Naming, organizing, and reducing circular dependencies are the three most important things you'll ever do as a programmer." A name that has to be explained, a file that could stand in three directories, and a cycle between two modules are each a finding.

## What the types allow

Scott Wlaschin, Designing with types: https://fsharpforfunandprofit.com/series/designing-with-types/

- An illegal state is unrepresentable. If the code has to check that two fields agree, the type let them disagree.
- A state is a union of its cases, never a set of booleans read together. Three flags that mean one of four things are a finding, pointed at the type.
- A domain value the code reasons about is its own type: a museum is not a bare word, a sort direction is not a string, a chart's kind is a union of the kinds there are. A value the code only carries from one place to another, an id or a price passed along, may stay what the platform makes it.
- Optional means a question mark: `x?: T`, never `x: T | undefined`. An absent value is a Maybe, never null.
- A constrained value is built once, at the boundary, and trusted after. Code that re-validates what a type already promises is a finding; code that trusts a value the type never constrained is a bigger one.
- The domain's words are the type names, the field names and the union's cases. A type named for its shape rather than its meaning is a finding.

## How failure travels

Scott Wlaschin, Railway Oriented Programming: https://fsharpforfunandprofit.com/rop/

- A function that can fail answers with a Result, and throws nothing across a boundary. sand's `Result` and `Result.Async` are the two tracks; `map`, `mBind`, `onSuccess` and `onFailure` are how they join.
- An error is a value named for what went wrong, in the domain's words. A string message where a case belongs, or an error that says only that something failed, is a finding.
- Failure becomes what a person sees in one place, at the edge, on the page. A component that decides the wording of an error two layers down, or a page that inspects an error's insides to decide, is a finding.
- The success track carries no failure checks; the failure track carries no business logic. A `try` and `catch` inside the domain is a finding; one at the edge that turns a thrown platform error into a Result is the boundary doing its job.
- A promise that can reject is a failure the type does not name. Where the code awaits something of ours, ask whether the rejection has a track.

## What the names say

Carl Alexander, The importance of naming in programming: https://carlalexander.ca/importance-naming-programming/

- A name says what the thing is or does, in words someone who reads the code would use: "Be as clear and explicit as you can be when naming anything." A name that needs its type or its body read before it means anything, such as `style`, `data`, `value`, `handle` or `item` for a thing more particular than an item, is a finding.
- A value's name says what its values mean. A property or a flag whose values have to be decoded from the code that uses them, such as `--toward: 1` for an item that came from the right, is a finding.
- No abbreviations: "Saving a few characters isn't worth the confusion that an abbreviation might bring."
- A module member reads as a phrase with its module, `travel.eager`. Dropping a word the module already says is right only when what is left still names the thing. `marks.style`, cut down from `pushedStyle`, says neither whose style it is nor what for, so it is a finding.
- A comment that explains what a name means is a sign the name is wrong.

## How you report

A finding points at a file and a line, names which section it answers to, and quotes that source. Name a pattern once and list where it recurs. Code that is merely different from how you would write it is not a finding, and a stage the site has chosen not to reach is not a finding. Nothing wrong is a true answer: never invent a finding to have something to say.
