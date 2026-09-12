## The home page reviews the code

14 violations, 25 concerns, 3 notes.

### structure

- **violation** `src/components/Banners/Banners.tsx:58` The site's own sections often have no name at all. The banner panel is a <section> with no heading and a role that overrides it. The same happens at Loading.tsx:11, art-gallery/Art/ArtGallery.tsx:44, Axes.tsx:41 and :47, the Candles/Pie/Pressure/PriceChart 'chart-stage' sections, NaturalZIndex.tsx:13, UsersTable.tsx:41, UsersPage.tsx:24 and DemosPage.tsx:54. These are wrappers dressed as sections.
  _Sections name themselves through their headings, and if a section has nothing to be named by, that is the page telling me it is not a section._
- **violation** `src/components/FancyFormElements/FancyInput/FancyInput.tsx:39` <article> is used as a generic wrapper where nothing should be said. It wraps single form fields here and in FancySelect/FancyTextarea. It also appears as empty grid spacers (GalleryNav.tsx:42, :68), as the page counter and its words (GalleryNav.tsx:53-56), as nested animation shells (Accordions.tsx:104-108, :166-172), as the glider bar (PillGlider.tsx:38), and as control rows and item bodies (Controls.tsx:52, KeepItem.tsx:30, Step.tsx:13). None of these is a self-contained composition.
  _The div is for when I want an element to say nothing ... Still an element “of last resort, for when no other element is suitable”_
- **violation** `src/components/Tabs/Tabs.tsx:30` The current tab is marked only by the class 'current'. Its only effect is dropping a box-shadow in Tabs.css:28. The markup has no aria-current, so with styles off, and for assistive tech, nothing says which tab is current.
  _If the meaning only appears when the CSS arrives, the meaning is living in the wrong language._
- **violation** `src/components/Users/UserMenu/UserMenu.tsx:40` 'Remove' deletes a user, but it is a <Link to={path}> with the deletion in onClick. An action is announced as navigation.
  _a nav announces wayfinding and a button promises a press ... buttons are buttons even when they look like links._
- **violation** `src/pages/Demos/DemosPage.tsx:58` Topic titles are not headings. 'Different styles of Accordions.' is written as the first <li> of the accordion list, and 'Z-Index Demo.' (line 76) as a bare <article>. The title pretends to be a list item, and heading navigation has nothing to land on.
  _lists admit they are lists ... 71.6 percent of users navigate a long page by its headings_
- **violation** `src/components/art-gallery/Search/Search.tsx:46` Several landmarks go unnamed: the <search> landmark here, and the skeleton landmarks (<main> at router.tsx:32, <footer> at router.tsx:38, <header> at BasePage/Header.tsx:3).
  _every landmark gets a name and no two names collide._
- **concern** `src/pages/Demos/Charts/Candles/Candles.tsx:33` Many sections are named by aria-label and not by a heading. This covers the chart cards (candles, pie, pressure, live trades), Controls.tsx:51, BannerControls.tsx:50, Aggregations.tsx:36 and every 'build-steps' section. Bibliography.tsx:7 invents aria-labels for shelves that already have h3 headings. The .tutorials sections have an h2 that nothing links as their name.
  _Sections name themselves through their headings_
- **concern** `src/pages/Demos/Tables/Aggregations/Aggregations.tsx:36` Two regions share the name 'live aggregations': this host section, and the section inside the vanilla iframe document (Frame/table.html:1). Assistive tech sees both in one tree.
  _every landmark gets a name and no two names collide._
- **concern** `src/pages/Demos/Tables/Picks.tsx:18` Picks wraps aria-pressed toggle buttons that swap content (tutorial, input track) in a <nav>. They are not wayfinding.
  _a nav announces wayfinding and a button promises a press_
- **concern** `src/components/Tabs/Tabs.tsx:29` Navigation link sets are loose runs, not lists: span-wrapped Links in Tabs, bare Links in SideNav.tsx:15-26, and bare page links in GalleryNav.tsx:43-67.
  _lists admit they are lists_
