import {FC, ReactNode} from 'react';
import {stationId} from './station';

type CluesProps = {
  quote: string;
  by: string;
  clues: [string, string][];
  verdict: ReactNode;
};

export const Clues: FC<CluesProps> = ({quote, by, clues, verdict}) => <>
  <section className="phase card rounded-corners lifted" aria-labelledby="phase-need">
    <h3 id="phase-need" className="phase-title title">Start with the need, and let it pick the element</h3>
    <p className="overview paragraph muted-ink">
      Before any code, and before any story, someone needs something. Listen for clues, name
      each one, and the element chooses itself.
    </p>
    <figure className="feedback">
      <blockquote className="quote paragraph italic trim-bar-beside">{quote}</blockquote>
      <figcaption className="attribution caption muted-ink">{by}</figcaption>
    </figure>
    <table className="tutorial-table contained">
      <caption className="off-screen">the clues</caption>
      <thead className="tutorial-headings">
        <tr className="ink-underline">
          <th className="tutorial-cell caption uppercase" scope="col">the clue</th>
          <th className="tutorial-cell caption uppercase" scope="col">what it tells you</th>
        </tr>
      </thead>
      <tbody className="tutorial-rows hairline-separated">
        {clues.map(([clue, tells]) =>
          <tr className="tutorial-row" key={clue}>
            <th className="tutorial-cell clue italic" scope="row">“{clue}”</th>
            <td className="tutorial-cell muted-ink">{tells}</td>
          </tr>)}
      </tbody>
    </table>
  </section>
  <p className="verdict sub-title">{verdict}</p>
</>;

type DesignProps = {
  sketch: ReactNode;
  answers: string;
  unanswered: string[];
};

export const Design: FC<DesignProps> = ({sketch, answers, unanswered}) =>
  <section className="phase card rounded-corners lifted" aria-labelledby="phase-design">
    <h3 id="phase-design" className="phase-title title">Sketch a design from the need</h3>
    <p className="overview paragraph muted-ink">
      The need has a visual answer, so the next artifact is a design: enough shape to argue
      with, before any code. What the sketch cannot answer goes back to the people asking, as
      questions, not guesses.
    </p>
    <figure className="design-still field rounded-corners muted-dashed-outline">
      {sketch}
      <figcaption className="reel-note paragraph">{answers}</figcaption>
    </figure>
    <aside className="unanswered field rounded-corners" aria-label="what a design cannot tell you">
      <h4 className="unanswered-title caption muted-ink uppercase">what a design cannot tell you</h4>
      <ul className="unanswered-list">
        {unanswered.map(question => <li key={question}>{question}</li>)}
      </ul>
    </aside>
    <p className="overview paragraph muted-ink">
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
  <section className="phase card rounded-corners lifted" aria-labelledby="phase-stories">
    <h3 id="phase-stories" className="phase-title title">Slice the design into stories</h3>
    <p className="overview paragraph muted-ink">
      With the need heard and the design answering shape, the work splits into stories: each
      one told as a <a className="signpost"
        href="https://initialcapacity.io/insights/user-story"
        target="_blank"
        rel="noreferrer">user story</a>, a discrete piece of value from the {who}’s side of
      the screen, and a promise of a conversation rather than a specification. The whole of it
      reads as one:
    </p>
    <hgroup className="story arriving card rounded-corners lifted">
      <h4 className="can paragraph bold">{can}</h4>
      <p className="so-that paragraph italic muted-ink">{soThat}</p>
    </hgroup>
    <p className="overview paragraph muted-ink">{slices}</p>
    <ul className="sliced" aria-label="the slices">
      {sliced.map(([slice, station]) =>
        <li className="slice italic muted-ink" key={slice}>
          <span>{slice}</span>
          <a className="slice-station signpost caption upright" href={`#${stationId(station)}`}>station {station}</a>
        </li>)}
    </ul>
  </section>;
