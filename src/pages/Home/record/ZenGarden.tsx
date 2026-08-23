import {FC} from 'react';
import {Moment} from './Moment';

export const ZenGarden: FC = () =>
  <Moment year="2003"
          title="The separation needs proof"
          tells={<>Dave Shea published{' '}
            <a className="signpost" href="http://csszengarden.com/">one HTML document</a> and invited the world to
            restyle it. Hundreds of designs, not one change to the markup: the same structure, any
            presentation, separation as art.</>}>
            <p className="paragraph">The garden’s rules were the argument: here is one HTML document, and you may not
    touch it. Submit a stylesheet, only a stylesheet, and make the page yours. Shea made
    the first five designs himself in May 2003; hundreds followed, and designers, Hoffmann
    notes, used the garden{' '}
    <a className="signpost" href="https://thehistoryoftheweb.com/the-rise-of-css/">“to show their bosses and clients what CSS could do”</a>. After the
    wars’ table layouts and spacer GIFs, this was the moment CSS{' '}
    <a className="signpost" href="https://thehistoryoftheweb.com/the-rise-of-css/">“finally became trustworthy”</a>.</p>
    <p className="paragraph">The thesis had been sitting in Lie’s 1994 draft the whole time, as a two-line
    stylesheet that set nothing itself: reference the NYT’s sheet at 30% and Le Monde’s
    at 70%, and the presentation is{' '}
    <a className="signpost" href="https://www.w3.org/People/howcome/p/cascade.html">“a mix”</a>. Swap the sheet, keep the document. The garden was that
    example, industrialized, running on doctype-switched standards mode and on CSS3’s
    module system, begun in 1999 so the language could advance a piece at a time.</p>
    <p className="paragraph">What it proved was the settlement’s upside. Separation had been argued as hygiene:
    maintainability, sharing, adaptation. The garden demonstrated it as power. Structure
    held constant is not a constraint on design; it is what makes unlimited redesign
    possible.</p>
  </Moment>;
