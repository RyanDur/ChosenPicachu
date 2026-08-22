import {FC, ReactNode} from 'react';
import {stationId} from './station';

type CluesProps = {
  quote: string;
  by: string;
  clues: [string, string][];
  verdict: ReactNode;
};

export const Clues: FC<CluesProps> = ({quote, by, clues, verdict}) => <>
  <section className="phase white rounded-corners drop-shadow" aria-label="the need">
    <h3 className="phase-title">Start with the need, and let it inform the implementation</h3>
    <p className="overview paragraph">
      Before any code, and before any story, someone needs something. Listen for clues, name
      each one, and the element chooses itself.
    </p>
    <figure className="feedback">
      <blockquote className="quote paragraph italic">{quote}</blockquote>
      <figcaption className="attribution">{by}</figcaption>
    </figure>
    <table className="tutorial-table">
      <thead>
        <tr>
          <th scope="col">the clue</th>
          <th scope="col">what it tells you</th>
        </tr>
      </thead>
      <tbody>
        {clues.map(([clue, tells]) =>
          <tr key={clue}>
            <th scope="row" className="clue">“{clue}”</th>
            <td className="tells">{tells}</td>
          </tr>)}
      </tbody>
    </table>
  </section>
  <p className="verdict paragraph">{verdict}</p>
</>;

type DesignProps = {
  sketch: ReactNode;
  answers: string;
  unanswered: string[];
};

export const Design: FC<DesignProps> = ({sketch, answers, unanswered}) =>
  <section className="phase white rounded-corners drop-shadow" aria-label="the design">
    <h3 className="phase-title">Cultivate a design from the need</h3>
    <p className="overview paragraph">
      The need has a visual answer, so the next artifact is a design: enough shape to argue
      with, before any code. What the sketch cannot answer goes back to the people asking, as
      questions, not guesses.
    </p>
    <figure className="design-still paper rounded-corners">
      <div className="design-sketch" aria-hidden="true">{sketch}</div>
      <figcaption className="reel-note paragraph">{answers}</figcaption>
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

type SlicesProps = {
  who: string;
  can: string;
  soThat: string;
  slices: ReactNode;
  sliced: [string, number][];
};

export const Slices: FC<SlicesProps> = ({who, can, soThat, slices, sliced}) =>
  <section className="phase white rounded-corners drop-shadow" aria-label="the stories">
    <h3 className="phase-title">Generate the stories from the design</h3>
    <p className="overview paragraph">
      With the need heard and the design answering shape, the work splits into stories: each
      one told as a <a className="signpost"
        href="https://initialcapacity.io/insights/user-story"
        target="_blank"
        rel="noreferrer">user story</a>, a discrete piece of value from the {who}’s side of
      the screen, and a promise of a conversation rather than a specification. The whole of it
      reads as one:
    </p>
    <hgroup className="story arriving white rounded-corners drop-shadow">
      <h4 className="can">{can}</h4>
      <p className="so-that">{soThat}</p>
    </hgroup>
    <p className="overview paragraph">{slices}</p>
    <ul className="sliced" aria-label="the slices">
      {sliced.map(([slice, station]) =>
        <li className="slice" key={slice}>
          <span className="slice-name">{slice}</span>
          <a className="slice-station signpost caption" href={`#${stationId(station)}`}>station {station}</a>
        </li>)}
    </ul>
  </section>;
