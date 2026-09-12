import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {paceParam} from '../../Controls';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {World, worldParam} from '../params';
import {Term} from './Term';
import menuCss from '../../../../styles/menu.css?raw';
import headerCss from '@components/DragSortableTable/Header.css?raw';
import sortingSource from '@components/DragSortableTable/sorting.ts?raw';
import tableSource from '../Frame/table.html?raw';
import arrangementSource from '@components/DragSortableTable/arrangement.ts?raw';
import demosSource from '@pages/Demos/store.ts?raw';
import frameMenus from '../Frame/table/menus.ts?raw';
import {buildSources} from '../Frame/builds/sources';
import {headerSources, rowSources, tableSources} from './sources';
import {menuSource} from './shared-steps/sources';
import {theImplementation} from './shared-steps';
import baseCss from '@components/Table/Table.css?raw';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

type Build = {
  world: World;
  source: string;
  menuSrc: string;
  tableSrc: string;
  rowSrc: string;
  buildSrc: string;
};

const sortedDirectly = ({world, menuSrc, buildSrc}: Build) =>
  <Step title="Sort directly">
    <Words want="A sort reorders everything at once, and no hand is on the table to explain it.">
      <Says>The answer is the sort alone: dispatch it and let the rows cut to their ranked
        seats. Motion in these tables belongs to the hand, and a menu click has none.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>SortMenu is the whole chooser: three buttons naming the three choices, raising
          onSorted with which column asked for what. The page dispatches it, and that is the
          whole answer. The rows cut to their ranked seats on the next frame, in the animated
          table and the static one alike.</Says>
        : <Says>Choose dispatches the sort into the arrangement, and the reconcile moves the lanes
          in the same breath. The rows cut to their ranked seats, in the animated build and the
          static one alike.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...span(menuSrc, 'export const SortMenu', '</>;')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(buildSrc, '  const choose = ')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;

