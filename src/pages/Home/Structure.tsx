import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {ConcernSection} from './ConcernSection';

export const Structure: FC = () =>
  <ConcernSection concern="Structure">
    <Quotation voice="paragraph" source={<a className="signpost" href="https://html.com/html5/">html.com, on HTML</a>}>
      It is not a programming language, but rather a language that identifies the meaning,
      purpose, and structure of text within a document.
    </Quotation>
    <p className="paragraph">HTML says what each thing on the page is: a heading, a list, a button, a form. Choose the
      element that means the content and its behavior comes with it: a button presses from the keyboard, a details
      opens and shuts, and a screen reader is told the role and the state, before any script arrives. The same markup
      tells the next person what the page is, and a search engine, a reader mode and a screen reader read the meaning
      first. Build a button from a div and script instead, and the keyboard, the focus and the role each have to be
      added back by hand, and until they are, a screen reader finds no button there, only text. So the rule is to
      choose the element that means what the content is, and add the look and the behavior on top of it.</p>
  </ConcernSection>;
