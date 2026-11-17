import {FC} from 'react';
import {Link} from 'react-router';
import {Maybe} from '@ryandur/sand';
import './PageFoot.css';

type Neighbor = {title: string; address: string};

type Props = {
  label: string;
  previous: Maybe<Neighbor>;
  next: Maybe<Neighbor>;
};

export const PageFoot: FC<Props> = ({label, previous, next}) =>
  <nav className="page-foot" aria-label={label}>
    {previous.map(({title, address}) =>
      <Link key={address} className="reachable signpost" rel="prev" to={address}>{`Previous: ${title}`}</Link>).orNull()}
    {next.map(({title, address}) =>
      <Link key={address} className="onward reachable signpost" rel="next" to={address}>{`Next: ${title}`}</Link>).orNull()}
  </nav>;
