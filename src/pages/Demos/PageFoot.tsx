import {FC} from 'react';
import {Link} from 'react-router';
import {Maybe} from '@ryandur/sand';
import './PageFoot.css';

type Neighbor = {numbered: string; address: string};

type Props = {
  label: string;
  previous: Maybe<Neighbor>;
  next: Maybe<Neighbor>;
};

export const PageFoot: FC<Props> = ({label, previous, next}) =>
  <nav className="page-foot" aria-label={label}>
    {previous.map(({numbered, address}) =>
      <Link key={address} className="reachable signpost" rel="prev" to={address}>{`Previous: ${numbered}`}</Link>).orNull()}
    {next.map(({numbered, address}) =>
      <Link key={address} className="onward reachable signpost" rel="next" to={address}>{`Next: ${numbered}`}</Link>).orNull()}
  </nav>;