const rankStory = (build: Build) => {
  const {world, source, menuSrc, tableSrc, rowSrc, buildSrc} = build;
  return <Story param="menu" id="rank" steps={7}
                can="The trader can sort the windows by any measure, or take the order back"
                soThat="the table ranks itself, and the hand still outranks it">
    {theImplementation(world, 'Builds', 'Frame/table/menus.ts')}
    <Tell>We could build the popup from divs, but then we owe focus, dismissal, and
      stacking, and choosing starts to feel like fighting the menu instead of using it;
      so the chooser leans on the platform, and the first steps below collect what that
      decision buys. Sorting state has its own trap: the glyph, the attribute, and the
      ranked rows all want their own copy of which column is chosen, and copies
      drift.</Tell>
    <Tell>And two forces pull at whatever the trader chooses. The data keeps streaming under
      the sort, so a sort that happens once is stale by the next trade. And the hand wants
      the order too: the trader who drags a row mid-sort is not wrong, and the table must
      decide whose order wins.</Tell>
    <Steps>
      <Step title="A menu that is a menu">
        <Words want="A sort chooser needs a popup, and popups built from divs re-invent focus, dismissal, and stacking.">
          <Says>The platform sells the whole popup: point the
            button’s <Mdn path="Web/HTML/Element/button#popovertarget">popoverTarget</Mdn> at the
            menu, and <Mdn path="Web/HTML/Global_attributes/popover">popover="auto"</Mdn> brings
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
            already beating z-index: 999.</Says>
          <Says>Naming the relationship takes all of that off your hands. Give
            the menu an id and point the button’s popoverTarget at it;
            that is the whole wiring. Pressing the button toggles the popover (the
            default <Mdn path="Web/HTML/Element/button#popovertargetaction">popovertargetaction</Mdn>)
            with no onClick anywhere, and the invoker-to-popup accessibility relationship comes
            along free. popover="auto" chooses
            the managed mode: the <Mdn path="Web/Glossary/Top_layer">top layer</Mdn>, above every
            z-index you have ever lost to; light-dismiss on outside click or Escape; one auto
            popover open at a time.</Says>
          <Codes>
            {world === 'react'
              ? <Snippet label="HTML" lines={[
                ...span(menuSrc, '<button type="button" tabIndex={0} className="menu-toggle rounded-corners"', 'aria-label={`sort ${column}`}/>'), gap,
                ...span(menuSrc, '<menu id={`sort-${column}`}', '</menu>')
              ]}/>
              : <Snippet label="HTML" lines={[
                ...span(tableSource, '<button type="button" tabindex="0" class="menu-toggle rounded-corners"', '</menu>')
              ]}/>}
          </Codes>
        </Reveal>
      </Step>
      <Step title="Anchored, not measured">
        <Words want="The menu must land by its own button, not centered in the page, and nothing should measure to put it there.">
          <Says>A popover opened by its invoker is anchored to that invoker
            automatically, so <Mdn path="Web/CSS/CSS_anchor_positioning">anchor
            positioning</Mdn> can place it:
            no <Mdn path="Web/CSS/anchor-name">anchor-name</Mdn>, no measurement, no
            JavaScript.</Says>
        </Words>
        <Reveal>
          <Says>Read the new syntax as a compass around the anchor. Picture your toggle as the
            middle cell of a three-by-three grid drawn over the page:
            <Mdn path="Web/CSS/position-area"> position-area</Mdn> picks cells.
            block-end takes the row below the toggle; span-inline-start starts from the toggle’s
            own column and spreads toward the line’s start: under the toggle, hanging left, in
            this writing mode. <Mdn path="Web/CSS/position-try-fallbacks">position-try-fallbacks</Mdn>:
            flip-block is the escape hatch: when the row below has no room, the whole area flips
            above. You measure nothing and write no JavaScript.</Says>
          <Says>A popover also ships dressed in auto margins, a border, and padding, but none of
            that is this rule’s business: your site reset already zeroes menu, and author styles
            beat user-agent styles no matter the specificity. The list markers are the reset’s
            job too; this site’s reset drops them for menu alongside ol and ul. One line remains
            that no reset should write for you: <Mdn path="Web/CSS/inset">inset</Mdn>: auto. The UA
            centers every popover with inset: 0, and centered versus anchored is this menu’s own
            decision, which is why the fallback below deliberately puts inset: 0 back.</Says>
          <Says>Engines that have popovers but not anchor positioning get
            your <Mdn path="Web/CSS/@supports">@supports</Mdn> fallback: a centered popover. Worse
            placement, same menu: the feature degrades, the function does not.</Says>
          <Codes>
            <Snippet label="CSS" lines={[
              ...span(menuCss, 'inset: auto;', 'inset: auto;'),
              aside('/* centered is the UA’s placement; this menu chooses the anchor */'), gap,
              ...span(menuCss, 'position-area: block-end span-inline-start;', 'position-try-fallbacks: flip-block;'),
              aside('/* the invoker is the implicit anchor: below it, hanging leading; flips when cramped */'), gap,
              ...unit(menuCss, '@supports not (position-area: block-end)'),
              aside('/* no anchor positioning? centered: worse placement, same menu */')
            ]}/>
          </Codes>
        </Reveal>
      </Step>
      <Step title="The glyph derives from the sort">
        <Words want="A sorted column must say so, to the eye and to assistive tech, without a second source of truth appearing anywhere.">
          <Says>Which column is sorted should be written once, as
            the <Term word="sort">sort</Term>, and every column should wear it from there;
            let <Mdn path="Web/Accessibility/ARIA/Attributes/aria-sort">aria-sort</Mdn> be
            the single signal read from it, and let the glyph be CSS reading that attribute.</Says>
        </Words>
        <Reveal>
          {world === 'react'
            ? <Says>The sort is one value in the page’s arrangement, a column name and a
              direction. When the page hands the table its columns it marks the sorting one, and
              only that one, so the th announces aria-sort from what it was handed and the toggle
              wears the direction’s glyph from that attribute.</Says>
            : <Says>The sort is one value in the arrangement, a column name and a direction. When
              it changes, announce walks the headers asking it for each: the sorting th gains
              aria-sort, and every other column returns to rest. One value holds the sort, and the
              header cannot lie.</Says>}
          <Codes>
            {world === 'react'
              ? <Snippet label="TS" lines={[
                ...unit(arrangementSource, 'export type Arrangement'), gap,
                ...unit(demosSource, 'export const selectColumns')
              ]}/>
              : <Snippet label="TS" lines={[
                ...unit(arrangementSource, 'export type Arrangement'), gap,
                ...span(buildSrc, 'if (previous.sort !== next.sort) {', 'announce(document, name'), gap,
                ...unit(frameMenus, 'export const announce = ')
              ]}/>}
            <Snippet label="CSS" lines={[
              ...unit(headerCss, ".sortable .header-cell > .menu-toggle::before {"), gap,
              ...unit(headerCss, ".sortable [aria-sort='ascending'] > .menu-toggle::before {"), gap,
              ...unit(headerCss, ".sortable [aria-sort='descending'] > .menu-toggle::before {"),
              aside('/* the glyph is CSS reading the one attribute; no world writes it */')
            ]}/>
            {world === 'react'
              ? <Snippet label="HTML" lines={[
                ...span(source, 'const {sorted, data} = useTableSelector(columnNamed', 'const {sorted, data} = useTableSelector(columnNamed'), gap,
                ...span(source, 'aria-sort={sorted}', 'aria-sort={sorted}')
              ]}/>
              : <Snippet label="HTML" lines={[
                ...span(tableSource, '<th scope="col" class="cell trades header-cell"', 'aria-label="sort trades"></button>')
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
            trade, and this data never stops trading.</Says>
          <Says>So the sort is a question, never an answer that is stored: every read re-ranks
            the rows through the sorting column, so as values change underneath, the rows keep
            trading places to stay sorted. Sort once and the sort is a moment; keep asking and
            it is a property.</Says>
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
      {sortedDirectly(build)}
      <Step title="A hand ends the sort">
        <Words want="Manual order and sorted order cannot both own the table. The moment you drag a row, whose order is it?">
          <Says>The hand should win: the moment a hand moves a row, the sorted order must become
            the real order, and the sort must end.</Says>
        </Words>
        <Reveal>
          <Says>Move a row and the sort ends: the table raises onRowMoved with
            the <Term word="standing">standing</Term> it showed, and the page keeps the rows
            exactly where the sort left them, moves the one you moved, and clears the sort, so
            your drag proceeds from what you saw. Choosing "reset" clears the sort the other way:
            back to the <Term word="seats">seats</Term> in the order they arrived, nothing
            sorting them at all.</Says>
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
          <Says>Both the toggle and the menu
            should <Mdn path="Web/API/Event/stopPropagation">stop pointer descent</Mdn> so the
            header never hears the press, and a menu should exist only where ranking the column
            means something.</Says>
        </Words>
        <Reveal>
          {world === 'react'
            ? <Says>The header never hears your press. The toggle sits itself at the header’s end
              edge, undressed of its button chrome. And not every column offers a menu: a menu
              exists only where the page writes one inside the header, and the cell pads for it
              by asking the cascade what it holds.</Says>
            : <Says>The header never hears your press. The toggle sits itself at the header’s end
              edge, undressed of its button chrome. And not every column offers a menu: menus
              exist only where the markup writes them, the cell pads for them by asking the
              cascade what it holds, and the page itself declares the sortable set.</Says>}
          <Codes>
            {world === 'react'
              ? <Snippet label="TS" lines={[
                ...span(menuSrc, 'onPointerDown={event => event.stopPropagation()}',
                  'onPointerDown={event => event.stopPropagation()}'),
                aside('// on the toggle and on the menu both')
              ]}/>
              : <Snippet label="TS" lines={[
                ...span(buildSrc, "  [...table.querySelectorAll('.menu-toggle, .menu')]", 'event.stopPropagation()));'),
                aside('// on the toggle and on the menu both')
              ]}/>}
            {world === 'react'
              ? <Snippet label="HTML" lines={[
                ...span(tableSrc, '<Column column="window"', '<Column column="window"'),
                ...span(tableSrc, '<DraggableColumn column="trades"', '<DraggableColumn column="trades"'), gap,
                ...unit(baseCss, '    &:has(> .menu-toggle) {')
              ]}/>
              : <Snippet label="HTML" lines={[
                ...span(buildSrc, 'const sortable = order.filter', 'sort-${column}`)));')
              ]}/>}
            <Snippet label="CSS" lines={[
              ...unit(headerCss, '.sortable .header-cell > .menu-toggle {')
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
    <Stories>{rankStory(build)}</Stories>
  </section>;
};
