import {FC} from 'react';
import {PartSection} from '@pages/Demos/PartSection';
import {PartFoot} from '@pages/Demos/PartFoot';
import {DemoTopics, demoTab} from '@pages/Demos';
import {Aggregations} from './Aggregations';
import {Tutorial, tableTutorials} from './tutorial-pages';
import {useShownTutorial} from './useShownTutorial';
import {DragSortTutorial} from './DragSort';
import {MenuRecipe, ResizeRecipe} from './Recipe';
import {DemoLink} from '@pages/Demos/DemoLink';
import {tableParts} from './part-pages';
import {tablesBook} from './tables-book';
import {PartsAndDials} from './PartsAndDials';
import {usePartsBeside} from './usePartsBeside';
import './TutorialPage.css';

const recipes: Record<Tutorial, FC> = {
  sort: DragSortTutorial,
  menu: MenuRecipe,
  resize: ResizeRecipe
};

const TutorialFoot: FC<{tutorial: Tutorial}> = ({tutorial}) => {
  const {previous, next} = usePartsBeside(tutorial);
  return <PartFoot previous={previous} next={next}/>;
};

export const TutorialPage: FC = () => {
  const startingAt = tableParts.told(tableTutorials.startingPart);
  const to = tableParts.addressOf(tableTutorials.startingPart);
  return useShownTutorial().either(tutorial => {
    const TutorialRecipe = recipes[tutorial];
    const place = `${demoTab.names[DemoTopics.tables]} · part ${tableTutorials.ordinalOf(tutorial)} of ${tablesBook.inTheBook}`;
    return <PartSection heading={tableTutorials.nameOf(tutorial)} place={place}
      panel={<PartsAndDials/>} foot={<TutorialFoot tutorial={tutorial}/>} wears="tutorial-page">
      <Aggregations/>
      <p className="paragraph">
        This tutorial builds on the live table above. It starts where part {startingAt.ordinal} of the tables tab,
        “<DemoLink to={to}>{startingAt.name}</DemoLink>”, ends,
        with the page’s store, the table’s own store and the actions each one takes through its dispatch. If
        those are new to you, read that part first.
      </p>
      <TutorialRecipe/>
    </PartSection>;
  }, () => null);
};
