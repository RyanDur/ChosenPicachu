import {FC} from 'react';
import {Codes, Mdn, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import tableSource from '../Frame/table.html?raw';
import widthsSource from '@pages/Demos/Tables/Aggregations/Aggregations.css?raw';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

const dealtStory =
  <Story param="dealt" id="dealt"
         can="The trader can read the market in windows"
         soThat="every measure has a seat before a single trade arrives">
    <Tell>What the trader reads is a few measures across a few time windows: numbers
      on two axes. That is not a chart and not a feed; that is what a table is for. So
      the table comes first: a real HTML one, semantics for free, written by hand.</Tell>
    <Tell>The trades come later: first a fetch for the recent past, then a socket for the
      rest, each its own card as this world earns it. Today the table stands.</Tell>
    <Steps>
      <Step title="Deal a real HTML table">
        <Words want={<>The table is more than JavaScript holding numbers; it is an
          HTML <Mdn path="Web/HTML/Element/table">table</Mdn>: header cells that declare their
          scope, rows a reader and a screen reader both walk.</>}>
          <Says>The columns are declared once, each a header cell with a name and a class; how
            wide they open is CSS. We could let the browser size the columns by their content,
            but a live table would breathe: every new number re-negotiates the layout. And we
            could carry widths in the markup, but they are layout, not content. So the page’s
            stylesheet deals the opening widths, and
            with <Mdn path="Web/CSS/table-layout">table-layout</Mdn>: fixed, the header widths
            govern their whole columns: the table always fills its container, and the columns
            hold still while the values change.</Says>
          <Says>The markup is the platform’s own.
            A <Mdn path="Web/HTML/Element/thead">thead</Mdn> of th headers, one per column, each
            announcing <Mdn path="Web/HTML/Element/th#scope">scope="col"</Mdn>: that one attribute
            is how a screen reader knows to say the column’s name with every cell below it.
            A <Mdn path="Web/HTML/Element/tbody">tbody</Mdn> of rows; each row leads with a th of
            its own, announcing <Mdn path="Web/HTML/Element/th#scope">scope="row"</Mdn> so the
            window’s name travels with every cell beside it, then a td per measure.</Says>
          <Says>We could build this out of divs and grid, and it would look identical. But the table
            element carries behavior we would otherwise owe: readers walk it row by row and cell by
            cell, headers belong to their columns, and everything later, the sorting announcements,
            the drags, the keyboard, hangs off these roles instead of reinventing them. This is the
            first rule of <Mdn path="Web/Accessibility/ARIA">ARIA</Mdn>: prefer the native element,
            and accessibility stops being work you add and becomes behavior you inherit.</Says>
        </Words>
        <Codes>
          <Snippet label="HTML" lines={[
            ...span(tableSource, '<thead class="header">', '</thead>'), gap,
            ...span(tableSource, '<tbody class="body">', '</tr>')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(widthsSource, '.aggregations {')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

export const HtmlTableRecipe: FC = () =>
  <section aria-label="the dealt table" className="build-steps">
    <Stories>{dealtStory}</Stories>
  </section>;
