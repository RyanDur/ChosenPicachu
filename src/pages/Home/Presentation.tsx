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
    <p className="paragraph">CSS says how things look. A look belongs in the sheet, named for what the element needs, so
      it is written once and one change reaches every page that wears it, where a style written inline or set from
      script is found only where it was set. The sheet is also where the author’s wishes, the reader’s and the browser’s
      combine, which no inline style offers. Motion belongs in the sheet too: <a className="signpost"
      href="https://web.dev/articles/animations-overview">a browser can animate transform and opacity cheaply</a>, in
      many cases on its compositor thread rather than the one the script runs on, so a transition the sheet owns can
      keep going while the script is busy, where a script that moves things itself shares that busy thread. Script names
      a state and the sheet says how the state looks. When the sheet cannot yet say a look, the workaround stays beside
      the rule and goes when the platform catches up. So the rule is that a look belongs in the sheet, and nothing in
      the HTML says how it looks.</p>
  </ConcernSection>;
