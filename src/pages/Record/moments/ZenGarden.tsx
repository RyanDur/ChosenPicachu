import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from './moments';

export const ZenGarden: FC = () =>
  <Moment of={moments.zenGarden}
    tells={<>Dave Shea published{' '}
      <a className="signpost" href="https://csszengarden.com/">one HTML document</a> and invited the world to
      restyle it. Hundreds of designs followed, and not one change to the markup: the same structure under any presentation.</>}>
    <p className="paragraph muted-ink hyphenated">The garden’s rules were the argument: here is one HTML document, and you may not
      touch it. Submit a stylesheet, only a stylesheet, and make the page yours. Shea made
      the first five designs himself in May 2003; hundreds followed, and designers, Hoffmann
      notes, used the garden{' '}
    <a className="signpost" href="https://thehistoryoftheweb.com/the-rise-of-css/">“to show their bosses and clients what CSS could do”</a>. After the
      wars’ table layouts and spacer GIFs, this was the moment CSS{' '}
    <a className="signpost" href="https://thehistoryoftheweb.com/the-rise-of-css/">“finally became trustworthy”</a>.</p>
    <p className="paragraph muted-ink hyphenated">The thesis had been sitting in Lie’s 1994 draft the whole time, as a two-line
      stylesheet that set nothing itself: reference the NYT’s sheet at 30% and Le Monde’s
      at 70%, and the presentation is{' '}
    <a className="signpost" href="https://www.w3.org/People/howcome/p/cascade.html">“a mix”</a>. Swap the sheet, keep the document. The garden was that
      example, industrialized, running on doctype-switched standards mode and on CSS3’s
      module system, begun in 1999 so the language could advance a piece at a time instead of as{' '}
    <a className="signpost" href="https://www.w3.org/TR/css-2023/">“a single monolithic specification”</a>.</p>
    <p className="paragraph muted-ink hyphenated">What it proved was the settlement’s upside. Separation had been argued as hygiene:
      maintainability, sharing, adaptation. The garden showed the other side: hold the
      structure constant and the design can be replaced any number of times without a change to the markup.</p>
  </Moment>;
