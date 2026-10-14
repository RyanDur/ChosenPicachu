import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from './moments';

export const WiredRedesign: FC = () =>
  <Moment of={moments.wiredRedesign}
    tells={<>On 11 October 2002 Wired News relaunched on XHTML and CSS with no tables for layout. Douglas Bowman designed it.
      A large daily publisher had bet its pages on the standards, and the bet held. Seven months later the Zen Garden
      made the same point as art.</>}>
    <p className="paragraph muted-ink hyphenated">Eric Meyer wrote it up the day it launched: Wired News <a className="signpost" href="https://meyerweb.com/eric/thoughts/2002/10/11/wired-with-standards/">“has redesigned their site, and not just the front end, either”</a>, <a className="signpost" href="https://meyerweb.com/eric/thoughts/2002/10/11/wired-with-standards/">“Using no tables to lay out the page, but instead applying CSS to XHTML”</a>.
      XHTML is HTML written to XML’s stricter rules, the form the standards bodies favoured at the time. Meyer’s
      longer piece for Netscape’s developer site states the method: <a className="signpost" href="https://meyerweb.com/eric/projects/ndept/home.html">“The design is based on XHTML 1.0 and no tables”</a>,
      and <a className="signpost" href="https://meyerweb.com/eric/projects/ndept/home.html">“All of the layout and appearance is driven by a small collection of CSS files”</a>.</p>
    <p className="paragraph muted-ink hyphenated">Layout had belonged to tables since the browser wars, because tables rendered the same everywhere and CSS did
      not. Bowman, <a className="signpost" href="https://meyerweb.com/eric/thoughts/2002/10/11/wired-with-standards/">“the point man on the Wired redesign”</a> in
      Meyer’s words, moved a daily news site off them. Ten years on he called it the moment that <a className="signpost" href="https://stopdesign.com/archive/2012/10/11/ten-years-later.html">“marked the first time a large, well-known, daily-content publisher had dropped tables for layout”</a>.
      Meyer’s verdict at the time: <a className="signpost" href="https://meyerweb.com/eric/thoughts/2002/10/11/wired-with-standards/">“the site is a stunning example of how standards can be made to work today”</a>.</p>
    <p className="paragraph muted-ink hyphenated">Wired showed a business could ship on CSS; the Zen Garden, in May 2003, showed what
      the separation was for.</p>
  </Moment>;
