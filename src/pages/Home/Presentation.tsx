import {FC} from 'react';
import {Link} from 'react-router';
import {Quotation} from '@components/Quotation';
import {DemoTopics, demoAddress} from '@pages/Demos/types';
import {ConcernSection} from './ConcernSection';

export const Presentation: FC = () =>
  <ConcernSection concern="Presentation">
    <Quotation voice="paragraph" source={<a className="signpost"
      href="https://web.archive.org/web/20141221170539/https://www.w3.org/standards/webdesign/htmlcss.html">the
      W3C, on HTML and CSS</a>}>
      The separation of HTML from CSS makes it easier to maintain sites, share style
      sheets across pages, and tailor pages to different environments.
    </Quotation>
    <p className="paragraph">CSS says how things look: color, type, spacing, layout, motion. Write a look once in a
      style sheet and apply it by name. Give a group of elements a class, write the look in one rule for that class, and
      every element with it takes the look. Change that rule, and they all change. A look written on the element itself,
      in the HTML or by a script, belongs to that element alone. It has to be written again for the next one, and changed
      everywhere it was written.</p>
    <p className="paragraph">The name is where HTML and the sheet meet, and every approach to CSS picks a side. Call a
      class <code>warning</code>, and the sheet can turn every warning orange without touching the HTML; the CSS Zen
      Garden restyled one document hundreds of times that way. Call it <code>text-red</code>, and it works on any
      element with no new CSS, but turning the warnings orange means changing the HTML; that is Tailwind’s side. Adam
      Wathan, who created Tailwind, describes the choice as which way the dependency runs, and BEM and Bootstrap each
      take a position of their own. I name classes for what things are and keep each language in its own file, but
      either way, the work goes somewhere.</p>
    <p className="paragraph">Motion belongs in the sheet too. A transition is the sheet’s way of moving from one look
      to the next: it says how long the change takes, and the browser draws the frames in between.{' '}
    <a className="signpost" href="https://web.dev/articles/animations-overview">A browser can animate transform and
      opacity cheaply</a>: it moves and fades what it has already drawn. In many cases it does that on a different
      thread from the one the script runs on. So a transition the sheet owns keeps going while the script is busy, and
      an animation a script runs frame by frame stops until the script is free. Script names the state and the sheet
      says how the state looks: script marks a menu as open, with a class or an attribute, and the sheet slides it into
      view.</p>
    <p className="paragraph">A transition needs to know where it ends. A fold that slides open ends at whatever height
      its content needs, and that height depends on the content and the width of the screen, so no number in the sheet
      can name it. For years the sheet had no way to animate to it, so a script measured the height, or the sheet
      guessed one too large. Now the sheet can do it alone, and{' '}
    <Link className="signpost" to={demoAddress(DemoTopics.accordions)}>the accordions</Link> show both ways. The sheet
      still can’t say every look, and where it can’t, a workaround fills in until it can. So the rule is that the look
      lives in the sheet, whichever way its class names point.</p>
  </ConcernSection>;
