import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {ConcernSection} from './ConcernSection';

export const Dynamic: FC = () =>
  <ConcernSection concern="Dynamic">
    <Quotation voice="paragraph" source={<a className="signpost"
      href="https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">Brendan
      Eich, in Computerworld’s A-Z of Programming Languages</a>}>
      With a scripting language like JS that could touch elements of the page, change
      their properties, and respond to events, we envisioned a much livelier Web
      consisting of pages that acted more like applications.
    </Quotation>
    <p className="paragraph">JavaScript says how things respond. Brendan Eich wrote its first interpreter in about ten
      days to touch a page the server had already sent; the page then became the program, and the cost came with the
      growth, until the document came first again with script only where a region must respond. So the document comes
      first and the program only where the page needs one. Inside the program, the state is what is true, an event is
      what happened, and the page is drawn from the two, so a framework can change under it and the core stays.</p>
  </ConcernSection>;
