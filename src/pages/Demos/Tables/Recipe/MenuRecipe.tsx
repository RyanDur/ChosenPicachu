import {FC, ReactNode} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {Motion, MotionDial, motionParam, originParam, paceParam} from '../../Controls';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {World, worldParam} from '../params';
import {Term} from './Term';
import menuSource from '@components/Menu/index.tsx?raw';
import menuCss from '@components/Menu/Menu.css?raw';
import headerCss from '@components/DragSortableTable/Header.css?raw';
import sortMenuSource from '@components/DragSortableTable/SortMenu.tsx?raw';
import sortingSource from '@components/DragSortableTable/sorting.ts?raw';
import tableSource from '../Frame/table.html?raw';
import stateSource from '@components/DragSortableTable/table-state.ts?raw';
import frameMenus from '../Frame/table/menus.ts?raw';
import frameMount from '../Frame/table/mount.ts?raw';
import {buildSources} from '../Frame/builds/sources';
import settlesSource from '../Frame/builds/settles.ts?raw';
import {headerSources, tableSources} from './sources';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

type Build = {
  world: World;
  source: string;
  headerSrc: string;
  buildSrc: string;
};

const ruled = ({world, source, buildSrc}: Build, motion: Motion, dial: ReactNode) => motion === 'animated'
  ? <Step title="Rule, measure, and mark" dial={dial}>
      <Words want="Choosing a direction reorders every row at once. On the animated table, each row deserves to be drawn sliding from where it was.">
        <Says>A sort is a reorder like any drag, so the slide machinery should serve it:
          measure the seats before the rule lands, mark every moved row with its old offset,
          and commit the rule last.</Says>
      </Words>
      <Reveal>
        {world === 'react'
          ? <Says>Your menu click’s own event reaches the table element, so the animated table’s
            ruled handler measures the seats before the rule lands and marks every moved row with
            its old offset. The same slide your drags play runs for the sort; the rule
            itself is one state update at the end.</Says>
          : <Says>Choosing measures the seats before the rule lands: choose reads the
            row heights first, reseats, and then the variant’s ruled hook marks every moved row
            with its old offset. The same slide the drags play runs for the sort; the
            animated build declares the hook, and the static builds simply do not.</Says>}
        <Codes>
          {world === 'react'
            ? <Snippet label="TS" lines={[
              ...unit(source, 'const ruled = ')
            ]}/>
            : <Snippet label="TS" lines={[
              ...unit(frameMount, '  const choose = '), gap,
              ...unit(settlesSource, 'export const shiftsRuled'), gap,
              ...span(buildSrc, 'ruled: shiftsRuled', 'ruled: shiftsRuled')
            ]}/>}
        </Codes>
      </Reveal>
    </Step>
  : <Step title="Rule directly" dial={dial}>
      <Words want="Motion is not free, and a sort reorders everything at once. The static table answers a menu click with nothing but the rule.">
        <Says>The static answer is the rule alone: set it and let the rows cut to their ranked
          seats.</Says>
      </Words>
      <Reveal>
        {world === 'react'
          ? <Says>This is the static table: ruled sets the rule, and nothing else exists in the
            file. Your rows cut to their ranked seats on the next frame.</Says>
          : <Says>This is the static build: choose sets the rule and paints, and no ruled hook
            exists in the file. Your rows cut to their ranked seats in the same breath.</Says>}
        <Codes>
          {world === 'react'
            ? <Snippet label="TS" lines={[
              ...unit(source, 'const ruled = ')
            ]}/>
            : <Snippet label="TS" lines={[
              ...unit(frameMount, '  const choose = ')
            ]}/>}
        </Codes>
      </Reveal>
    </Step>;

