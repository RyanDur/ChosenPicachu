import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {ConcernSection} from './ConcernSection';

export const Behavior: FC = () =>
  <ConcernSection concern="Behavior">
    <Quotation voice="paragraph" source={<a className="signpost"
      href="https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">Brendan
      Eich, in Computerworld’s A-Z of Programming Languages</a>}>
      With a scripting language like JS that could touch elements of the page, change
      their properties, and respond to events, we envisioned a much livelier Web
      consisting of pages that acted more like applications.
    </Quotation>
    <p className="paragraph">JavaScript says how things respond, the job Brendan Eich built it for. It does what no
      element and no rule in the sheet can do on its own: sort a table by the column a reader picks, let a reader drag
      rows into a new order, draw a chart from prices that arrive while the page is open. It can also fetch new
      information and put it into the page without loading a new one, the way suggestions appear under a search box as
      someone types. Some of what script once had to do, the other two now do: a details element opens and shuts a
      fold, a popover closes itself when the reader presses Escape, and the sheet slides a menu into view.</p>
    <p className="paragraph">JavaScript handles anything that changes while the page is open, and that includes the
      other two languages. It can create and remove HTML elements, and add, change and remove CSS. What it makes still
      does the same jobs. A button a script renders is still a button element, with the keys and the role that come
      with it, and its look still comes from the sheet. The popular frameworks are built to keep that in view. Vue calls
      its components{' '}
    <a className="signpost" href="https://vuejs.org/guide/scaling-up/sfc">“a natural extension of the classic trio of
      HTML, CSS and JavaScript”</a>, with the markup, the script and the styles in blocks of their own. Svelte and
      Angular divide a component the same way, and React’s JSX writes the page as elements. They keep the three side by
      side in one component rather than in three files, but each part is still written in its own language, where the
      browser does the work. None of them chooses the element; that is still the developer’s call. When script writes
      the page, each job stays where it belongs. What changes is where and when the HTML is made.</p>
    <p className="paragraph">That has moved over the web’s history. For most of it, a server sent each page as an HTML
      document, and the browser drew it and handled moving between pages: a link took the reader to the top of the next
      page, put focus at its start, kept their place for the back button, and had a screen reader announce where they
      were. From around 2010, the single-page application made the page in the browser, in script, and changed between
      pages without a new load. Since 2016, many sites have gone back to making the HTML on the server, sending it
      first and adding script where the page responds.</p>
    <p className="paragraph">Each way gives some things for free and asks for work on others. A page the server sends
      can be read before any script runs, and the browser handles scrolling, focus and the back button. It needs a
      server, or a build step that renders each page ahead of time. A single-page application can be served as plain
      files, keeps its state as the reader moves around, and changes pages without a reload. The browser’s jobs between
      pages then become the app’s: done by hand, or designed around. This site is one, and it also renders each page
      ahead of time when it is built, so the page is there before any script runs. GitHub Pages serves it as plain
      files, and it talks to GitHub’s APIs and the browser directly. Knowing what HTML, CSS and the browser already do
      is what makes the trade visible: which jobs come free, which take work, and which are worth leaning into.</p>
  </ConcernSection>;
