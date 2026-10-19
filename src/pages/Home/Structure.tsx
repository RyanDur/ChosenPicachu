import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {ConcernSection} from './ConcernSection';

export const Structure: FC = () =>
  <ConcernSection concern="Structure">
    <Quotation voice="paragraph" source={<a className="signpost" href="https://html.com/html5/">html.com, on HTML</a>}>
      It is not a programming language, but rather a language that identifies the meaning,
      purpose, and structure of text within a document.
    </Quotation>
    <p className="paragraph">HTML says what each thing on the page is: a heading, a list, a button, a form. Berners-Lee borrowed its grammar and invented one tag, the anchor, and the browsers added the rest, written down only after it was in use. The standard has followed the pages ever since, and HTML5 put semantic markup first. So the rule is to choose the element that means what the content is, and add the look and the behaviour on top of it. The element brings its meaning and its behaviour with it, and a reader’s tools read the meaning before anything else arrives.</p>
    <p className="paragraph"><Link className="signpost" to={`${Paths.record}#structure`}>Its story is on the record.</Link></p>
    <p className="paragraph"><Link className="signpost" to={`${Paths.practice}?tab=structure`}>How I organize it is on Practice.</Link></p>
  </ConcernSection>;
