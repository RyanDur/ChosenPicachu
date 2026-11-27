import {FC} from 'react';
import {PartSection} from '@pages/Demos/PartSection';
import {ThePart} from '@pages/Demos/the-part';
import {PartOpening} from '@pages/Demos/PartOpening';
import {PartDemo} from '@pages/Demos/PartDemo';
import {PartFoot} from '@pages/Demos/PartFoot';
import {DemoTopics, demoTab} from '@pages/Demos';
import {Aggregations} from './Aggregations';
import {Tutorial, tableTutorials} from './tutorial-pages';
import {DragSortTutorial} from './DragSort';
import {MenuRecipe, ResizeRecipe} from './Recipe';
import {DemoLink} from '@pages/Demos/DemoLink';
import {tableParts} from './part-pages';
import {tablesBook} from './tables-book';
import {useShownTutorial} from './useShownTutorial';
import {WorldDial} from './WorldDial';
import {usePartsBeside} from './usePartsBeside';
import {Exhibit, ExhibitFoot} from '../Exhibit';
import './TutorialPage.css';

const recipes: Record<Tutorial, FC> = {
  sort: DragSortTutorial,
  menu: MenuRecipe,
  resize: ResizeRecipe
};

const introductions: Record<Tutorial, string> = {
  sort: 'The third story, built all the way through.',
  menu: 'The fourth story, built all the way through.',
  resize: 'The fifth story, built all the way through.'
};

type ExhibitWords = {
  name: string;
  says: string;
};

const exhibits: Record<Tutorial, ExhibitWords> = {
  sort: {
    name: 'Columns and rows that move while the numbers keep arriving',
    says: 'The order of each lives in the store, and a drag is measured once.'
  },
  menu: {
    name: 'A table that keeps its rows in order',
    says: 'The ordering is one fact in the store, and reset gives the trader’s order back.'
  },
  resize: {
    name: 'A column the trader can widen',
    says: 'A width is a share of the table, and a column widens by taking from its neighbor.'
  }
};

export const TutorialPage: FC = () => {
  const partsBeside = usePartsBeside();
  const startingAt = tableParts.told(tableTutorials.startingPart);
  const to = tableParts.addressOf(tableTutorials.startingPart);
  return useShownTutorial().either(tutorial => {
    const TutorialRecipe = recipes[tutorial];
    const exhibit = exhibits[tutorial];
    const place = `${demoTab.names[DemoTopics.tables]} · part ${tableTutorials.ordinalOf(tutorial)} of ${tablesBook.inTheBook}`;
    const part = {heading: tableTutorials.nameOf(tutorial), headingId: `${tutorial}-heading`, place, ...partsBeside(tutorial)};
    return <ThePart value={part}><PartSection>
      <PartOpening><p className="paragraph">{introductions[tutorial]}</p></PartOpening>
      <WorldDial/>
      <PartDemo className="tutorial-page">
        <Exhibit name={exhibit.name}>
          <Aggregations/>
          <ExhibitFoot><strong className="bold">{`${exhibit.name}.`}</strong> {exhibit.says}</ExhibitFoot>
        </Exhibit>
        <p className="paragraph">
          This tutorial builds on the live table above. It starts where part {startingAt.ordinal} of the tables tab,
          “<DemoLink to={to}>{startingAt.name}</DemoLink>”, ends,
          with the page’s store, the table’s own store and the actions each one takes through its dispatch. If
          those are new to you, read that part first.
        </p>
        <TutorialRecipe/>
      </PartDemo>
      <PartFoot/>
    </PartSection></ThePart>;
  }, () => null);
};
