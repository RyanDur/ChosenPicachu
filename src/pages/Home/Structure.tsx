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
      element that means the content and its behaviour comes with it: a button presses from the keyboard, a details
      opens and shuts, and a screen reader is told the role and the state, before any script arrives. The same markup
      tells the next person what the page is, and a search engine, a reader mode and a screen reader read the meaning
      first. Build those from other parts and script instead and each has to be written again, with varying success. On
      the accordions tab the checkbox trick shuts on a second press but lets every fold stay open, the radio trick keeps
      one open but cannot shut itself, and a screen reader calls each what it is made of, a checkbox or a radio. The
      details element does both and is read as a disclosure, collapsed or expanded. So the rule is to choose the element
      that means what the content is, and add the look and the behaviour on top of it.</p>
  </ConcernSection>;
