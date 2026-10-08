import {FC} from 'react';
import {classNames} from '@components/class-names';

type Station = {name: string; does: string; ground: 'field' | 'faded-mint'};

const stations: readonly Station[] = [
  {name: 'fetch', does: 'the last thousand trades, once, at open', ground: 'field'},
  {name: 'socket', does: 'every trade after that, kept under a cap', ground: 'field'},
  {name: 'fold', does: 'the same trades refolded into windows on every pass', ground: 'faded-mint'},
  {name: 'table', does: 'one cell per measure per window', ground: 'field'}
];

export const DataPath: FC = () =>
  <figure className="data-path card rounded-corners lifted">
    <figcaption className="reel-heading">
      <span className="caption uppercase muted-ink">where a number comes from</span>
    </figcaption>
    <ol className="data-path-stations">
      {stations.map(({name, does, ground}) =>
        <li className={classNames('data-path-station', ground, 'rounded-corners')} key={name}>
          <strong>{name}</strong>
          <p className="data-path-does caption muted-ink">{does}</p>
        </li>)}
    </ol>
    <p className="reel-note caption muted-ink">Drawn, not recorded: nothing here happens in time, so a
      clip of ticking numbers would show less than the diagram does.</p>
  </figure>;
