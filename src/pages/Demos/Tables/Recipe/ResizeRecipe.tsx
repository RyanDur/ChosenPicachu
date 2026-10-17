import {FC, ReactNode} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {World, worldParam} from '../params';
import {Term} from './Term';
import sharesSource from '@components/Table/shares.ts?sample';
import resizeSource from '@components/DragSortableTable/ResizeHandle.tsx?sample';
import stateSource from '@components/DragSortableTable/table-state.ts?sample';
import baseCss from '@components/DragSortableTable/Table.css?sample';
import surfaceCss from '../../../../styles/surface.css?sample';
import tableSource from '../Frame/table.html?sample';
import buildSource from '@components/DragSortableTable/DraggableColumn.tsx?sample';
import looksSource from '@components/DragSortableTable/looks.ts?sample';
import frameResize from '../Frame/table/resize.ts?sample';
import widthsSource from '../Aggregations.css?sample';
import {TheImplementation, whatACustomPropertyIs} from './steps';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

const ledgerCodes: Record<World, ReactNode> = {
  react: <Codes>
    <Snippet label="TS" lines={[
      ...unit(sharesSource, 'export const measuredWidths'), gap,
      ...unit(looksSource, 'export const headerStates')
    ]}/>
    <Snippet label="HTML" lines={[
      ...span(buildSource, '...headerStates(travels, width)', '...headerStates(travels, width)'), gap,
      ...span(buildSource, "'--share': shareWidth(width)", "'--share': shareWidth(width)")
    ]}/>
    <Snippet label="CSS" lines={[
      ...unit(baseCss, '.fancy-table.apportioned .header-cell.shared {'), gap,
      ...unit(widthsSource, '.fancy-table {')
    ]}/>
  </Codes>,
  vanilla: <Codes>
    <Snippet label="TS" lines={[
      ...unit(sharesSource, 'export const measuredWidths'), gap,
      ...unit(frameResize, '  const awaken = ')
    ]}/>
    <Snippet label="TS" lines={[
      ...unit(frameResize, 'const dressColumn = ')
    ]}/>
    <Snippet label="CSS" lines={[
      ...unit(baseCss, '.fancy-table.apportioned .header-cell.shared {'), gap,
      ...unit(widthsSource, '.fancy-table {')
    ]}/>
  </Codes>
};

const edgeMarkup: Record<World, ReactNode> = {
  react: <Snippet label="HTML" lines={[
    ...span(buildSource, 'return <th {...th}', '{children}')
  ]}/>,
  vanilla: <Snippet label="HTML" lines={[
    ...span(tableSource, '<th scope="col" class="cell trades header-cell', 'aria-label="sort trades"></button>'), gap,
    ...span(tableSource, 'aria-label="resize trades"></button>', '</th>')
  ]}/>
};

const SpokenLabel: FC = () =>
  <Snippet label="TS" lines={[
    ...unit(sharesSource, 'export const resizeLabel')
  ]}/>;

const handleMarkup: Record<World, ReactNode> = {
  react: <Snippet label="HTML" lines={[
    ...span(resizeSource, '<button type="button"', 'aria-label={resizeLabel(column, namedShare)}')
  ]}/>,
  vanilla: <Snippet label="HTML" lines={[
    ...span(tableSource, '<button type="button" tabindex="0" class="resize-handle', 'aria-label="resize window"></button>')
  ]}/>
};

const labelHoldsItsShare = ' While a drag or a held arrow key is under way the label keeps the share it began with and takes the new one when the move ends, so the name under focus does not change at every step.';

const handleSays: Record<World, ReactNode> = {
  react: <Says>The handle is focusable from the start and announced by name, and once the ledger
    exists its label states the <Term word="share">share</Term> too.{labelHoldsItsShare} It pins itself to the
    header’s end edge, stretched to the cell’s height, and the button carries no width of its
    own: it is a grid container whose only item is the 8px line its <code>::after</code> paints, so the
    painted line is the hit area. The{' '}
  <code>col-resize</code> <Mdn path="Web/CSS/cursor">cursor</Mdn> offers the gesture,
    and <Mdn path="Web/CSS/touch-action">touch-action</Mdn>: none lets the pointer drag it
    on a touchscreen.</Says>,
  vanilla: <Says>The handle is focusable from the start, announced by the name the markup gives it, and
    once the ledger exists <code>dressColumn</code> rewrites that label to state
    the <Term word="share">share</Term> too.{labelHoldsItsShare} It pins itself to the header’s end edge, stretched
    to the cell’s height, and the button carries no width of its own: it is a grid container
    whose only item is the 8px line its <code>::after</code> paints, so the painted line is the hit area. The <code>col-resize</code> <Mdn path="Web/CSS/cursor">cursor</Mdn> offers the gesture,
    and <Mdn path="Web/CSS/touch-action">touch-action</Mdn>: none lets the pointer drag it
    on a touchscreen.</Says>
};

