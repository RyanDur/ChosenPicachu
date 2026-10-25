import {FC} from 'react';
import {Link} from 'react-router';
import {Quotation} from '@components/Quotation';
import {DemoTopics, demoAddress} from '@pages/Demos/types';
import {ConcernSection} from './ConcernSection';

export const Structure: FC = () =>
  <ConcernSection concern="Structure">
    <Quotation voice="paragraph" source={<a className="signpost" href="https://html.com/html5/">html.com, on HTML</a>}>
      It is not a programming language, but rather a language that identifies the meaning,
      purpose, and structure of text within a document.
    </Quotation>
    <p className="paragraph">HTML says what each thing on the page is: a heading, a list, a button, a form. Choose the
      element that means the content and its behavior comes with it, before any script arrives: a button presses from
      the keyboard, <Link className="signpost" to={demoAddress(DemoTopics.accordions)}>a details
        element</Link> opens and shuts, and a screen reader is told the role and the state, that it is a button and whether
      it is pressed or open. The same markup tells the next developer what the page is, and a search engine and a reader
      mode read the meaning, not the look. Build a button from a div, the element that means nothing, and script
      instead, and the keyboard, the Tab stop and the role each have to be added back by hand. Until they are, a screen
      reader finds no button there, only text. So the rule is to choose the element that means what the content is, and
      add the look and the behavior on top of it.</p>
  </ConcernSection>;
