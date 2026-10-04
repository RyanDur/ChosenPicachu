import {FC} from 'react';
import {Design} from '../../Recipe/Arc';

const measures = ['trades', 'buys', 'sells', 'volume', 'vwap', 'change'];
const windows = ['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session'];

const unanswered = [
  'What “matters most” means to a trader: largest, newest, or most volatile.',
  'Whether an arrangement should outlive the session.',
  'What happens when a number changes while it is being read.',
  'Which measures are worth ranking at all.'
];

const sketch =
  <table className="design-table">
    <thead>
      <tr>
        <th className="design-measure drawn-caption bold" scope="col">window</th>
        {measures.map(measure =>
          <th className="design-measure design-column drawn-caption bold" scope="col" key={measure}><span
            className="design-name">{measure}</span></th>)}
      </tr>
    </thead>
    <tbody>
      {windows.map(window =>
        <tr key={window}>
          <th className="design-window drawn-caption muted-ink" scope="row">{window}</th>
          {measures.map(measure => <td className="design-cell design-column" key={measure}/>)}
        </tr>)}
    </tbody>
  </table>;

export const DesignAsk: FC = () =>
  <Design sketch={sketch}
    answers="The design answers shape: which measures, which windows, how much precision, how dense."
    unanswered={unanswered}/>;
