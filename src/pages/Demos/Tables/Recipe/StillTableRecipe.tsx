import {TabLink} from '@pages/Demos/TabLink';
import {DemoTopics} from '../../demo-topics';
import {FC, ReactNode} from 'react';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, lines, carve} from '../../Recipe';
import {useControls} from '../../Controls';
import type {World} from '../../Controls';
import {TheImplementation} from './steps';
import dealSource from '../Builds/EagerTable/EagerTable.tsx?sample';
import headerSource from '@components/DragSortableTable/DraggableColumn.tsx?sample';
import cellSource from '@components/DragSortableTable/Cell.tsx?sample';
import widthsSource from '@pages/Demos/Tables/Aggregations.css?sample';
import tableSource from '../Frame/table.html?sample';
import '../../Recipe/Recipe.css';
import {Term} from './Term';
import {elidedHeaders} from './elidedHeaders';

const blankLine = lines.plain(' ');

const dealPlans: Record<World, ReactNode> = {
  react: <>
    <Says>A class, as the <TabLink to={DemoTopics.accordions}>accordions tab</TabLink> says, is a name a style sheet’s
      rules pick out. The columns are declared once, each with a name and a class; how wide they open is CSS. You could
      let the browser size the columns by their content, but a live table would never hold still: a column sized by its
      content widens with a longer number and moves every column beside it. Each time, the browser redoes its layout,
      the work of deciding every box’s size and place. And you could carry widths in the data, but they are layout, not
      data. So I deal the opening widths from the page’s style sheet.
      With <Mdn path="Web/CSS/table-layout">table-layout</Mdn>: fixed the header widths govern their whole columns, so
      the table always fills its container and the columns hold still while the values change.</Says>
    <Says>No JavaScript knows these widths, because nothing needs the size until you touch something. The first
      press or focus of a resize handle measures the headers as they stand and creates the{' '}
    <Term word="ledger">ledger</Term> from them; the drag measures them at the lift. A value that changes at
      runtime is state, and until then nothing has changed.</Says>
  </>,
  vanilla: <Says>A class, as the <TabLink to={DemoTopics.accordions}>accordions tab</TabLink> says, is a name a style
    sheet’s rules pick out. The columns are declared once, each a header cell with a name and a class; how wide they
    open is CSS. You could let the browser size the columns by their content, but a live table would never hold still: a
    column sized by its content widens with a longer number and moves every column beside it. Each time, the browser
    redoes its layout, the work of deciding every box’s size and place. And you could carry widths in the markup, but
    they are layout, not content. So I deal the opening widths from the page’s style sheet.
    With <Mdn path="Web/CSS/table-layout">table-layout</Mdn>: fixed the header widths govern their whole columns, so the
    table always fills its container and the columns
    hold still while the values change.</Says>
};

const suppliedBy: Record<World, ReactNode> = {
  react: <>
    <Says>The page writes the whole table itself: the <code className="monospaced">table</code>, its caption, the head
      and the body, and after it an <code className="monospaced">output</code>, the move report that tells a screen
      reader what moved, whose <code className="monospaced">for</code> names the
      table it reports on. The two choices the later steps explain, <code className="monospaced">origin</code>, whether
      a carried row’s or column’s cells stay visible in their place, and <code className="monospaced">motion</code>,
      whether moves animate, are classes on the table.</Says>
    <Says>The behavior arrives through <code className="monospaced">useDragSortable</code>, a hook. A component is a
      function that writes a piece of the page, as the <TabLink to={DemoTopics.zIndex}>z-index tab</TabLink> says. A
      hook is a function a component calls while it renders. It calls one to keep something across renders, or to read
      something kept outside React. The page calls the hook with its columns, its rows and the two choices.</Says>
    <Says>The hook makes the hand, a store of the table’s own. A store is one plain object that holds state and answers
      when asked. It takes actions, records of what happened, through its dispatch, and after each action it calls its
      subscribers, the functions that asked to hear of changes. The hand holds what is held, the widths, and the marks a
      move leaves on the columns or rows it shoves and on the one it drops, which last as long as their slide.</Says>
    <Says>The hook returns what the parts need to know: the hand’s state, the columns and rows, the dispatch, and the
      classes the table wears, since the behavior’s own style sheets read them.</Says>
    <Says>The page wraps the table in a <Term word="provider">provider</Term>, React’s way to give every component
      inside it one value without adding an element to the page, and the headers, rows, grips, handles and menus read
      the hook’s answer from it.</Says>
    <Says>Each row header carries its lookback as its label, so a screen reader names the row by its lookback and not by
      the grip inside it.</Says>
  </>,
  vanilla: <>
    <Says>The page writes the whole table as it would for any table: the <code className="monospaced">table</code>, its
      caption, the head and the body, and after it an <code className="monospaced">output</code>, the move report that
      tells a screen reader what moved, whose <code className="monospaced">for</code> names the table it reports on. One
      attribute, <code className="monospaced">data-drag-sortable</code>, marks the table as
      one that drag-sorts. Each header cell carries <code className="monospaced">data-column</code>, which names its
      column for the script, so the classes the page writes only dress the cell. The two choices the later steps
      explain, <code
      className="monospaced">origin</code>, whether a carried row’s or
      column’s cells stay visible in their place, and <code className="monospaced">motion</code>, whether moves animate,
      are classes on the table.</Says>
    <Says>At boot a script finds every table so marked and calls <code className="monospaced">dragSortable</code> on it.
      There are two builds of <code className="monospaced">dragSortable</code>, eager and lazy, one file each, and the
      pace is which one boot calls.</Says>
    <Says>The call makes the hand, a store of the table’s own. A store is one plain object that holds state and answers
      when asked. It takes actions, records of what happened, through its dispatch, and after each action it calls its
      subscribers, the functions that asked to hear of changes. The hand holds what is held and the
      widths. The call also wires the table’s listeners at once.</Says>
    <Says>The call returns <code className="monospaced">reconcile</code>, the function the page calls whenever its own
      store changes. Reconcile moves the cells to the new order and writes the text that changed.</Says>
    <Says>The table keeps no copy of the order: the page gives <code className="monospaced">dragSortable</code> two
      functions that read its columns and rows, and the table asks them when it needs an answer.</Says>
    <Says>The table itself is the browser’s, so it shows with its rows before the script runs and without it.</Says>
    <Says>Each row header also carries its lookback as its label, so a screen reader names the row by its lookback and
      not by the grip inside it.</Says>
  </>
};