- **concern** `src/pages/Demos/Recipe/Snippet.tsx:23` Syntax colouring wraps every token in <mark>, which means 'highlighted for relevance'. reset.css:35-38 strips mark's look so this works. With styles off, every keyword reads as highlighted.
  _I start with the need and let it pick the element ... Naked, the page should still say everything it means_
- **concern** `src/pages/Users/UserInformation/Address/Address.tsx:28` The address controls are grouped in an <article> labelled by a heading outside it. A group of related form controls is a fieldset with a legend, as PillGlider already does.
  _I start with the need and let it pick the element._
- **concern** `src/pages/Demos/Charts/Candles/Candles.tsx:75` The candles, pressure and pie charts put their caption in a loose <small> beside an aria-hidden svg, with no figure. PriceChart.tsx:72-93 shows the intended shape: figure plus figcaption.
  _figures carry their captions_
- **concern** `src/pages/Demos/Charts/Workspace.tsx:73` Each chart's doorway is a link named only 'chart N', which says nothing about where it goes. The same link is the keyboard handle that reorders (arrows) and removes (Delete) charts.
  _The elements mean something ... a nav announces wayfinding and a button promises a press_
- **concern** `src/pages/Demos/index.tsx:11` The page's h1 is built from the raw URL token ('Demos dragAndDrop', 'Demos z-index'). It only reads as a title once DemosPage.css:3 applies text-transform: capitalize.
  _Naked, the page should still say everything it means, in order_
- **concern** `src/pages/Demos/Recipe/Recipe.css:217` The 'fold' station of the data path is singled out only by :nth-child(3) with a mint background. Nothing in DataPath.tsx says that station is the one that matters.
  _If the meaning only appears when the CSS arrives, the meaning is living in the wrong language._
- **concern** `src/pages/BasePage/SideNav.tsx:13` The site navigation is wrapped in an <aside aria-label="site rail">. That adds a complementary landmark around what is only wayfinding.
  _The skeleton comes first: one header, one main, one footer, nav where wayfinding lives._
- **note** `src/pages/Demos/Recipe/Story.tsx:40` Story titles (h3 inside an hgroup) and 'The research' (Bibliography.tsx:6) are headings placed inside <summary>. Some assistive tech flattens summary content, which can hide these from heading navigation.
  _71.6 percent of users navigate a long page by its headings_
- **note** `src/pages/Games/ThreeInARow/ThreeInARow.tsx:3` The game renders an empty fragment, and /games has no index element. Both routes show only the header 'Play Games' above an empty main.
  _Naked, the page should still say everything it means, in order_

### presentation

- **violation** `src/styles/typography.css:33` The top scope ships utilities that only say what they do: .bold, .italic, .uppercase, .ellipsis here; .bare, .borderless, .hairline-outline, .alarm-ink, .padded in surface.css; .left/.center/.right/.top/.bottom/.off-screen/.stick-to-bottom in placement.css; and .clearfix at Accordions.css:223. Class lists such as 'fancy-title ellipsis bold' (FancyInput.tsx:54) spell out the look.
  _there is no atomic scale: a need says why a style is there, a utility only says what it does, and a markup full of utilities is the look written back into the structure._
- **violation** `src/index.css:65` Bare tag selectors carry design outside the reset layer: link colour and focus ring here, and body font/colour at line 21. Component sheets do the same with `img` (button.css:47, Form.css:57), `th, td` / `thead th` / `tbody tr` (Tutorials.css:167-191), `svg` (Recipe.css:343), `~ label` (fancy.css:111) and `input:focus-visible` (Accordions.css:94).
  _Tag selectors are for resets only_
- **violation** `src/components/Banners/Banners.tsx:32` A measured height is written straight to element.style.blockSize, not to a custom property the sheet listens for. LazyHideAnimatedList.tsx:38 and LazyKeepAnimatedList.tsx:38 do the same with viewTransitionName.
  _only runtime values ride inline, crossing on a custom property the sheet is already listening for_
