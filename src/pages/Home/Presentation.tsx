import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {ConcernSection} from './ConcernSection';

export const Presentation: FC = () =>
  <ConcernSection concern="Presentation">
    <Quotation voice="paragraph" source={<a className="signpost"
      href="https://web.archive.org/web/20141221170539/https://www.w3.org/standards/webdesign/htmlcss.html">the
      W3C, on HTML and CSS</a>}>
      The separation of HTML from CSS makes it easier to maintain sites, share style
      sheets across pages, and tailor pages to different environments.
    </Quotation>
    <p className="paragraph">CSS says how things look. Put a look in the sheet, under a name that says why it looks that
      way, and it is written once. Change the rule and every element with that name changes. An inline style, or one set
      from script, lives on the element it was set on, so the same look has to be written again for the next element.
      The sheet is also where three sources meet: the author’s styles, the user’s and the browser’s, and the cascade
      settles which applies.</p>
    <p className="paragraph">Motion belongs in the sheet too. <a className="signpost"
      href="https://web.dev/articles/animations-overview">A browser can animate transform and opacity cheaply</a>, in
      many cases on its compositor thread rather than the one the script runs on. So a transition the sheet owns can
      keep going while the script is busy, and a script that moves things frame by frame cannot. Script names the
      state, and the sheet says how the state looks. When the sheet cannot yet say a look, the workaround sits beside
      the rule it stands in for, and goes when the platform catches up. So the rule is that a look belongs in the sheet,
      and the HTML never says how anything looks.</p>
  </ConcernSection>;
