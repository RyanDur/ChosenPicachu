import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {FromTheRecord} from './FromTheRecord';
import {ConcernSection} from './ConcernSection';

export const Dynamic: FC = () =>
  <ConcernSection concern="Dynamic">
    <Quotation voice="paragraph" source={<a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">Brendan Eich, in Computerworld’s A-Z of Programming Languages</a>}>
      With a scripting language like JS that could touch elements of the page, change
      their properties, and respond to events, we envisioned a much livelier Web
      consisting of pages that acted more like applications.
    </Quotation>
    <div className="concern-essay">
      <p className="paragraph">JavaScript says how things respond. It was not in the 1989 proposal. Brendan Eich wrote the interpreter at Netscape in May 1995 so a page could, in his words above, <a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">“touch elements of the page, change their properties, and respond to events”</a>. In 2005 Ajax let a page fetch data and rewrite itself without reloading, and the page became an application. From 2010 each framework moved more of the page into script, and in 2013 React said a component is a description of what the DOM should look like, redrawn from data that changes over time. In 2016 the server rendered first again and the script arrived second.</p>
      <p className="paragraph">I take one rule from that thread. The state is what is true right now, an event is what just happened, and the page is drawn from the two, so a framework can change under it and the core stays.</p>
    </div>
    <FromTheRecord/>
  </ConcernSection>;
