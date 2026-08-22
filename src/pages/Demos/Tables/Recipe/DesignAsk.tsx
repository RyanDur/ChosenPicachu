import {FC} from 'react';
import {Design} from '../../Recipe/Arc';

const measures = ['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change'];
const windows = ['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session'];

const unanswered = [
  'What “matters most” means to a trader: largest, newest, or most volatile.',
  'Whether an arrangement should outlive the session.',
  'What happens when a number changes while it is being read.',
  'Which measures are worth ranking at all.'
];

const sketch = <>
  <div className="design-header">
    {measures.map(measure => <span className="design-measure" key={measure}>{measure}</span>)}
  </div>
  {windows.map(window =>
    <div className="design-row" key={window}>
      <span className="design-window">{window}</span>
      {measures.slice(1).map(measure => <span className="design-cell" key={measure}/>)}
    </div>)}
</>;

export const DesignAsk: FC = () =>
  <Design sketch={sketch}
          answers="The design answers shape: which measures, which windows, how much precision, how dense."
          unanswered={unanswered}/>;
