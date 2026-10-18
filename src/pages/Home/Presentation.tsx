import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {FromTheRecord} from './FromTheRecord';
import {HowIOrganizeIt} from './HowIOrganizeIt';
import {PresentationPractice} from '@pages/Development/PresentationPractice';
import {ConcernSection} from './ConcernSection';

export const Presentation: FC = () =>
  <ConcernSection concern="Presentation">
    <Quotation voice="paragraph" source={<a className="signpost" href="https://web.archive.org/web/20141221170539/https://www.w3.org/standards/webdesign/htmlcss.html">the W3C, on HTML and CSS</a>}>
      The separation of HTML from CSS makes it easier to maintain sites, share style
      sheets across pages, and tailor pages to different environments.
    </Quotation>
    <p className="paragraph">
      CSS says how things look. Shared looks get shared class names, each component’s layout lives in its own sheet,
      and nothing is styled to say what the HTML already says.
    </p>
    <FromTheRecord/>
    <HowIOrganizeIt><PresentationPractice/></HowIOrganizeIt>
  </ConcernSection>;
