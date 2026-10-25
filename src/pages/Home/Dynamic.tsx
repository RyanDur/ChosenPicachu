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
    <p className="paragraph">JavaScript says how things respond. Script adds what the elements lack: a behaviour no
      element has yet, which is what Eich built it for, and a request that brings new information into the page without
      a new page, which Ajax named in 2005. The costs arrive when the script becomes the whole page: a blank first paint
      until it runs, a document no crawler or screen reader can read, a back button rebuilt by hand. So the document
      comes first, and a program runs only where a part of the page must respond. Inside that program the state is what
      is true, an event is what happened, and the page is drawn from the two, so a framework can change under it and the
      core stays.</p>
  </ConcernSection>;
