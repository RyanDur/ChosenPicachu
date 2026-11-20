import {FC} from 'react';
import {PartSection} from '@pages/Demos/PartSection';
import {Link} from 'react-router';
import {DemoTopics, demoTab} from '@pages/Demos';
import {Aggregations} from './Aggregations';
import {Tutorial, tableTutorials} from './tutorial-pages';
import {useShownTutorial} from './useShownTutorial';
import {DragSortTutorial} from './DragSort';
import {MenuRecipe, ResizeRecipe} from './Recipe';
import {DemoLink} from '@pages/Demos/DemoLink';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {tableParts} from './part-pages';
import {tablesBook} from './tables-book';
import {PartFoot} from './PartFoot';
import {PartsAndDials} from './PartsAndDials';
import './TutorialPage.css';

const recipes: Record<Tutorial, FC> = {
  sort: DragSortTutorial,
  menu: MenuRecipe,
  resize: ResizeRecipe
};

export const TutorialPage: FC = () => {
  const carried = useCarriedAddress();
  const startingAt = tableParts.told(tableTutorials.startingPart);
  const to = tableParts.addressOf(tableTutorials.startingPart);
  return useShownTutorial().either(tutorial => {
    const TutorialRecipe = recipes[tutorial];
    const place = <>
      <Link className="signpost" to={carried(demoTab.address(DemoTopics.tables))}>
        {demoTab.names[DemoTopics.tables]}
      </Link>
      {` · part ${tableTutorials.ordinalOf(tutorial)} of ${tablesBook.inTheBook}`}
    </>;
    return <PartSection heading={tableTutorials.nameOf(tutorial)} place={place}
      panel={<PartsAndDials/>} foot={<PartFoot part={tutorial}/>} wears="tutorial-page">
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