const captureSays: Record<World, ReactNode> = {
  react: <Says>On pointerdown the
    handle <Mdn path="Web/API/Element/setPointerCapture">captures its pointer</Mdn> and measures
    the table once: pixels per share. Each move converts the drag into shares and trades only
    the increment since the last one, so a clamped trade never accumulates error.</Says>,
  vanilla: <Says>A press wakes the ledger, <Mdn path="Web/API/Element/setPointerCapture">captures
    the pointer</Mdn> and measures the table once: pixels per share. Each move converts the drag
    into shares and trades only the increment since the last one, so a clamped trade never
    accumulates error.</Says>
};

const GripWords: FC = () =>
  <Snippet label="TS" lines={[
    ...unit(sharesSource, 'export const grippedAt'), gap,
    ...unit(sharesSource, 'export const soughtTrade'), gap,
    ...unit(stateSource, 'export const grip ='), gap,
    ...unit(stateSource, 'export const dragHandle'),
    aside('// both worlds seed the grip and fold the moves in the same store')
  ]}/>;

const captureCodes: Record<World, ReactNode> = {
  react: <Codes>
    <Snippet label="TS" lines={[
      ...unit(resizeSource, 'onPointerDown={(event'), gap,
      ...unit(resizeSource, 'const followed')
    ]}/>
    <GripWords/>
  </Codes>,
  vanilla: <Codes>
    <Snippet label="TS" lines={[
      ...unit(frameResize, "handle.addEventListener('pointerdown'"), gap,
      ...unit(frameResize, "handle.addEventListener('pointermove'")
    ]}/>
    <GripWords/>
  </Codes>
};

const gestureCodes: Record<World, ReactNode> = {
  react: <Codes>
    <Snippet label="TS" lines={[
      ...span(resizeSource, 'onPointerDown={(event', 'event.stopPropagation();'),
      aside('// …the press measures; the bubbling stops here'), gap,
      ...unit(sharesSource, 'export const resizeArrows'), gap,
      ...span(resizeSource, 'onKeyDown={resizeArrows(trade)}', 'onKeyDown={resizeArrows(trade)}'),
      aside('// the column drag above never gets the press')
    ]}/>
  </Codes>,
  vanilla: <Codes>
    <Snippet label="TS" lines={[
      ...span(frameResize, "handle.addEventListener('pointerdown', event => {", 'event.stopPropagation();'),
      aside('// …the press measures; the bubbling stops here'), gap,
      ...unit(frameResize, "handle.addEventListener('keydown'"),
      aside('// the column drag above never gets the press')
    ]}/>
  </Codes>
};