- **concern** `src/components/art-gallery/Search/Search.css:9` Grid areas reorder what the eye sees away from the source. Reset shows left of the query but is walked after submit. At ≤1000px the site nav shows second but is the last thing in the source (BasePage.css:165-170 vs router.tsx:41). The avatar button shows second but is walked fifth (Form.css:153).
  _Grid and flex can reorder what the eye sees without changing what a keyboard walks, so the source keeps the meaningful sequence and the sheet only decorates it._
- **concern** `src/pages/Demos/Tables/Picks.css:21` The chosen pick is styled by the invented word '.current', although the buttons already carry the platform state aria-pressed.
  _The platform already names most states ... The sheet listens for those pseudo-classes first. I add a state word only where no native one exists_
- **concern** `src/components/Tabs/Tabs.css:47` Structure lives away from the component that wears it. .pill-tabs is worn only by Accordions.tsx:124. DemosPage.css:1-5 restyles the header's .app-title. DemosPage.css:33 styles the chart cards' .explainer, which Workspace.css:93 also styles.
  _Component sheets own structure: the grid, the placement, the bones of one component, named for it and kept beside it._
- **concern** `src/pages/Demos/Tables/Recipe/LayerMap.tsx:30` Cells borrow nouns from another table (StoryClues' 'clue' and 'tells') to pick up its italics and muted ink. Read cold, the class list names the wrong thing.
  _The test of the organization is reading the class list cold: if it does not say what the element is and what it needs, in words the design speaks, the sheet has stopped being a stylesheet and become a bag of overrides._
- **concern** `src/components/FancyFormElements/FancySelect/FancySelect.css:12` Many sizes are raw lengths that skip the base tokens, and some are not multiples of the base at all: 0.65rem, 0.1rem, 0.5rem, 3.5rem here. Others include top: ±1rem (fancy.css:17), outline-offset -2px/-3px/-4px (PillGlider.css:9, Accordions.css:84, Tabs.css:80), min-width 86rem/64rem (Aggregations.css:9, UsersPage.css:42), shadow offsets in px (surface.css:35), and breakpoints 900px/832px that are not in the documented set (Recipe.css:61, Address.css:32).
  _Everything sits on one scale: every size a multiple of a single base_
- **concern** `src/styles/reset.css:69` The reset removes the outline from every button. Buttons without their own focus style, such as the banner's .dismiss (Banners.css:130) and the chart .remove-chart, show no focus at all.
  _Presentation carries affordances of its own._
- **note** `src/styles/colors.css:21` The composite shadow tokens (--drop-shadow, --light-box-shadow, --alarm-glow) embed unnamed rgba values and px offsets. --alarm-glow repeats the orange instead of referencing its token.
  _every color a named token on the root._

### dynamic interaction

- **violation** `src/components/Tabs/Tabs.tsx:26` An effect writes the default tab into the URL with a push, not a replace. Arriving at /demos or /gallery adds a history entry. Back returns to the tab-less URL, and the effect pushes again, which traps the back button. The default could simply be read as `tab ?? defaultTab`.
  _the browser already ships the back button, scroll restoration, and focus order, and script that re-implements them buys their bugs back._
- **violation** `src/router.tsx:18` Every pathname change runs gotoTopOfPage, so Back also scrolls to the top and throws away the browser's scroll restoration. The same helper runs on gallery clicks and submits (Image.tsx:36, GalleryNav.tsx:44, PageControl.tsx:19). useArrival.ts:4 re-implements scrolling to the fragment.
  _the browser already ships the back button, scroll restoration, and focus order, and script that re-implements them buys their bugs back._
- **violation** `src/components/DragSortableTable/actions.ts:10` Several event names are not past tense. 'carrying', 'columnLandingAt' and 'rowLandingAt' are present or progressive. The user form's actions (components/Users/UserInfo/types/index.ts:34-42: UPDATE_FIRST_NAME … RESET_FORM) are commands.
  _Events are what happened, so they are named in the past tense: lifted, dropped, chosen._
- **violation** `src/pages/Demos/Charts/useChartTravel.ts:15` Chart travel keeps four separate useStates (armed, aloft, aloftLead, pushed). The swap on lines 44-49 calls several setters with no transition from one truth to the next. The drag-sort lists do the same (EagerKeepAnimatedList.tsx:17-20 and siblings), and HideItem.tsx:11 keeps its own 'hide' copy of the parent's aloft.
  _Each one goes to a pure transition that takes the current truth and returns the next. The truth lives in one place, and committing the next one is the only way anything moves._
- **violation** `src/pages/Demos/Charts/useChartTravel.ts:82` Arrow keys reorder charts and Delete removes one, but nothing reports it. The workspace has no output or live region, unlike the tables and lists, which render a MoveReport.
  _Changes announce themselves, too. A sighted reader watches the order change; a listening reader hears it, because the page says what it did._
- **concern** `src/components/DragSortableTable/DraggableColumn.tsx:21` Move truth lives outside the table store. 'landed' is component useState here and in RowHeader, and walkedTo/beside make three commits (dispatch, onColumnMoved, setLanded). Resize keeps its drag in useState (ResizeHandle.tsx:17-18) and in closure `let` variables in the vanilla shell (Frame/table/resize.ts:27-28). Row and column drags keep theirs in the store's `drag`.
  _The truth lives in one place, and committing the next one is the only way anything moves._
- **concern** `src/components/PillGlider/PillGlider.tsx:24` Several places store what could be derived. The glider geometry follows `chosen` but is kept as state, so it goes stale if `chosen` changes from outside (URL, Back). ArtGallery.tsx:33 stores 'errored' from empty(pieces). PageControl.tsx:11-12 copies URL params into state. UserInformation.tsx:44-46 copies the home address into the work address through an effect.
  _It holds only what cannot be derived; anything the page can compute from it is a view, computed when asked._
- **concern** `src/pages/Demos/Tables/Frame/builds/Eager.ts:57` The vanilla shell never commits shoves or settles through the core. shoveColumns, settleColumn and settleRow (table/settle.ts) write classes and properties straight onto cells. In the React build the same moves go through tableReducer's motion transitions (columnMovedBeside, columnWalkedTo, unsettled). The same split is in Lazy.ts.
  _The same core can wear any shell: swap the framework, or drop it entirely, and only the shell changes._
- **concern** `src/pages/Demos/Tables/Frame/builds/Eager.ts:30` The vanilla shell reads its starting truth off the page. Column order comes from th.classList.item(1), row keys from header textContent (line 26), and the sort direction from button text (table/menus.ts:17). table-state.ts:76 columnOf does the same inside the core.
  _if the data does not say what is true without the page open beside it, behavior has leaked into presentation._
- **concern** `src/pages/Demos/Recipe/Story.tsx:19` Each story fold's summary click calls preventDefault and re-drives <details open> from the URL. Script takes over a toggle the platform already performs.
  _The folds on this page open and close with no script anywhere ... I write behavior only for what the platform does not yet do._
- **concern** `src/pages/Demos/exchange.ts:33` The feed middleware reports socket closes and failures by calling the banner's raise directly. That bypasses the store's dispatch, so the trouble never becomes part of the state it decides from.
  _Requests go out the same path commits come through, so the outside world never writes to the screen directly._
- **concern** `src/components/DragSortableTable/reducer.ts:45` The drag, motion and trade transitions (lift, drift, landColumn/landRow, ground, unsettle, settle, shove, trade) have no unit spec. tableStore.spec.ts covers only 'measured' and the arrangement, so these are checked only by rendering tables and reading classList (tables.spec.tsx:149). The user form's formReducer has no spec at all.
  _Transitions are pure functions from state to state, tested alone with no page in sight_
- **concern** `src/pages/Demos/Controls/Controls.tsx:8` Whether the settings fold starts open is decided by reading the --phone custom property out of the computed stylesheet. spacing.css:59 declares that property documentation only.
  _if the data does not say what is true without the page open beside it, behavior has leaked into presentation._
