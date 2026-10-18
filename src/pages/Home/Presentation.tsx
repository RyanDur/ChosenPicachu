import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {FromTheRecord} from './FromTheRecord';
import {ConcernSection} from './ConcernSection';

export const Presentation: FC = () =>
  <ConcernSection concern="Presentation">
    <Quotation voice="paragraph" source={<a className="signpost" href="https://web.archive.org/web/20141221170539/https://www.w3.org/standards/webdesign/htmlcss.html">the W3C, on HTML and CSS</a>}>
      The separation of HTML from CSS makes it easier to maintain sites, share style
      sheets across pages, and tailor pages to different environments.
    </Quotation>
    <div className="concern-essay">
      <p className="paragraph">CSS says how things look. The need was an author’s: to set the look of a page without writing it into the structure. In October 1994 Håkon Wium Lie drafted Cascading HTML Style Sheets for that, encouraged by Dave Raggett, who had realized HTML should never become a page-description language. The browsers answered the same need with a font tag and tables for layout, and then took a decade to render the standard to the pixel, pushed by tests and failures named in public. In 2003 Dave Shea’s CSS Zen Garden showed what the separation buys: one document in many designs, by sheets alone. In 2013 components arrived in script, and Christopher Chedeau’s talk listed seven problems with CSS at that scale, isolation last.</p>
      <p className="paragraph">I take a rule from that too. A look belongs in the sheet, named for what the element needs, and nothing in the HTML says how it looks.</p>
    </div>
    <FromTheRecord/>
  </ConcernSection>;
