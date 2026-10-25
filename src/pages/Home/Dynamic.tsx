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
    <p className="paragraph">JavaScript says how things respond. Script adds what the elements lack: a behavior no
      element has yet, which is what Brendan Eich built it for, and a request that brings new information into the page
      without loading a new one, which Jesse James Garrett named Ajax in 2005. The costs arrive when the script becomes
      the whole page. Until it runs, the first paint is blank and no crawler or screen reader has a document to read, and
      even after it runs, the back button has to be rebuilt by hand.</p>
    <p className="paragraph">Where a script does run, the state is what is true, an event is what happened, and the page
      is drawn from the two. Keep that core apart from the framework, and the framework can change around it while the
      core stays. So the rule is that the document comes first, and a script runs only where a part of the page must
      respond.</p>
  </ConcernSection>;
