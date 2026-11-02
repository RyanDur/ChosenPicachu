import {FC} from 'react';
import {Link} from 'react-router';
import {Moment} from './Moment';
import {moments} from './moments';
import {presentation} from '../sources/presentation';

const {sassVariables, usingCssCustomProperties, wathan, tailwindTheme} = presentation;

export const ConstantsNeedHome: FC = () =>
  <Moment of={moments.constantsNeedHome}
    tells={<>A design’s constants, its colors, sizes and fonts, had lived outside the style sheet for a decade, in a preprocessor’s variables and then a framework’s configuration, because CSS had no way to name a value once. In 2017 it did, and the same year the case for utilities was made from the other side.</>}>
    <p className="paragraph muted-ink hyphenated">Sass had given authors a variable since 2006: in its documentation’s words, <a className="signpost" href={sassVariables.address}>“you assign a value to a name that begins with $, and then you can refer to that name instead of the value itself”</a>, and a build wrote the value into every rule that used it. The constants lived in a file the browser never saw.</p>
    <p className="paragraph muted-ink hyphenated">Custom properties put them in the style sheet. MDN defines them as <a className="signpost" href={usingCssCustomProperties.address}>“entities defined by CSS authors that represent specific values to be reused throughout a document”</a>, and they have been in every engine since April 2017. A value named once on the root is read by every rule that asks for it, and a change to the name changes the page with no build. <Link className="signpost" to={`#${moments.someoneNeedsComponents.id}`}>The 2013 moment</Link> tells how the theme variables that script had held went the same way.</p>
    <p className="paragraph muted-ink hyphenated">The same year Adam Wathan’s essay <a className="signpost" href={wathan.address}>CSS Utility Classes and “Separation of Concerns”</a> made the case for the other half of the answer: a fixed set of single-purpose classes drawn from one theme, so that every value on a page comes from a constrained set. Tailwind built it, with its constants in a configuration file: its documentation says the theme section <a className="signpost" href={tailwindTheme.address}>“is where you define your project’s color palette, type scale, fonts, breakpoints, border radius values, and more”</a>. This site takes the constrained set and keeps the constants where custom properties put them, in the style sheet; the Practice page’s Presentation tab says what it keeps from Tailwind and what it gives up.</p>
  </Moment>;
