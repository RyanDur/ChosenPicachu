import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {FromTheRecord} from './FromTheRecord';
import {HowIOrganizeIt} from './HowIOrganizeIt';
import {StructurePractice} from '@pages/Development/StructurePractice';
import {ConcernSection} from './ConcernSection';

export const Structure: FC = () =>
  <ConcernSection concern="Structure">
    <Quotation voice="paragraph" source={<a className="signpost" href="https://html.com/html5/">html.com, on HTML</a>}>
      It is not a programming language, but rather a language that identifies the meaning,
      purpose, and structure of text within a document.
    </Quotation>
    <p className="paragraph">
      HTML says what each thing on the page is: a heading, a list, a button, a form. Choose the element that means
      what the content is, and add the look and the behaviour on top of it.
    </p>
    <FromTheRecord/>
    <HowIOrganizeIt><StructurePractice/></HowIOrganizeIt>
  </ConcernSection>;
