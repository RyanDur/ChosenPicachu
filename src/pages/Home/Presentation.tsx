import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {ConcernSection} from './ConcernSection';

export const Presentation: FC = () =>
  <ConcernSection concern="Presentation">
    <Quotation voice="paragraph" source={<a className="signpost" href="https://web.archive.org/web/20141221170539/https://www.w3.org/standards/webdesign/htmlcss.html">the W3C, on HTML and CSS</a>}>
      The separation of HTML from CSS makes it easier to maintain sites, share style
      sheets across pages, and tailor pages to different environments.
    </Quotation>
    <p className="paragraph">CSS says how things look. Authors asked for the look in 1994 and the browsers answered with tags; Håkon Wium Lie and Bert Bos answered with a sheet and a cascade, in which the author’s wishes, the reader’s and the browser’s combine, and the browsers took a decade of tests to render it alike. So a look belongs in the sheet, named for what the element needs, and nothing in the HTML says how it looks. When the sheet cannot say it yet, the workaround stays beside the rule and goes when the platform catches up.</p>
    <p className="paragraph"><Link className="signpost" to={`${Paths.record}#presentation`}>Its story is on the record.</Link></p>
    <p className="paragraph"><Link className="signpost" to={`${Paths.practice}?tab=presentation`}>How I organize it is on Practice.</Link></p>
  </ConcernSection>;
