import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {ConcernSection} from './ConcernSection';

export const Structure: FC = () =>
  <ConcernSection concern="Structure">
    <Quotation voice="paragraph" source={<a className="signpost" href="https://html.com/html5/">html.com, on HTML</a>}>
      It is not a programming language, but rather a language that identifies the meaning,
      purpose, and structure of text within a document.
    </Quotation>
    <p className="paragraph">HTML says what each thing on the page is: a heading, a list, a button, a form. Berners-Lee
      borrowed its grammar and invented one tag, the anchor, and the browsers added the rest, written down only after it
      was in use. The standard followed the pages, left them for XML in 1998, and came back to them with HTML5, whose
      objectives, as html.com summarizes them, put semantic markup first. So the rule is to choose the element that
      means what the content is, and add the look and the behaviour on top of it. The element brings its meaning and its
      behaviour with it, and a reader’s tools read the meaning before anything else arrives.</p>
  </ConcernSection>;
