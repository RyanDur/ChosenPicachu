import {FC} from 'react';
import {Design} from '../../Recipe';

const measures = ['trades', 'buys', 'sells', 'volume', 'vwap', 'change'];
const lookbacks = ['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session'];

const unanswered = [
  'What “matters most” means to a trader: largest, newest, or most volatile.',
  'Whether an arrangement should outlive the session.',
  'What happens when a number changes while it is being read.',
  'Which measures are worth ranking at all.'
];

const Sketch: FC = () =>
  <table className="design-table">
    <thead>
      <tr>
        <th className="design-measure drawn-caption bold" scope="col">lookback</th>
        {measures.map(measure =>
          <th className="design-measure design-column drawn-caption bold" scope="col" key={measure}><span
            className="design-name">{measure}</span></th>)}
      </tr>
    </thead>
    <tbody>
      {lookbacks.map(lookback =>
        <tr key={lookback}>
          <th className="design-lookback drawn-caption muted-ink" scope="row">{lookback}</th>
          {measures.map(measure => <td className="design-cell design-column hairline-edged" key={measure}/>)}
        </tr>)}
    </tbody>
  </table>;

export const DesignAsk: FC = () =>
  <Design sketch={<Sketch/>}
    answers="The design answers shape: which measures, which lookbacks, how much precision, how dense."
    unanswered={unanswered}/>;
