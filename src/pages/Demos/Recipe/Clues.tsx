import {TabLink} from '@pages/Demos/TabLink';
import {DemoTopics} from '@pages/Demos/demo-topics';
import {FC, ReactNode} from 'react';
import {maybe} from '@ryandur/sand';
import {needHeading} from './need-heading';

type CluesProps = {
  quote: string;
  by: string;
  clues: [string, string][];
  verdict: ReactNode;
  headedByPage?: boolean;
  'aria-labelledby'?: string;
};

export const Clues: FC<CluesProps> = ({quote, by, clues, verdict, headedByPage = false, 'aria-labelledby': titledBy}) => <>
  <section className="phase card rounded-corners lifted" aria-labelledby={maybe(titledBy).orElse(needHeading.id)}>
    {headedByPage ? null
      : <h3 id={needHeading.id} className="phase-title title">{needHeading.title}</h3>}
    <p className="overview paragraph muted-ink">
      Before any code, and before any story, someone needs something. Listen for what they say and name each clue, a
      line of it and what it commits the build to, as the <TabLink to={DemoTopics.zIndex}>z-index tab</TabLink> shows;
      the clues point at the element to build it with.
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