const dealCodes: Record<World, ReactNode> = {
  react: <Codes>
    <Snippet label="TS" lines={[
      ...carve.span(dealSource, 'const sortable = useDragSortable(', 'const sortable = useDragSortable(')
    ]}/>
    <Snippet label="HTML" lines={[
      ...elidedHeaders(carve.span(dealSource, 'return <DragSortable value={sortable}>', '</Headers>')), blankLine,
      ...carve.span(dealSource, '</table>', '</DragSortable>')
    ]}/>
    <Snippet label="CSS" lines={[
      ...carve.unit(widthsSource, '.aggregations {')
    ]}/>
    <Snippet label="HTML" lines={[
      ...carve.span(headerSource, 'return <th {...th}', 'scope="col"'), blankLine,
      ...carve.span(cellSource, 'return <td {...td}', '</td>;')
    ]}/>
  </Codes>,
  vanilla: <Codes>
    <Snippet label="HTML" lines={[
      ...carve.span(tableSource, '<table class="fancy-table', '</th>'), blankLine,
      ...carve.span(tableSource, '<tbody class="body">', '</tr>')
    ]}/>
    <Snippet label="CSS" lines={[
      ...carve.unit(widthsSource, '.aggregations {')
    ]}/>
  </Codes>
};

const StillStory: FC<{world: World}> = ({world}) =>
  <Story param="living" id="still"
    can="The trader can read the market in a table"
    soThat="the shape is right before anything moves">
    <TheImplementation world={world} react="Aggregations" vanilla="Frame/frame.main.ts"/>
    <Tell>The shape comes from the design, in the element the clues pointed at: a few measures
      across a few lookbacks, numbers on two axes. That is what a table is for. I build it first as a still, from
      whatever trades the page holds: headers on both axes, and the
      reading order correct before a single interaction exists.</Tell>
    <Steps>
      <Step title="Deal a real HTML table">
        <Words want={<>The table is more than JavaScript holding numbers; it is an
          HTML <Mdn path="Web/HTML/Element/table">table</Mdn>: header cells that declare their
          scope, rows a reader and a screen reader both move through.</>}>
          {dealPlans[world]}
        </Words>
        <Reveal>
          <Says>The markup is the platform’s own.
            A <Mdn path="Web/HTML/Element/thead">thead</Mdn> of th headers, one per column, each
            announcing <Mdn path="Web/HTML/Element/th#scope">scope="col"</Mdn>: that one attribute
            is how a screen reader knows to say the column’s name with every cell below it.
            A <Mdn path="Web/HTML/Element/tbody">tbody</Mdn> of rows built from the trades the page holds;
            each row leads with a th of its own,
            announcing <Mdn path="Web/HTML/Element/th#scope">scope="row"</Mdn> so the lookback’s name
            travels with every cell beside it, then a td per measure.</Says>
          {suppliedBy[world]}
          <Says>You could build this out of divs and grid, and it would look identical. But the table
            element brings behavior you would otherwise have to build: readers move through it row by row and cell by
            cell, headers belong to their columns, and everything later, the sorting announcements,
            the drags, the keyboard, builds on these roles instead of reinventing them. This is the
            first rule of <Mdn path="Web/Accessibility/ARIA">ARIA</Mdn>: use the native element when one already has the
            behavior you need.</Says>
          {dealCodes[world]}
        </Reveal>
      </Step>
    </Steps>
  </Story>;

export const StillTableRecipe: FC = () => {
  const {world} = useControls();
  return <section aria-label="the still table" className="build-steps">
    <Stories><StillStory world={world}/></Stories>
  </section>;
};
