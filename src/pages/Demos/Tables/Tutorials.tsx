import {FC, useId} from 'react';
import {FeaturesAskedFor} from './Recipe';
import {featuresId} from './features-id';
import {Tutorial, tableTutorials} from './tutorial-pages';
import {DemoLink} from '@pages/Demos/DemoLink';
import '../Tutorials.css';

const TutorialLink: FC<{tutorial: Tutorial}> = ({tutorial}) =>
  <DemoLink to={tableTutorials.addressOf(tutorial)}>{tableTutorials.nameOf(tutorial)}</DemoLink>;

export const Tutorials: FC = () => {
  const titled = `tutorials${useId()}`;
  return <section id={featuresId} aria-labelledby={titled} className="tutorials" tabIndex={-1}>
    <h2 id={titled} className="title">let’s build this feature</h2>
    <FeaturesAskedFor/>
    <p className="paragraph">
      <TutorialLink tutorial="sort"/> builds the first two features, moving a column and moving a
      row. <TutorialLink tutorial="menu"/> builds the third, ranking by a measure,
      and <TutorialLink tutorial="resize"/> builds the fourth, widening a column.
    </p>
  </section>;
};
