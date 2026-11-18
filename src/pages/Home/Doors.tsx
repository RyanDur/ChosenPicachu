import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@navigation';

type Door = {heading: string; leadsTo: string; invitation: string; to: Paths};

const doors: Door[] = [{
  heading: 'The Record',
  leadsTo: 'How each language came to its job, in three stories; then every moment in order, the three read together, ' +
    'and the pattern they follow, which HTML’s own design principles wrote down in 2007.',
  invitation: 'Read the Record',
  to: Paths.record
}, {
  heading: 'Practice',
  leadsTo: 'How I organize each language in this site’s own code, with a tab for each, and the test that tells me a ' +
    'rule holds.',
  invitation: 'Read the Practice',
  to: Paths.practice
}, {
  heading: 'The Demos',
  leadsTo: 'That practice at work on features built from this site’s code and explained beside it, from an accordion ' +
    'to a live table, simple to expert.',
  invitation: 'Open the Demos',
  to: Paths.demos
}];

export const Doors: FC = () =>
  <ul className="doors muted-rule-above">
    {doors.map(({heading, leadsTo, invitation, to}) => <li key={heading} className="door">
      <h2 className="sub-title bold">{heading}</h2>
      <p className="paragraph muted-ink">{leadsTo}</p>
      <Link className="signpost bold" to={to}>{invitation}</Link>
    </li>)}
  </ul>;
