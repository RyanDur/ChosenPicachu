import {FC} from 'react';

const stations: [string, string][] = [
  ['fetch', 'the last thousand trades, once, at open'],
  ['socket', 'every trade after that, kept under a cap'],
  ['fold', 'the same trades refolded into windows on every pass'],
  ['table', 'one cell per measure per window']
];

export const DataPath: FC = () =>
  <figure className="data-path white rounded-corners drop-shadow">
    <figcaption className="reel-heading">
      <span className="reel-title uppercase">where a number comes from</span>
    </figcaption>
    <ol className="data-path-stations">
      {stations.map(([name, does]) =>
        <li className="data-path-station paper rounded-corners" key={name}>
          <strong className="data-path-name">{name}</strong>
          <p className="data-path-does">{does}</p>
        </li>)}
    </ol>
    <p className="reel-note paragraph">Drawn, not recorded: nothing here happens in time, so a
      clip of ticking numbers would show less than the diagram does.</p>
  </figure>;
