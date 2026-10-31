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
    <p className="paragraph">HTML says what each thing on the page is: a heading, a list, a button, a form, a fold that
      opens and shuts. An element is more than a label, though. The browser gives each of them behavior, and so do the
      tools people read pages with. A button can be reached with the Tab key and pressed with Enter or Space, as well as
      clicked. A form sends when Enter is pressed in one of its fields, and refuses an empty required field in the
      browser’s own words. A fold built from{' '}
    <Link className="signpost" to={demoAddress(DemoTopics.accordions)}>a details element</Link> opens and shuts from
      the mouse or the keyboard, a job that took a script for years before the element arrived. A screen reader tells its user what each element is and what state it is in: a list
      and how many items it holds, a button and whether it is disabled, a fold and whether it is open. Its user can also
      jump from heading to heading. None of this needs a script, only the right element. Knowing which one is the hard
      part, and sometimes no element fits yet.</p>
    <p className="paragraph">The same markup is read by more than the browser. A screen reader reads it aloud for
      someone who can’t see the page. A browser’s reader view shows it as plain, resizable text for someone with low
      vision, or for anyone who reads better without the clutter. A search engine reads it to learn what the page is
      about, and the next developer reads it to see how the page is built. Each of them finds the content by its
      elements, not by how it looks.</p>
    <p className="paragraph">A button built from a div gets none of this, because a div has no meaning of its own: the
      browser gives it no behavior, and a screen reader has no role to announce. The role and a place in the Tab order
      each have to be added by hand, and the key presses with script. Until they are, a screen reader finds no button
      there, only text. So the rule is to choose the element that means what the content is, and add the look and the
      behavior on top of it.</p>
  </ConcernSection>;
