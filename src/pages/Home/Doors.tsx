import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@navigation';

type Door = {title: string; leadsTo: string; link: string; to: Paths};

const doors: Door[] = [{
  title: 'The Record',
  leadsTo: 'How each language came to its job, in three stories; then every moment in order, the three read together, ' +
    'and the pattern they follow, which HTML’s own design principles wrote down in 2007.',
  link: 'Read the Record',
  to: Paths.record
}, {
  title: 'Practice',
  leadsTo: 'How I organize each language in this site’s own code, with a tab for each, and the test that tells me a ' +
    'rule holds.',
  link: 'Read the Practice',
  to: Paths.practice
}, {
  title: 'The Demos',
  leadsTo: 'That practice at work on features built from this site’s code and explained beside it, from an accordion ' +
    'to a live table, simple to expert.',
  link: 'Open the Demos',
  to: Paths.demos
}];

export const Doors: FC = () =>
  <ul className="doors muted-rule-above">
    {doors.map(({title, leadsTo, link, to}) => <li key={title} className="door">
      <h2 className="sub-title bold">{title}</h2>
      <p className="paragraph muted-ink">{leadsTo}</p>
      <Link className="signpost bold" to={to}>{link}</Link>
    </li>)}
  </ul>;
