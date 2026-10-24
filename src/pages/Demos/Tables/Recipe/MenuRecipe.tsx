import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {paceParam} from '../../Controls';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {World, worldParam} from '../params';
import {Term} from './Term';
import menuCss from '@components/Menu/Menu.css?sample';
import headerCss from '@components/DragSortableTable/Header.css?sample';
import sortingSource from '@components/DragSortableTable/sorting.ts?sample';
import tableSource from '../Frame/table.html?sample';
import arrangementSource from '@components/DragSortableTable/arrangement.ts?sample';
import demosSource from '@pages/Demos/store.ts?sample';
import frameMenus from '../Frame/table/menus.ts?sample';
import frameColumns from '../Frame/table/columns.ts?sample';
import {buildSources} from '../Frame/builds/sources';
import {headerSources, rowSources, tableSources} from './sources';
import {menuSource, surfaceCss} from './steps/sources';
import {TheImplementation} from './steps';
import baseCss from '@components/DragSortableTable/Table.css?sample';
import '../../Recipe/Recipe.css';
import {Sample} from '@pages/Demos/Recipe/sample';

const gap = plain(' ');

type Build = {
  world: World;
  source: Sample;
  menuSrc: Sample;
  tableSrc: Sample;
  rowSrc: Sample;
  buildSrc: Sample;
};

const SortedDirectly: FC<Build> = ({world, menuSrc}) =>
  <Step title="Sort directly">
    <Words want="A sort reorders everything at once, and no one move explains it.">
      <Says>The answer is the sort alone: dispatch it and let the rows cut to their ranked
        seats. Motion in these tables explains one move: a column or a row, and what it shoved aside.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says><code>SortMenu</code> is the whole chooser: three buttons naming the three choices,
          raising <code>onSorted</code> with which column asked for what. The page dispatches it, and that is the
          whole answer. The rows cut to their ranked seats on the next frame, in the animated
          table and the static one alike.</Says>
        : <>
          <Says>The toggle and its menu are wrapped by <code>sort-menu</code>, a custom element too. On connect it finds its direction buttons.</Says>
          <Says>When one is chosen it asks the table for its context, what the table knows about itself and the functions it answers with, and calls <code>choose</code>, which raises <code>sorted</code> to the page and writes the move report, the output that tells a screen reader what happened. The page dispatches the sort into its arrangement and sets the element’s columns and rows. Setting the rows reseats them in the same call. The rows cut to their ranked seats, in the animated build and the static one alike.</Says>
        </>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...span(menuSrc, 'export const SortMenu', '</>;')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(frameMenus, 'export const choose = ')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;

