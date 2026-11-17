import {FC} from 'react';
import {Link} from 'react-router';

export type Part = {
  title: string;
  to: string;
  says: string;
  reading: string;
};

export const Parts: FC<{labelledBy: string; parts: readonly Part[]}> = ({labelledBy, parts}) =>
  <ol aria-labelledby={labelledBy}>
    {parts.map(({title, to, says, reading}) =>
      <li key={to}>
        <Link className="signpost" to={to}>{title}</Link>
        <p className="paragraph">{says}</p>
        <p className="caption muted-ink">{reading}</p>
      </li>)}
  </ol>;
