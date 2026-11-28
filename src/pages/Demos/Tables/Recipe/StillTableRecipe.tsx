import {ClassGloss} from '@pages/Demos/Accordions';
import {PartLink} from '@pages/Demos/ZIndexDemo';
import {FC, ReactNode} from 'react';
import {AnnotatedListing, InkedLines, Mdn, Piece, PieceCode, PieceNote, Reveal, Says, Step, StepHeading, Steps, Stories, Story, Tell, Want, Words, WorkingCode, lines, carve} from '../../Recipe';
import {useControls} from '../../Controls';
import type {World} from '../../ReaderSettings';
import {TheImplementation} from './steps';
import dealSource from '../Builds/EagerTable/EagerTable.tsx?sample';
import columnSource from '@components/DragSortableTable/Column.tsx?sample';
import tableCss from '@components/DragSortableTable/Table.css?sample';
import widthsSource from '@pages/Demos/Tables/Aggregations.css?sample';
import frameTable from '../Frame/table.html?sample';
import '../../Recipe/Recipe.css';
import {Term} from './Term';
import {livingStories} from '../living-stories';

const dealPlans: Record<World, ReactNode> = {
  react: <>
    <Says><ClassGloss/> The columns are declared once, each with a name and a class; how wide they open is CSS. You
      could let the browser size the columns by their content, but a live table would never hold still: a column sized
      by its content widens with a longer number and moves every column beside it. Each time, the browser redoes its
      layout, the work of deciding every box’s size and place. And you could carry widths in the data, but they are
      layout, not data. So I deal the opening widths from the page’s style sheet.
      With <Mdn path="Web/CSS/table-layout">table-layout</Mdn>: fixed the header widths govern their whole columns, so
      the table always fills its container and the columns hold still while the values change.</Says>
    <Says>No JavaScript knows these widths, because nothing needs the size until you touch something. The first
      press or focus of a resize handle measures the headers as they stand and creates
      the <Term word="ledger">ledger</Term> from them; the drag measures them at the lift. A value that changes at
      runtime is state, and until then nothing has changed.</Says>
  </>,
  vanilla: <Says><ClassGloss/> The columns are declared once, each a header cell with a name and a class; how wide they
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
      function that writes a piece of the page, as taught in the z-index part <PartLink part="why-the-popover-wins"/>. A
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

const eachMeasure = '{/* … one for each measure */}';

const markupPieces: Record<World, ReactNode> = {
  react: <AnnotatedListing heading="React · under each piece, what it means and when it runs">
    <Piece>
      <PieceCode><InkedLines label="TS" lines={carve.elided(carve.elided(
        carve.between(dealSource, '<table id="live-aggregations"', '</table>'),
        '<DraggableColumn column="buys"', '</Headers>', eachMeasure), '<Cell column="buys"', '</Row>;', eachMeasure)}/>
      </PieceCode>
      <PieceNote when="Runs each time the page is drawn.">The table, written with components. A component is a function
        that writes a piece of the page, as the z-index tab explains. <code className="monospaced">Headers</code> writes
        the head’s row, <code className="monospaced">Column</code> a header cell, <code
        className="monospaced">Body</code> the body, <code className="monospaced">Row</code> a
        row, <code className="monospaced">RowHeader</code> the cell that names a row,
        and <code className="monospaced">Cell</code> a cell that holds a number. They are the same components the Users
        page builds its table from. The table’s caption and rows come in as props,
        and <code className="monospaced">sortable</code> is what <code
        className="monospaced">useDragSortable</code> returns, as the step above says. The rest arrive with later
        parts: <code
        className="monospaced">DraggableColumn</code>, a header that can move, with part
        6, <code className="monospaced">SortMenu</code> with part 7 and <code
        className="monospaced">ResizeHandle</code> with part 8. No part
        explains <code className="monospaced">DirectionWord</code> and <code
        className="monospaced">data-ticked</code> yet.</PieceNote>
    </Piece>
    <Piece>
      <PieceCode><InkedLines label="TS" lines={carve.unit(columnSource, 'export const Column')}/></PieceCode>
      <PieceNote when="Runs for each column, each time the page is drawn.">What <code
        className="monospaced">Column</code> writes: one th. <code className="monospaced">scope="col"</code> says the
        header names every cell under it, so a screen reader can say “trades” with each number in that column. The
        classes come from <code className="monospaced">looks</code>: <code className="monospaced">cell</code> and <code
        className="monospaced">header-cell</code>, then the rule after the cell, the bar below it and the focus
        ring. <code className="monospaced">aria-sort</code> and <code className="monospaced">--share</code> are for
        part 7 and part 8: the first says whether the rows are ranked by this column, and the second is a width the
        trader has set.</PieceNote>
    </Piece>
  </AnnotatedListing>,
  vanilla: <AnnotatedListing heading="HTML · under each piece, what it means and when it changes">
    <Piece>
      <PieceCode><InkedLines label="HTML" lines={carve.between(frameTable, '<section aria-label', '<caption')}/>
      </PieceCode>
      <PieceNote when="Never changes.">The table, inside a section the style sheet sizes it by. A screen reader says
        the caption when its reader enters the table, and the class <code className="monospaced">off-screen</code> keeps
        it out of sight. The class <code className="monospaced">apportioned</code> says the columns are given their
        widths. The classes <code className="monospaced">sortable</code>, <code className="monospaced">hide</code> and <code
        className="monospaced">animated</code> and the attribute <code
        className="monospaced">data-drag-sortable</code> arrive with part 6.</PieceNote>
    </Piece>
    <Piece>
      <PieceCode><InkedLines label="HTML" lines={carve.elided(carve.elided(carve.elided(
        carve.between(frameTable, '<thead>', '</thead>'),
        'data-resize-handle', '</th>', '<!-- … its resize handle -->'),
      'data-sort-toggle', '</th>', '<!-- … its sort menu and resize handle -->'),
      '<th scope="col" class="cell header-cell buys', '</tr>', '<!-- … one for each measure -->')}/></PieceCode>
      <PieceNote when="Never changes.">The head: one header cell for each column. <code
        className="monospaced">scope="col"</code> says the header names every cell under it, so a screen reader can say
        “trades” with each number in that column. The class <code className="monospaced">lookback</code> or <code
        className="monospaced">trades</code> names the column for the style sheet that sets its width. The two muted
        classes draw the rule after the cell and the bar below it. <code
        className="monospaced">focus-ringed</code>, <code className="monospaced">data-column</code> and <code
        className="monospaced">aria-label</code> are for the later parts: part 6 moves the columns, part 7 sorts
        them and part 8 resizes them.</PieceNote>
    </Piece>
    <Piece>
      <PieceCode><InkedLines label="HTML" lines={[
        ...carve.between(frameTable, '<tbody class="body">', '<td class'),
        lines.aside('    <!-- … one for each measure -->'), lines.plain('</tr>'),
        lines.aside('<!-- … one row for each lookback -->'), lines.plain('</tbody>')
      ]}/></PieceCode>
      <PieceNote when="The page is written with zeros and dashes in the cells, and part 5 fills them in from the trades.">The body:
        one row for each lookback. Each row starts with a header cell of its own. <code
        className="monospaced">scope="row"</code> says it names every cell beside it, so the lookback is said with
        each number in the row. <code className="monospaced">hover-approached</code> tints the row under the pointer.
        The row header also holds the grip of part 6, and an <code className="monospaced">aria-label</code> that names
        the row.</PieceNote>
    </Piece>
  </AnnotatedListing>
};

const stylePieces = <AnnotatedListing heading="CSS · under each piece, what it means and when it changes">
  <Piece>
    <PieceCode><InkedLines label="CSS" lines={[
      ...carve.between(widthsSource, '.aggregations {', 'min-width: 75.3rem;'),
      lines.aside('    /* … wider on a touch screen */'), lines.plain('  }'),
      lines.aside('  /* … the column widths, below */'), lines.plain('}')
    ]}/></PieceCode>
    <PieceNote when="Never changes."><code className="monospaced">table-layout: fixed</code> tells the browser to take
      each column’s width from the header row and keep it. The columns then hold still while the numbers in them
      change. The table is never narrower than <code className="monospaced">min-width</code>. In a narrower space the
      section scrolls sideways.</PieceNote>
  </Piece>
  <Piece>
    <PieceCode><InkedLines label="CSS" lines={[
      ...carve.between(widthsSource, '.lookback { width', '.change { width'),
      lines.aside('/* … other shares on a touch screen */')
    ]}/></PieceCode>
    <PieceNote when="Never changes. In part 8, a width the trader sets replaces it.">The width each column opens at, as a share
      of the table. The widths are in the style sheet because a width is layout, and the HTML holds only the
      data.</PieceNote>
  </Piece>
  <Piece>
    <PieceCode><InkedLines label="CSS" lines={[
      ...carve.elided(carve.between(tableCss, '.fancy-table {', 'white-space: nowrap;'),
        'border-collapse', '&.apportioned', '/* … */'),
      lines.plain('  }'), lines.plain('}')
    ]}/></PieceCode>
    <PieceNote when="Never changes.">What a cell does with a number longer than its column: it keeps to one line and
      cuts the number short, with three dots where it was cut.</PieceNote>
  </Piece>
</AnnotatedListing>;

const workingCode: Record<World, readonly string[]> = {
  react: [dealSource, columnSource, widthsSource, tableCss].map(({path}) => path),
  vanilla: [frameTable, widthsSource, tableCss].map(({path}) => path)
};

const ListedCode: FC = () => {
  const {world} = useControls();
  return <>
    {markupPieces[world]}
    {stylePieces}
    <p className="paragraph"><strong className="bold">Script:</strong> the numbers are not read yet. Part 5 brings them
      in from the trades.</p>
    <WorkingCode paths={workingCode[world]}/>
  </>;
};

const StillStory: FC = () => {
  const {world} = useControls();
  return <Story titleId={livingStories.titleIdOf(livingStories.ids.still)} open
    can="The trader can read the market in a table"
    soThat="the shape is right before anything moves">
    <TheImplementation react="Aggregations" vanilla="Frame/frame.main.ts"/>
    <Tell>The shape comes from the design, in the element the clues pointed at: a few measures
      across a few lookbacks, numbers on two axes. That is what a table is for. I build it first as a still, from
      whatever trades the page holds: headers on both axes, and the
      reading order correct before a single interaction exists.</Tell>
    <Steps>
      <Step>
        <StepHeading title="Deal a real HTML table"/>
        <Words>
          <Want>The table is more than JavaScript holding numbers; it is an
            HTML <Mdn path="Web/HTML/Element/table">table</Mdn>: header cells that declare their
            scope, rows a reader and a screen reader both move through.</Want>
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
          <ListedCode/>
        </Reveal>
      </Step>
    </Steps>
  </Story>;
};

export const StillTableRecipe: FC = () =>
  <section aria-label="build the still table yourself" className="build-steps">
    <Stories><StillStory/></Stories>
  </section>;