const RankStory: FC<{build: Build}> = ({build}) => {
  const {world, source, menuSrc, tableSrc, rowSrc, buildSrc} = build;
  return <Story param="menu" id="rank"
    can="The trader can sort the windows by any measure, or take the order back"
    soThat="the table ranks itself, and the trader still outranks it">
    <TheImplementation world={world} react="Builds" vanilla="Frame/table/menus.ts"/>
    <Tell>I could build the popup from divs, but then I would have to build focus, dismissal and
      stacking myself. So the chooser uses the platform’s popover, and the first steps below collect what that
      decision gives. Sorting state has its own trap: the glyph, the attribute and the
      ranked rows each want their own copy of which column is chosen, and copies
      drift.</Tell>
    <Tell>And two forces pull at whatever the trader chooses. The data keeps streaming under
      the sort, so a sort that happens once is stale by the next trade. And a drag changes
      the order too: the trader who drags a row mid-sort is not wrong, and the table must
      decide whose order wins.</Tell>
    <Steps>
      <Step title="A menu that is a menu">
        <Words want="A sort chooser needs a popup, and popups built from divs re-invent focus, dismissal, and stacking.">
          <Says>The platform provides the whole popup: point the
            button’s <Mdn path="Web/HTML/Element/button#popovertarget"><code>popoverTarget</code></Mdn> at the
            menu, and <Mdn path="Web/HTML/Global_attributes/popover"><code>popover="auto"</code></Mdn> brings
            the top layer, light-dismiss, and the accessibility relationship. The plan is to
            write no popup JavaScript at all.</Says>
        </Words>
        <Reveal>
          <Says>You reach for the state you always reach for: a boolean, a class to toggle,
            a <Mdn path="Web/CSS/z-index">z-index</Mdn>. It works on the first click, and then the
            bill arrives. Outside clicks need a document listener you must remember to remove.
            Escape needs another. Focus has to find its way back to the button. Assistive tech needs
            telling that the button owns a popup. And somewhere above your table,
            a <Mdn path="Web/CSS/CSS_positioned_layout/Stacking_context">stacking context</Mdn> is
            already beating <code>z-index: 999</code>.</Says>
          <Says>Naming the relationship does all of that for you. Give
            the menu an id and point the button’s <code>popoverTarget</code> at it;
            that is the whole wiring. Pressing the button toggles the popover (the
            default <Mdn path="Web/HTML/Element/button#popovertargetaction"><code>popovertargetaction</code></Mdn>)
            with no <code>onClick</code> anywhere, and the invoker-to-popup accessibility relationship comes
            along free. <code>popover="auto"</code> chooses
            the managed mode: the <Mdn path="Web/Glossary/Top_layer">top layer</Mdn>, above every
            z-index you have ever lost to; light-dismiss on outside click or Escape; one auto
            popover open at a time.</Says>
          <Says>In the React world the sample is built from the site’s Menu, Entry and Item components. A component
            is a function that writes a piece of the page from what it is given; here a menu, an li, one item of a
            list, and a button.</Says>
          {world === 'react'
            ? <Says>Item gives its button the site’s shared classes, looks that live in the site’s shared sheet and
              that an element wears by name, and the page passes Menu the menu’s own, as the sample shows.</Says>
            : <Says>In the vanilla world the buttons carry the same shared classes Item gives them in React, looks
              that live in the site’s shared sheet and that an element wears by name, and the menu’s own classes are
              written on it by hand, as the sample shows.</Says>}
          <Codes>
            {world === 'react'
              ? <Snippet label="HTML" lines={[
                ...span(menuSrc, 'className="menu-toggle', 'aria-label={`sort ${column}`}/>'), gap,
                ...span(menuSrc, '<Menu id={`sort-${column}`}', '</Menu>')
              ]}/>
              : <Snippet label="HTML" lines={[
                ...span(tableSource, '<sort-menu>', '</sort-menu>')
              ]}/>}
          </Codes>
        </Reveal>
      </Step>
      <Step title="Anchored, not measured">
        <Words want="The menu must land by its own button, not centred in the page, and nothing should measure to put it there.">
          <Says>A popover opened by its invoker is anchored to that invoker
            automatically, so <Mdn path="Web/CSS/CSS_anchor_positioning">anchor
              positioning</Mdn> can place it:
            no <Mdn path="Web/CSS/anchor-name"><code>anchor-name</code></Mdn>, no measurement, no
            JavaScript.</Says>
        </Words>
        <Reveal>
          <Says>Picture your toggle as the
            middle cell of a three-by-three grid drawn over the page:
          <Mdn path="Web/CSS/position-area"> <code>position-area</code></Mdn> picks cells.{' '}
          <code>block-end</code> takes the row below the toggle; <code>span-inline-start</code> starts from the toggle’s
            own column and spreads toward the line’s start: under the toggle, hanging left, in
            this writing mode. <Mdn path="Web/CSS/position-try-fallbacks"><code>position-try-fallbacks</code></Mdn>:{' '}
          <code>flip-block</code> is the escape hatch: when the row below has no room, the whole area flips
            above. You measure nothing and write no JavaScript.</Says>
          <Says>A popover also comes with auto margins, a border and padding by default, but none of
            that is this rule’s business: your site reset already zeroes <code>menu</code>, and a page’s own
            styles, the author’s, beat the browser’s default styles, its user-agent stylesheet, however narrowly the
            browser’s rules are aimed, because the <Mdn path="Web/CSS/Cascade">cascade</Mdn>, the order CSS uses to choose
            between rules that disagree, ranks who wrote a rule before how narrowly it is aimed. The list markers
            are the reset’s job too; this site’s reset drops them for <code>menu</code> alongside <code>ol</code> and <code>ul</code>.</Says>
          <Says>One line remains that no reset should write for you: <Mdn path="Web/CSS/inset"><code>inset: auto</code></Mdn>. The
            browser’s default stylesheet centres every popover with <code>inset: 0</code>, and centred versus anchored is this menu’s own
            decision, which is why the fallback below deliberately puts <code>inset: 0</code> back.</Says>
          <Says>Engines that have popovers but not anchor positioning get
            your <Mdn path="Web/CSS/@supports"><code>@supports</code></Mdn> fallback: a centred popover.</Says>
          <Codes>
            <Snippet label="CSS" lines={[
              ...span(menuCss, 'inset: auto;', 'inset: auto;'),
              aside('/* centred is the browser’s default placement; this menu chooses the anchor */'), gap,
              ...span(menuCss, 'position-area: block-end span-inline-start;', 'position-try-fallbacks: flip-block;'),
              aside('/* the invoker is the implicit anchor: below it, hanging leading; flips when cramped */'), gap,
              ...unit(menuCss, '@supports not (position-area: block-end)'),
              aside('/* no anchor positioning? centred: worse placement, same menu */')
            ]}/>
          </Codes>
        </Reveal>
      </Step>
      <Step title="The glyph derives from the sort">
        <Words want="A sorted column must say so, visibly and to assistive technology, without a second source of truth appearing anywhere.">
          <Says>Which column is sorted should be written once, as
            the <Term word="sort">sort</Term>, and every column should wear it from there;
            let <Mdn path="Web/Accessibility/ARIA/Attributes/aria-sort"><code>aria-sort</code></Mdn> be
            the single signal read from it, and let the glyph be CSS reading that attribute.</Says>
        </Words>
        <Reveal>
          {world === 'react'
            ? <Says>The sort is one value in the page’s arrangement, a column name and a
              direction. When the page gives the table its columns it marks the sorting one, and
              only that one, so the <code>th</code> announces <code>aria-sort</code> from what it was given and the toggle
              wears the direction’s glyph from that attribute.</Says>
            : <Says>The sort is one value in the page’s arrangement, a column name and a direction. When the page sets the element’s
              columns with a new sort, <code>announceSort</code> walks them and <code>announce</code>, one function, sets each <code>th</code> from what
              it was given: the sorting <code>th</code> gains <code>aria-sort</code>, and every other <code>th</code> loses it. One value holds the sort, so the headers always agree with
              it.</Says>}
          <Codes>
            {world === 'react'
              ? <Snippet label="TS" lines={[
                ...unit(arrangementSource, 'export type Arrangement'), gap,
                ...unit(demosSource, 'export const selectColumns')
              ]}/>
              : <Snippet label="TS" lines={[
                ...unit(arrangementSource, 'export type Arrangement'), gap,
                ...unit(frameMenus, 'export const announceSort = '), gap,
                ...unit(frameMenus, 'export const announce = ')
              ]}/>}
            <Snippet label="CSS" lines={[
              ...unit(headerCss, '.sortable .header-cell .menu-toggle::before {'), gap,
              ...unit(headerCss, ".sortable [aria-sort='ascending'] .menu-toggle::before {"), gap,
              ...unit(headerCss, ".sortable [aria-sort='descending'] .menu-toggle::before {"),
              aside('/* the glyph is CSS reading the one attribute; no world writes it */')
            ]}/>
            {world === 'react'
              ? <Snippet label="HTML" lines={[
                ...span(source, 'const {sorted, data} = useTableSelector(columnNamed', 'const {sorted, data} = useTableSelector(columnNamed'), gap,
                ...span(source, 'aria-sort={sorted}', 'aria-sort={sorted}')
              ]}/>
              : <Snippet label="HTML" lines={[
                ...span(tableSource, '<th scope="col" class="cell trades header-cell', 'aria-label="sort trades"></button>')
              ]}/>}
          </Codes>
        </Reveal>
      </Step>
      <Step title="The sort keeps sorting">
        <Words want="The data keeps streaming under the sort, so the sort has to keep sorting.">
          <Says>The <Term word="sort">sort</Term> should never be applied once: it is asked of
            the rows every time a value changes, with the ranking living in one function both
            worlds call.</Says>
        </Words>
        <Reveal>
          <Says>Your first instinct is to sort once: rank the rows when the direction is chosen,
            store the result, move on. It even looks right, until the next trade changes a value
            and the table quietly stops being sorted. A sort applied once is stale by the next
            trade.</Says>
          <Says>So the sort is a question the page asks on every read, never a stored answer: each
            read re-ranks the rows by the sorting column, and as values change underneath, the rows move to stay
            sorted.</Says>
          <Codes>
            <Snippet label="TS" lines={[
              ...unit(sortingSource, 'export const ranked'), gap,
              ...unit(arrangementSource, 'export const standingOf'), gap,
              ...unit(demosSource, 'export const selectRows'),
              aside('// both worlds ask the arrangement the same question')
            ]}/>
          </Codes>
        </Reveal>
      </Step>
      <SortedDirectly {...build}/>
      <Step title="A move ends the sort">
        <Words want="Manual order and sorted order cannot both own the table. The moment you drag a row, whose order is it?">
          <Says>The trader should win: the moment the trader moves a row, the sorted order must become
            the real order, and the sort must end.</Says>
        </Words>
        <Reveal>
          <Says>Move a row and the sort ends. The table raises <code>onRowMoved</code> with
            the <Term word="standing">standing</Term> it showed; the page keeps the rows
            where the sort left them, moves the one you moved, and clears the sort, so
            your drag proceeds from what you saw. Choosing "reset" clears the sort the other way:
            back to the <Term word="seats">seats</Term> as they stood before the sort.</Says>
          <Codes>
            {world === 'react'
              ? <Snippet label="TS" lines={[
                ...unit(arrangementSource, 'export const sortEnded'), gap,
                ...span(arrangementSource, "case 'rowMoved':", "case 'rowMoved':"), gap,
                ...unit(rowSrc, 'const beside = ')
              ]}/>
              : <Snippet label="TS" lines={[
                ...unit(arrangementSource, 'export const sortEnded'), gap,
                ...span(arrangementSource, "case 'rowMoved':", "case 'rowMoved':"), gap,
                ...unit(buildSrc, 'const rowBeside = '),
                aside('// the strike and the nudge each carry the standing in their own action; the sort ends as the row moves')
              ]}/>}
          </Codes>
        </Reveal>
      </Step>
      <Step title="The press never becomes a drag">
        <Words want="The menu lives inside a draggable header, where an unguarded press on the toggle would lift the whole column.">
          <Says>Both the toggle and the menu should <Mdn path="Web/API/Event/stopPropagation">stop a press from
            bubbling</Mdn> up to the header around them, so the header never gets it, and a menu should exist only
            where ranking the column means something.</Says>
        </Words>
        <Reveal>
          {world === 'react'
            ? <Says>The toggle and the menu each stop the <code>pointerdown</code>, so the header never gets your press. The toggle sits itself at the header’s end
              edge. And not every column offers a menu: a menu
              exists only where the page writes one inside the header, and a <Mdn path="Web/CSS/:has"><code>:has()</code></Mdn> rule on the cell, which matches an
              element by what it contains, pads for the toggle when one is there.</Says>
            : <Says><code>sort-menu</code> stops the press at the toggle and at the menu. The toggle sits itself at the header’s end edge. And not every column offers a menu: menus
              exist only where the markup writes them, a <Mdn path="Web/CSS/:has"><code>:has()</code></Mdn> rule on the cell, which matches an element by what it
              contains, pads for the toggle when one is there, and the element reads the sortable set off its own markup.</Says>}
          <Says>The toggle’s look is shared classes. <code>borderless</code> and <code>unfilled</code> take off the
            browser’s button chrome, <code>muted-ink</code> greys its glyph, and <code>attentive</code> fills it with the approach colour, the pale green, under a hovering pointer and draws the site’s
            ring when the keyboard reaches it.</Says>
          <Codes>
            {world === 'react'
              ? <Snippet label="TS" lines={[
                ...span(menuSrc, 'onPointerDown={event => event.stopPropagation()}',
                  'onPointerDown={event => event.stopPropagation()}'),
                aside('// on the toggle and on the menu both')
              ]}/>
              : <Snippet label="TS" lines={[
                ...unit(frameMenus, 'const keepingTheColumnStill = '), gap,
                ...span(frameMenus, "...[...host.querySelectorAll('.menu-toggle, .menu')]", '.map(keepingTheColumnStill)'),
                aside('// on the toggle and on the menu both')
              ]}/>}
            {world === 'react'
              ? <Snippet label="HTML" lines={[
                ...span(tableSrc, '<Column column="window"', '<Column column="window"'),
                ...span(tableSrc, '<DraggableColumn column="trades"', '<DraggableColumn column="trades"'), gap,
                ...unit(baseCss, '    &:has(.menu-toggle) {')
              ]}/>
              : <Snippet label="TS" lines={[
                ...unit(frameColumns, 'export const sortableOf = ')
              ]}/>}
            <Snippet label="CSS" lines={[
              ...unit(headerCss, '.sortable .header-cell .menu-toggle {'), gap,
              ...unit(surfaceCss, '.borderless {'), gap,
              ...unit(surfaceCss, '.unfilled {'), gap,
              ...unit(surfaceCss, '.muted-ink {'), gap,
              ...unit(surfaceCss, '.attentive:where(')
            ]}/>
          </Codes>
        </Reveal>
      </Step>
    </Steps>
  </Story>;
};

export const MenuRecipe: FC = () => {
  const {pace = 'eager', world = 'react'} = useSearchParamsObject({pace: paceParam, world: worldParam});
  const build: Build = {
    world,
    source: headerSources[pace],
    menuSrc: menuSource,
    tableSrc: tableSources[pace],
    rowSrc: rowSources[pace],
    buildSrc: buildSources[pace]
  };
  return <section aria-label="build the sort menu yourself" className="build-steps">
    <Stories><RankStory build={build}/></Stories>
  </section>;
};