const WidenStory: FC<{world: World}> = ({world}) =>
  <Story param="resize" id="widen"
    can="The trader can widen a column"
    soThat="what they read most gets the room, and the table keeps its shape">
    <Tell>The ledger is the table’s record of each column’s share of the width.</Tell>
    <TheImplementation world={world} react="Builds" vanilla="Frame/table/resize.ts"/>
    <Tell>I could resize with absolute pixel widths, but one drag would break the
      table’s guarantee to fill its container. So widths are shares of a hundred, measured from the rendered headers
      at the first touch, and every resize is a trade
      between neighbours: whatever one column gains, the next gives, and the sum cannot
      change.</Tell>
    <Tell>The header cell lets each control find its own edge, and pads for whatever it holds,
      so the handle sits at the boundary without a box to arrange it. The handle captures its pointer and measures the
      table once, pixels per share. A press on the handle would bubble, which means the browser passes it on to the
      header around it, and the header would start a column drag. So the handle stops the press there, and a
      boundary drag never becomes a column drag. Arrow keys on a focused handle make the same trade, one fixed step
      per arrow. The handle stops those keys from bubbling too, so the header’s own arrow keys never move the
      column.</Tell>
    <Steps>
      <Step title="Keep the widths as a zero-sum ledger">
        <Words want="Absolute pixel widths break the guarantee that the table fills its container: resize one column and the table grows, wraps, or leaves a gap behind.">
          <Says>Widths should be <Term word="share">shares</Term> of a hundred, created by
            measuring the rendered headers when a handle is first pressed or focused; until then, the stylesheet owns the widths and no ledger exists.</Says>
        </Words>
        <Reveal>
          <Says>Pixel widths are the first record you reach for, and every entry in it is wrong as soon as the window
            changes size: nothing keeps the sum equal to the width.</Says>
          <Says>After a trade the header wears <code>shared</code>. A shared class, on this site, is a look that lives
            in the site’s shared sheet and that an element wears by name; <code>shared</code> is not one of those. It
            is a class of the table’s own sheet.</Says>
          <Says>It makes the rule that reads the header’s share match that header. The table itself wears <code>apportioned</code>, a class it has from
            the start; under it a cell clips its text to its column, and a header that wears <code>shared</code> takes its
            width from its share. The header’s share is written as a custom property, <code>--share</code>, one of
            the {whatACustomPropertyIs}.</Says>
          <Says>In <code>Aggregations.css</code>, beside the opening widths, three rules size the table.{' '}
            <code>width: 100%</code> fills its container. <code>min-width: 86rem</code> keeps that width on a narrower page, so the
            container scrolls sideways (64rem on a screen of 600px or less without a coarse pointer).
            Fixed <Mdn path="Web/CSS/table-layout">table layout</Mdn> holds each column at its declared share of whatever width the table
            has.</Says>
          {ledgerCodes[world]}
        </Reveal>
      </Step>
      <Step title="Let each control find the cell’s edge">
        <Words want="A header cell holds a title, sometimes a menu, sometimes a handle; the controls must sit at the cell’s end edge, and a table cell cannot become a grid without ceasing to be a table cell.">
          <Says>No box arranges them. The cell holds its title as text and each control places
            itself: <code><Mdn path="Web/CSS/position">position</Mdn>: absolute</code> against the cell’s end
            edge, with the cell reserving the room in its own padding.</Says>
        </Words>
        <Reveal>
          <Says>You reach for a wrapper: a div inside the cell that becomes a grid and deals every
            piece of furniture a track. It works, and it costs a generic element whose only job is
            to arrange three children, plus an id to hang the column’s name on, because the title
            text is no longer the cell’s own.</Says>
          <Says>So the cell holds a title, a menu where the page writes one, a handle, and
            nothing else. Each control pins itself to the end edge, and a <Mdn path="Web/CSS/:has"><code>:has()</code></Mdn> rule on the
            cell pads for what it holds: more room when a menu is present, less when only the
            handle is. It has a cost: the padding and the controls’ offsets are
            two numbers that must agree, so both live in the one header sheet and nowhere else.
            The column names itself with <code>aria-label</code>, since the title is bare text with no element
            to point at.</Says>
          {edgeMarkup[world]}
        </Reveal>
      </Step>
      <Step title="A handle that is a button">
        <Words want="The handle must be reachable for everyone: a real control at the column’s edge, not a styled sliver that takes no focus and has no name.">
          <Says>The handle should be a
            native <Mdn path="Web/HTML/Element/button">button</Mdn>: focus, announcement, and
            activation for free, <Mdn path="Web/Accessibility/ARIA">ARIA</Mdn>’s own first rule.
            What remains to decide is where it lives and what it paints as its hit area.</Says>
        </Words>
        <Reveal>
          {handleSays[world]}
          <Says>The handle’s look is shared classes. <code>borderless</code> and <code>unfilled</code> take off the
            browser’s button chrome. <code>held-bar-after</code> paints the line: faded leather, a tan, while a pointer
            hovers it, and faded mint, a pale green, while it holds focus. <code>focus-ringed</code> draws the site’s
            ring when the keyboard reaches it.</Says>
          <Codes>
            {handleMarkup[world]}
            <SpokenLabel/>
            <Snippet label="CSS" lines={[
              ...unit(baseCss, '.resize-handle {'), gap,
              ...unit(surfaceCss, '.borderless {'), gap,
              ...unit(surfaceCss, '.unfilled {'), gap,
              ...unit(surfaceCss, '.held-bar-after {'), gap,
              ...unit(surfaceCss, '.focus-ringed {')
            ]}/>
          </Codes>
        </Reveal>
      </Step>
      <Step title="Trade, never take">
        <Words want="Dragging one boundary must not change the table’s total width, and it must not starve a column down to nothing.">
          <Says>Every resize should be a trade between neighbours. If a trade is the only move
            that exists, the total is safe by construction.</Says>
        </Words>
        <Reveal>
          <Says>Whatever one column gains, the next gives, clamped so neither side drops below its
            floor. A column’s floor is the room its header’s controls need, and never less than the slimmest share, 5% of the table.
          </Says>
          <Codes>
            <Snippet label="TS" lines={[
              ...unit(sharesSource, 'const SLIMMEST'), gap,
              ...unit(sharesSource, 'const floorOf'), gap,
              ...unit(sharesSource, 'export const traded')
            ]}/>
          </Codes>
        </Reveal>
      </Step>
      <Step title="Capture the pointer, measure once">
        <Words want="Pointer positions arrive in pixels while the ledger holds shares, and asking the DOM for the table’s width on every move forces a layout each time.">
          <Says>Capture on the handle, which is safe here because unlike the sort’s cells the
            handle never moves in the DOM, and measure the table once: pixels per share, the
            resize’s own <Term word="survey">survey</Term>.</Says>
        </Words>
        <Reveal>
          {captureSays[world]}
          {captureCodes[world]}
        </Reveal>
      </Step>
      <Step title="Two gestures, one header">
        <Words want="The handle lives inside a draggable header, so pressing it would lift the whole column into a drag.">
          <Says>The handle should <Mdn path="Web/API/Event/stopPropagation">stop its press from bubbling</Mdn> up to
            the header, and arrow keys on the handle should make the same trade as a drag, a fixed step per arrow. It should stop those keys there
            as well, because the header handles arrow keys by moving the column.</Says>
        </Words>
        <Reveal>
          {gestureCodes[world]}
        </Reveal>
      </Step>
    </Steps>
  </Story>;

export const ResizeRecipe: FC = () => {
  const {world = 'react'} = useSearchParamsObject({world: worldParam});
  return <section aria-label="build the drag resize yourself" className="build-steps">
    <Stories><WidenStory world={world}/></Stories>
  </section>;
};
