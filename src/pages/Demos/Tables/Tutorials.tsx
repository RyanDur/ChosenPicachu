import {FC, useId} from 'react';
import {FeaturesAskedFor} from './Recipe';
import {featuresId} from './features-id';
import '../Tutorials.css';

export const Tutorials: FC = () => {
  const titled = `tutorials${useId()}`;
  return <section id={featuresId} aria-labelledby={titled} className="tutorials" tabIndex={-1}>
    <h2 id={titled} className="title">let’s build this feature</h2>
    <FeaturesAskedFor/>
    <p className="paragraph">
      Drag sort builds the first two features, moving a column and moving a row. Sort menu builds the third,
      ranking by a measure, and Drag resize builds the fourth, widening a column.
    </p>
  </section>;
};
