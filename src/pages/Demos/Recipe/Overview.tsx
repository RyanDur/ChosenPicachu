import {FC} from 'react';

type Props = {
  builds: string;
  reads: string;
  quote: string;
  by: string;
};

export const Overview: FC<Props> = ({builds, reads, quote, by}) =>
  <>
    <p className="overview paragraph">
      We are going to build {builds}, feature by feature. Every card below is a feature, told
      as a <a className="signpost"
        href="https://initialcapacity.io/insights/user-story"
        target="_blank"
        rel="noreferrer">user story</a>: open one and you get the plan for that feature and the
      steps that build it, with the real code from this site, so what you read is what runs.
    </p>
    <p className="overview paragraph">
      The dials change which {reads} you are reading about. Eager, Lazy, Keep, Hide, Animate,
      and Static are this page’s names for the choices, not platform keywords, and where a step
      depends on a dial, that dial sits on the step. The links go to MDN if you want more.
    </p>
    <figure className="feedback">
      <blockquote className="quote paragraph italic">{quote}</blockquote>
      <figcaption className="attribution">{by}</figcaption>
    </figure>
    <p className="overview paragraph">
      If you want the exercise, stop here and build the story yourself first. The {reads} is
      our interpretation of that; the cards below break the interpretation into features. Open
      one to see how we built it, or to compare it with yours.
    </p>
  </>;