const rankStory = (build: Build, motion: Motion, dial: ReactNode) => {
  const {world, source, headerSrc} = build;
  return <Story param="menu" id="rank" steps={6}
                can="The trader can sort the windows by any measure, or take the order back"
                soThat="the table ranks itself, and the hand still outranks it">
    <Tell>We could build the popup from divs, but then we owe focus, dismissal, and
      stacking, and choosing starts to feel like fighting the menu instead of using it;
      so the chooser is a native menu on the popover API, and the platform
      carries all three. Nothing stores which column is sorted: the glyph and aria-sort
      both derive from the one rule, because a second source of truth only learns to
      drift.</Tell>
    <Tell>We could bake the sort into the seats when the menu closes, and it even looks right
      until the next trade lands unsorted; so the rule never rewrites the seats: standing
      re-ranks on every {world === 'react' ? 'render' : 'paint'}, and the drape keeps ruling.{motion === 'animated'
        ? ' The re-rank slides rows exactly as the drags do, so the eye follows ' +
          'every row to its new seat.'
        : ' The re-rank lands instantly; nothing competes with reading the numbers.'}</Tell>
    <Tell>And rule and hand cannot both own the table: a touch bakes the current standing
      into the seats and clears the rule, and choosing as dealt clears it the other way.
      A press on the chooser never lifts the column; both the toggle and the menu stop
      pointer descent.</Tell>
    <Steps>
      <Step title="A menu that is a menu">
        <Words want="A sort chooser needs a popup, and popups built from divs re-invent focus, dismissal, and stacking.">
          <Says>The platform sells the whole popup: point the
            button’s <Mdn path="Web/HTML/Element/button#popovertarget">popoverTarget</Mdn> at the
            menu, and <Mdn path="Web/HTML/Global_attributes/popover">popover="auto"</Mdn> brings
            the top layer, light-dismiss, and the accessibility relationship,
            while <Mdn path="Web/CSS/CSS_anchor_positioning">anchor positioning</Mdn> places it
            against the invoker with no measuring. The plan is to write no popup JavaScript at
            all.</Says>
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
          <Says>The invoker relationship carries one more gift: it makes your button the popover’s
            implicit anchor. Anchor positioning normally
            asks you to declare an <Mdn path="Web/CSS/anchor-name">anchor-name</Mdn> on one element
            and point another at it. But a popover opened by an invoker is anchored to that invoker
            automatically, which is why you get to
            write <Mdn path="Web/CSS/position-area">position-area</Mdn> with no anchor-name in
            sight.</Says>
          <Says>Read the new syntax as a compass around the anchor. Picture your toggle as the
            middle cell of a three-by-three grid drawn over the page: position-area picks cells.
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
            {world === 'react'
              ? <Snippet label="HTML" lines={[
                ...span(menuSource, '<button type="button"', 'aria-label={label}>{toggle}</button>'), gap,
                ...span(menuSource, '<menu id={id}', '</menu>')
              ]}/>
              : <Snippet label="HTML" lines={[
                ...span(tableSource, '<button type="button" class="menu-toggle rounded-corners"', '</menu>')
              ]}/>}
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
      <Step title="The glyph is the state">
        <Words want="A sorted column must say so, to the eye and to assistive tech, without a second source of truth appearing anywhere.">
          <Says>Nothing should store which column is sorted: derive everything from the one
            rule, let <Mdn path="Web/Accessibility/ARIA/Attributes/aria-sort">aria-sort</Mdn> be
            the single written signal, and let the glyph be CSS reading that attribute.</Says>
        </Words>
        <Reveal>
          {world === 'react'
            ? <Says>The header compares itself against the rule: the toggle wears the
              direction’s glyph, and the th announces aria-sort from the same comparison. SortMenu
              is the whole chooser: three buttons naming the three choices, reporting which column
              asked for what.</Says>
            : <Says>When the rule changes, announce walks the headers and compares each
              against it: the sorted th gains aria-sort, and every other column returns to rest.
              Derive, never store, and the header cannot lie.</Says>}
          <Codes>
            {world === 'react'
              ? <Snippet label="TS" lines={[
                ...unit(sortingSource, 'export const sortedBy'), gap,
                ...span(sortMenuSource, 'export const SortMenu', '</Menu>;')
              ]}/>
              : <Snippet label="TS" lines={[
                ...unit(sortingSource, 'export const sortedBy'), gap,
                ...unit(frameMenus, 'const announce = ')
              ]}/>}
            <Snippet label="CSS" lines={[
              ...unit(headerCss, ".sortable .menu-toggle::before {"), gap,
              ...unit(headerCss, ".sortable th[aria-sort='ascending'] .menu-toggle::before {"), gap,
              ...unit(headerCss, ".sortable th[aria-sort='descending'] .menu-toggle::before {"),
              aside('/* the glyph is CSS reading the one attribute; no world writes it */')
            ]}/>
            {world === 'react'
              ? <Snippet label="HTML" lines={[
                ...span(headerSrc, 'const sorted = sortedBy(columnName, rule);',
                  'const sorted = sortedBy(columnName, rule);'), gap,
                ...span(headerSrc, 'aria-sort={sorted}', 'aria-sort={sorted}')
              ]}/>
              : <Snippet label="HTML" lines={[
                ...span(tableSource, '<th scope="col" class="cell trades header-cell clipped">', 'aria-label="sort trades"></button>')
              ]}/>}
          </Codes>
        </Reveal>
      </Step>
      <Step title="The rule is a drape, not a bake">
        <Words want="The data keeps streaming under the sort, so the rule has to keep ruling.">
          <Says>The rule should never rewrite the <Term word="seats">seats</Term>: it drapes over
            them, and the display re-ranks through it on
            every {world === 'react' ? 'render' : 'paint'}. What to verify: the ranking lives in
            one function both worlds call.</Says>
        </Words>
        <Reveal>
          <Says>Your first instinct is to bake: rank the seats once when the direction is
            chosen, store the result, move on. It even looks right, until the feed writes the
            next value and the table quietly stops being sorted. A sort applied once is stale by
            the next trade, and this data never stops trading.</Says>
          <Says>So the rule drapes: standing re-ranks on
            every {world === 'react' ? 'render' : 'paint'}, and as values change underneath, your rows keep trading places to
            stay sorted. Bake and the sort is a moment; drape and it is a property.</Says>
          <Codes>
            <Snippet label="TS" lines={[
              ...unit(sortingSource, 'export const ranked'), gap,
              ...unit(stateSource, 'export const standingOf'),
              aside('// both worlds drape through the same standing')
            ]}/>
          </Codes>
        </Reveal>
      </Step>
      {ruled(build, motion, dial)}
      <Step title="A hand ends the rule">
        <Words want="Manual order and ruled order cannot both own the table. The moment you drag a row, whose order is it?">
          <Says>The hand should win: the moment a drag starts, the ruled order must become the
            real order, and the rule must end.</Says>
        </Words>
        <Reveal>
          <Says>Touch a row and the current standing bakes into the seats as the rule
            clears: the drape becomes the fabric, and your drag proceeds from exactly what you
            saw. Choosing "as dealt" clears the rule the other way: back to the seats as they
            stand, no drape at all.</Says>
          <Codes>
            {world === 'react'
              ? <Snippet label="TS" lines={[
                ...unit(stateSource, 'export const baked'), gap,
                ...span(source, 'const grabbedRow = ', 'baked(current)));')
              ]}/>
              : <Snippet label="TS" lines={[
                ...unit(stateSource, 'export const baked = '),
                aside('// the grab commits it outright; a nudge folds it into its own move')
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
            ? <Says>The header never hears your press. The toggle itself rides the header’s right
              edge, a track in the cell’s own grid, undressed of its button chrome. And not every
              column offers a menu: each column declares whether ranking it means anything, and
              the header only deals a menu where it does.</Says>
            : <Says>The header never hears your press. The toggle itself rides the header’s right
              edge, a track in the cell’s own grid, undressed of its button chrome. And not every
              column offers a menu: menus exist only where the markup writes them, and the page
              itself declares the sortable set.</Says>}
          <Codes>
            {world === 'react'
              ? <Snippet label="TS" lines={[
                ...span(menuSource, 'onPointerDown={event => event.stopPropagation()}',
                  'onPointerDown={event => event.stopPropagation()}'),
                aside('// on the toggle and on the menu both')
              ]}/>
              : <Snippet label="TS" lines={[
                ...span(frameMount, "  [...table.querySelectorAll('.menu-toggle, .menu')]", 'event.stopPropagation()));'),
                aside('// on the toggle and on the menu both')
              ]}/>}
            {world === 'react'
              ? <Snippet label="HTML" lines={[
                ...span(headerSrc, '{has(onRule) && column.sortable &&', '{has(onRule) && column.sortable &&')
              ]}/>
              : <Snippet label="HTML" lines={[
                ...span(frameMount, 'const measures = order.filter', 'sort-${column}`)));')
              ]}/>}
            <Snippet label="CSS" lines={[
              ...unit(headerCss, '.sortable .menu-toggle {')
            ]}/>
          </Codes>
        </Reveal>
      </Step>
    </Steps>
  </Story>;
};

export const MenuRecipe: FC = () => {
  const {pace = 'eager', origin = 'hide', motion = 'animated', world = 'react'} =
    useSearchParamsObject({pace: paceParam, origin: originParam, motion: motionParam, world: worldParam});
  const build: Build = {
    world,
    source: tableSources[pace][origin][motion],
    headerSrc: headerSources[pace][origin][motion],
    buildSrc: buildSources[pace][origin][motion]
  };
  return <section aria-label="build the sort menu yourself" className="build-steps">
    <Stories>{rankStory(build, motion, <MotionDial name="menu-motion"/>)}</Stories>
  </section>;
};
