import {FC, ReactNode} from 'react';

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
      <figcaption className="paragraph">{answers}</figcaption>
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
