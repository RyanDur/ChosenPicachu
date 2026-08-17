import {FC, ReactNode} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {Codes, Mdn, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {World, worldParam} from '../params';
import sharesSource from '@components/Table/shares.ts?raw';
import resizeSource from '@components/Table/ResizeHandle.tsx?raw';
import baseCss from '@components/Table/Table.css?raw';
import headerSource from '@components/DragSortableTable/EagerHideAnimatedTable/Header.tsx?raw';
import headerCss from '@components/DragSortableTable/Header.css?raw';
import tableSource from '../Frame/table.html?raw';
import frameResize from '../Frame/table/resize.ts?raw';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

const ledgerCodes: Record<World, ReactNode> = {
  react: <Codes>
    <Snippet label="TS" lines={[
      ...unit(sharesSource, 'export const measuredShares')
    ]}/>
    <Snippet label="HTML" lines={[
      plain("<th className=\"header-cell\" style={{'--share': `${share}%`}}>")
    ]}/>
    <Snippet label="CSS" lines={[
      ...unit(baseCss, '.fancy-table.apportioned .header-cell.shared {'), gap,
      ...unit(headerCss, '.sortable .header-cell {')
    ]}/>
  </Codes>,
  vanilla: <Codes>
    <Snippet label="TS" lines={[
      ...unit(sharesSource, 'export const measuredShares'), gap,
      ...unit(frameResize, '  const awaken = ')
    ]}/>
    <Snippet label="TS" lines={[
      ...unit(frameResize, 'const dressColumn = ')
    ]}/>
    <Snippet label="CSS" lines={[
      ...unit(baseCss, '.fancy-table.apportioned .header-cell.shared {'), gap,
      ...unit(headerCss, '.sortable .header-cell {')
    ]}/>
  </Codes>
};

const gridMarkup: Record<World, ReactNode> = {
  react: <Snippet label="HTML" lines={[
    ...span(headerSource, "<div className={classNames('header-cell-content'", '</div>')
  ]}/>,
  vanilla: <Snippet label="HTML" lines={[
    ...span(tableSource, '<div class="header-cell-content rankable resizable">trades', 'aria-label="sort trades"></button>'), gap,
    ...span(tableSource, 'aria-label="resize trades"></button>', '</div>')
  ]}/>
};

const spokenLabel =
  <Snippet label="TS" lines={[
    ...unit(sharesSource, 'export const resizeLabel')
  ]}/>;

const handleMarkup: Record<World, ReactNode> = {
  react: <Snippet label="HTML" lines={[
    ...span(resizeSource, '<button type="button"', 'aria-label={resizeLabel(column, share)}')
  ]}/>,
  vanilla: <Snippet label="HTML" lines={[
    ...span(tableSource, '<button type="button" class="resize-handle"', 'aria-label="resize window"></button>')
  ]}/>
};

const handleSays: Record<World, ReactNode> = {
  react: <Says>The handle is a
    native <Mdn path="Web/HTML/Element/button">button</Mdn>: focusable by birth, announcing
    itself by name, and once the ledger exists its label speaks the share too. This
    is <Mdn path="Web/Accessibility/ARIA">ARIA</Mdn>’s own first rule: prefer the native
    element, because it carries focus, announcement, and activation for free, and the
    user’s need is met by the platform instead of imitated. The grid from the
    last step deals it the header’s end track, and the button carries no width of its own:
    it is a grid container whose only item is the 8px line its ::after paints, so the
    painted line is the hit area. The
    col-resize <Mdn path="Web/CSS/cursor">cursor</Mdn> offers the gesture,
    and <Mdn path="Web/CSS/touch-action">touch-action</Mdn>: none lets the pointer drag it
    on a touchscreen.</Says>,
  vanilla: <Says>The handle is a
    native <Mdn path="Web/HTML/Element/button">button</Mdn>: focusable by birth, announcing
    the name the markup gives it, and once the ledger exists dressColumn rewrites that label
    to speak the share too. This
    is <Mdn path="Web/Accessibility/ARIA">ARIA</Mdn>’s own first rule: prefer the native
    element, because it carries focus, announcement, and activation for free, and the
    user’s need is met by the platform instead of imitated. The grid from the
    last step deals it the header’s end track, and the button carries no width of its own:
    it is a grid container whose only item is the 8px line its ::after paints, so the
    painted line is the hit area. The
    col-resize <Mdn path="Web/CSS/cursor">cursor</Mdn> offers the gesture,
    and <Mdn path="Web/CSS/touch-action">touch-action</Mdn>: none lets the pointer drag it
    on a touchscreen.</Says>
};

const captureSays: Record<World, ReactNode> = {
  react: <Says>On pointerdown the
    handle <Mdn path="Web/API/Element/setPointerCapture">captures its pointer</Mdn> (safe
    here, because unlike the sort’s cells the handle never moves in the DOM) and measures the
    table once: pixels per share. Each move converts the drag into shares and trades only the
    increment since the last one, so a clamped trade never accumulates error.</Says>,
  vanilla: <Says>A press wakes the ledger and measures the table once: pixels per share. The
    first move <Mdn path="Web/API/Element/setPointerCapture">captures the pointer</Mdn> (safe
    here, because unlike the sort’s cells the handle never moves in the DOM), and each move
    converts the drag into shares and trades only the increment since the last one, so a
    clamped trade never accumulates error.</Says>
};

const gripWords =
  <Snippet label="TS" lines={[
    ...unit(sharesSource, 'export const grippedAt'), gap,
    ...unit(sharesSource, 'export const soughtTrade'),
    aside('// both worlds seed the grip and fold the moves with the same words')
  ]}/>;

const captureCodes: Record<World, ReactNode> = {
  react: <Codes>
    <Snippet label="TS" lines={[
      ...unit(resizeSource, 'onPointerDown={(event'), gap,
      ...unit(resizeSource, 'onPointerMove={(event')
    ]}/>
    {gripWords}
  </Codes>,
  vanilla: <Codes>
    <Snippet label="TS" lines={[
      ...unit(frameResize, "handle.addEventListener('pointerdown'"), gap,
      ...unit(frameResize, "handle.addEventListener('pointermove'")
    ]}/>
    {gripWords}
  </Codes>
};

const gestureCodes: Record<World, ReactNode> = {
  react: <Codes>
    <Snippet label="TS" lines={[
      ...span(resizeSource, 'onMouseDown={event => event.stopPropagation()}',
        'onMouseDown={event => event.stopPropagation()}'), gap,
      ...unit(sharesSource, 'export const resizeArrows'), gap,
      ...span(resizeSource, 'onKeyDown={resizeArrows(onTrade)}', 'onKeyDown={resizeArrows(onTrade)}'),
      aside('// the column dial above never hears a thing')
    ]}/>
  </Codes>,
  vanilla: <Codes>
    <Snippet label="TS" lines={[
      ...span(frameResize, "handle.addEventListener('pointerdown', event => {", 'event.stopPropagation();'),
      plain('    // …the press measures; the descent stops here'), gap,
      ...unit(frameResize, "handle.addEventListener('keydown'"),
      aside('// the column drag above never hears a thing')
    ]}/>
  </Codes>
};

const widenStory = (world: World) =>
  <Story param="resize" id="widen"
         can="The trader can widen a column"
         soThat="what they read most gets the room, and the table keeps its shape">
    <Tell>We could resize with absolute pixel widths, but one drag would break the
      table’s promise to fill its container; so widths are shares of a hundred, born by
      measuring the rendered headers at the first touch, and every resize is a trade
      between neighbours: whatever one column gains, the next gives, and the sum cannot
      change.</Tell>
    <Tell>The header cell lays its furniture on a grid, so the handle has a track instead of a
      post. It captures its pointer and measures the table once, pixels per share; it
      stops pointer descent, so a boundary drag never becomes a column drag; and the
      keyboard gets the same road, one fixed step per arrow.</Tell>
    <Steps>
      <Step title="Keep the widths as a zero-sum ledger">
        <Words want="Absolute pixel widths break the promise that the table fills its container: resize one column and the table grows, wraps, or leaves a gap behind.">
          <Says>Pixel widths are the first ledger you reach for, and every entry in it is a lie
            waiting for a resize: the sum answers to nobody.</Says>
          <Says>Widths are shares of a hundred, born by measuring the rendered headers the first
            time a hand arrives; until then the page’s stylesheet owns the widths and no ledger
            exists. After a trade the header wears the shared class and its share rides a custom
            property, and fixed <Mdn path="Web/CSS/table-layout">table layout</Mdn>, set beside the
            opening widths in that same stylesheet, keeps the table exactly its container: every
            column a fraction of it, one record keeping one promise.</Says>
        </Words>
        {ledgerCodes[world]}
      </Step>
      <Step title="Lay the header out on a grid">
        <Words want="A header cell seats a title, sometimes a menu, sometimes a handle; the cell must tell that furniture where to live, and a table cell cannot become a grid without ceasing to be a table cell.">
          <Says>You reach for absolute positioning: pin the furniture to the cell’s edge and
            reserve room for it with padding. It works until it does not: the pinned widths, the
            reserved padding, and the layout are three numbers agreeing by luck, and nothing
            breaks loudly when one drifts.</Says>
          <Says>So the cell surrenders its padding and a plain div takes the whole cell (an explicit
            height keeps the header’s stature, since block padding would inset the furniture). The
            div is the <Mdn path="Web/CSS/CSS_grid_layout">grid</Mdn>; its columns compose from what
            the header actually carries: a class per piece of furniture, and each combination
            declares its own tracks. The parent tells the children where they live, and the classes
            say why.</Says>
        </Words>
        <Codes>
          {gridMarkup[world]}
          <Snippet label="CSS" lines={[
            ...unit(baseCss, '.header-cell {'), gap,
            ...unit(baseCss, '.header-cell-content {'), gap,
            ...unit(baseCss, '.header-cell-content.rankable {'), gap,
            ...unit(baseCss, '.header-cell-content.resizable {'), gap,
            ...unit(baseCss, '.header-cell-content.rankable.resizable {')
          ]}/>
        </Codes>
      </Step>
      <Step title="A handle that is a button">
        <Words want="The affordance must be reachable and honest for everyone: a real control at the column’s edge, not a styled sliver of nothing.">
          {handleSays[world]}
        </Words>
        <Codes>
          {handleMarkup[world]}
          {spokenLabel}
          <Snippet label="CSS" lines={[
            ...unit(baseCss, '.resize-handle {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Trade, never take">
        <Words want="Dragging one boundary must not change the table’s total width, and it must not starve a column down to nothing.">
          <Says>Every resize is a trade between neighbours: whatever one column gains, the next
            gives, clamped so neither side drops below the slimmest share, and because a trade only
            ever moves value between two entries of the ledger, the sum cannot change. The
            invariant is not checked; it is built in.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(sharesSource, 'export const traded')
          ]}/>
        </Codes>
      </Step>
      <Step title="Capture the pointer, measure once">
        <Words want="Pointer positions arrive in pixels while the ledger speaks in shares, and asking the DOM for the table’s width on every move brings back layout thrash.">
          {captureSays[world]}
        </Words>
        {captureCodes[world]}
      </Step>
      <Step title="Two gestures, one header">
        <Words want="The handle lives inside a draggable header, so pressing it would lift the whole column into a drag.">
          <Says>The
            handle <Mdn path="Web/API/Event/stopPropagation">stops pointer descent</Mdn>, so the sort
            never hears the press, and the keyboard gets its own road: focus the handle and the
            arrow keys trade a fixed step, no pointer required.</Says>
        </Words>
        {gestureCodes[world]}
      </Step>
    </Steps>
  </Story>;

export const ResizeRecipe: FC = () => {
  const {world = 'react'} = useSearchParamsObject({world: worldParam});
  return <section aria-label="build the drag resize yourself" className="build-steps">
    <Stories>{widenStory(world)}</Stories>
  </section>;
};
