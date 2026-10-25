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
    <p className="paragraph">CSS says how things look. Put a look in the sheet, under a name that says what the element
      needs, and it is written once. Change the rule and every element with that name changes. An inline style, or one
      set from script, lives on the element it was set on, so the same look is written again for the next. The sheet is
      also where three sources meet, the author’s styles, the reader’s and the browser’s, and the cascade settles which
      applies. Motion belongs in the sheet too. <a className="signpost"
      href="https://web.dev/articles/animations-overview">A browser can animate transform and opacity cheaply</a>, in
      many cases on its compositor thread rather than the one the script runs on. So a transition the sheet owns can
      keep going while the script is busy, and a script that moves things frame by frame cannot. Script names the
      state, and the sheet says how the state looks. When the sheet cannot yet say a look, the workaround stays beside
      the rule and goes when the platform catches up. So the rule is that a look belongs in the sheet, and nothing in
      the HTML says how it looks.</p>
  </ConcernSection>;
