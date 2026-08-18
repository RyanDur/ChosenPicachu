import {FC} from 'react';

const measures = ['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change'];
const windows = ['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session'];

const unanswered = [
  'What “matters most” means to a trader: largest, newest, or most volatile.',
  'Whether an arrangement should outlive the session.',
  'What happens when a number changes while it is being read.',
  'Which measures are worth ranking at all.'
];

export const DesignAsk: FC = () =>
  <section className="phase white rounded-corners drop-shadow" aria-label="the design">
    <h3 className="phase-title">Cultivate a design from the need</h3>
    <p className="overview paragraph">
      The need has a visual answer, so the next artifact is a design: enough shape to argue
      with, before any code. What the sketch cannot answer goes back to the people asking, as
      questions, not guesses.
    </p>
    <figure className="design-still paper rounded-corners">
      <div className="design-sketch" aria-hidden="true">
        <div className="design-header">
          {measures.map(measure => <span className="design-measure" key={measure}>{measure}</span>)}
        </div>
        {windows.map(window =>
          <div className="design-row" key={window}>
            <span className="design-window">{window}</span>
            {measures.slice(1).map(measure => <span className="design-cell" key={measure}/>)}
          </div>)}
      </div>
      <figcaption className="reel-note paragraph">The design answers shape: which measures,
        which windows, how much precision, how dense.</figcaption>
    </figure>
    <aside className="unanswered paper rounded-corners" aria-label="what a design cannot tell you">
      <h4 className="unanswered-title uppercase">what a design cannot tell you</h4>
      <ul className="unanswered-list">
        {unanswered.map(question => <li className="unanswered-question" key={question}>{question}</li>)}
      </ul>
    </aside>
    <p className="overview paragraph">
      These are questions for the people asking for the feature. Ask them, and keep building
      on your best interpretation in the meantime: markup organized well is cheap to change
      when the answers arrive.
    </p>
  </section>;
