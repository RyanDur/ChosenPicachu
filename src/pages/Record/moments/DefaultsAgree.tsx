import {FC} from 'react';
import {Link} from 'react-router';
import {Moment} from './Moment';
import {moments} from '../calendar';
import {presentation} from '../sources';

const {resetReasoning, resetReloaded, resetCss, aboutNormalizeCss, normalizeTags} = presentation;

export const DefaultsAgree: FC = () =>
  <Moment heading={moments.headings.defaultsAgree}
    summary={<>Every browser shipped its own defaults for margins, line heights and headings, and no two agreed, so the
      same style sheet drew a different page in each. Authors answered with a reset, a style sheet that zeroed the
      defaults before their own began; the platform answered later, with tests of its own.</>}>
    <p className="paragraph muted-ink hyphenated">Eric Meyer gave the reason in April
      2007: <a className="signpost" href={resetReasoning.address}>“The basic reason is that all browsers have
        presentation defaults, but no browsers have the same defaults.”</a> His reset, published that May, zeroed every
      element’s margins, padding and borders and set its font size to its parent’s, so an author started from
      nothing. He did not mean it as the end of the style
      sheet: <a className="signpost" href={resetReloaded.address}>“Think of these as a starting point for creating
        your own defaults”</a>, and his page says the goal is <a className="signpost" href={resetCss.address}>“to
          reduce browser inconsistencies in things like default line heights, margins and font sizes of
          headings”</a>.</p>
    <p className="paragraph muted-ink hyphenated">Nicolas Gallagher saw a cost: a reset throws away the defaults worth
      keeping. His and Jonathan Neal’s normalize.css, whose version 1.0 is
      dated <a className="signpost" href={normalizeTags.address}>August 2012</a>, kept them: an alternative to a reset
      that would <a className="signpost" href={aboutNormalizeCss.address}>“preserve useful browser defaults rather
        than erasing them”</a> and fix only what differed between browsers.</p>
    <p className="paragraph muted-ink hyphenated">The browsers were tested against one another in the end, which
      is <Link className="signpost" to={`#${moments.headings.cssTwoOne.id}`}>the 2011 moment</Link>: more than nine thousand
      tests behind CSS 2.1, and the same style sheet drawing the same page. A reset is still the first file this
      site’s style sheets import. The site keeps it for the few defaults that still differ and the ones it wants
      gone.</p>
  </Moment>;
