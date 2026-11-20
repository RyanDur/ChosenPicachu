import {FC, ReactNode, useId} from 'react';
import {designHeading} from '@pages/Demos/headings';

type DesignProps = {
  sketch: ReactNode;
  answers: string;
  unanswered: string[];
  headedByThePart?: boolean;
};

export const Design: FC<DesignProps> = ({sketch, answers, unanswered, headedByThePart = false}) => {
  const Subtitle: 'h3' | 'h4' = headedByThePart ? 'h3' : 'h4';
  const unansweredTitle = `unanswered${useId()}`;
  return <section className="phase card rounded-corners lifted"
    aria-labelledby={headedByThePart ? undefined : designHeading.id}>
    {headedByThePart ? null : <h3 id={designHeading.id} className="phase-title title">{designHeading.title}</h3>}
    <p className="overview paragraph muted-ink">
      The need has a visual answer, so the next artifact is a design: enough shape to argue
      with, before any code. What the sketch cannot answer goes back to the people asking, as
      questions, not guesses.
    </p>
    <figure className="design-still field rounded-corners muted-dashed-outline">
      {sketch}
      <figcaption className="paragraph">{answers}</figcaption>
    </figure>
    <section aria-labelledby={unansweredTitle} className="unanswered field rounded-corners">
      <Subtitle id={unansweredTitle} className="unanswered-title caption muted-ink uppercase">
        what a design cannot tell you
      </Subtitle>
      <ul className="unanswered-list">
        {unanswered.map(question => <li key={question}>{question}</li>)}
      </ul>
    </section>
    <p className="overview paragraph muted-ink">
      These are questions for the people asking for the feature. Ask them, and keep building
      on your best interpretation in the meantime: markup organized well is cheap to change
      when the answers arrive.
    </p>
  </section>;
};
