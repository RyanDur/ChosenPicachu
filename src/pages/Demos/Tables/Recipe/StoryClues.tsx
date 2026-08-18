import {FC} from 'react';

const clues: [string, string][] = [
  ['keep themselves current', 'The data arrives over time. Nothing here is a page you load once.'],
  ['comparing side by side', 'Several measures over one shared set of periods. Two dimensions, not a list.'],
  ['what matters most on top', 'The order is the trader’s, not ours. Ranking is a feature, not a default.'],
  ['arranged the way I think', 'Both axes move. Columns and rows are things the hand can reach.'],
  ['it should just happen', 'No submit, no reload. The arrangement responds under the hand.']
];

export const StoryClues: FC = () => <>
  <section className="phase white rounded-corners drop-shadow" aria-label="the need">
    <h3 className="phase-title">Start with the need, and let it inform the implementation</h3>
    <p className="overview paragraph">
      Before any code, and before any story, someone needs something. Listen for clues, name
      each one, and the element chooses itself.
    </p>
    <figure className="feedback">
      <blockquote className="quote paragraph italic">
        I watch the market all day. I need the numbers to keep themselves current, and I need
        them arranged the way I think: what I am comparing side by side, what matters most on
        top. When I sort something, it should just happen.
      </blockquote>
      <figcaption className="attribution">a trader</figcaption>
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
  <p className="verdict paragraph">
    Measures compared across a shared set of windows is tabular data, and a table is the
    element built for it: one dimension per axis, headers that name both, and a reading
    order assistive tech already understands. Everything after this point is layered onto
    that one choice.
  </p>
</>;
