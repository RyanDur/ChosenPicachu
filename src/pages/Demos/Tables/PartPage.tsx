import {FC} from 'react';
import {PartSection} from '@pages/Demos/PartSection';
import {PartOpening} from '@pages/Demos/PartOpening';
import {PartPanel} from '@pages/Demos/PartPanel';
import {PartDemo} from '@pages/Demos/PartDemo';
import {PartFoot} from '@pages/Demos/PartFoot';
import {DemoTopics, demoTab} from '@pages/Demos';
import {Aggregations} from './Aggregations';
import {TablePart, tableParts} from './part-pages';
import {PartsAndDials} from './PartsAndDials';
import {tablesBook} from './tables-book';
import {usePartsBeside} from './usePartsBeside';
import {DesignAsk, FlowTableRecipe, StillTableRecipe, StoryClues, StorySlices} from './Recipe';
import '../Tutorials.css';
import './TutorialPage.css';

const parts: Record<TablePart, FC> = {
  'the-need-and-its-clues': StoryClues,
  'the-sketch': DesignAsk,
  'the-slices': StorySlices,
  'the-still-table': StillTableRecipe,
  'the-live-table-and-the-store': FlowTableRecipe
};

const introductions: Record<TablePart, string> = {
  'the-need-and-its-clues': 'Before a design and before a story, someone tells us what gets in their way.',
  'the-sketch': 'The needs from part 1, drawn as a sketch.',
  'the-slices': 'A story says what a person will be able to do, and why they want it.',
  'the-still-table': 'The first story, built all the way through.',
  'the-live-table-and-the-store': 'The second story, built all the way through.'
};

export const PartPage: FC<{readonly part: TablePart}> = ({part}) => {
  const {name, ordinal} = tableParts.told(part);
  const Part = parts[part];
  const {previous, next} = usePartsBeside(part);
  const place = `${demoTab.names[DemoTopics.tables]} · part ${ordinal} of ${tablesBook.inTheBook}`;
  return <PartSection heading={name}>
    <PartOpening place={place}><p className="paragraph">{introductions[part]}</p></PartOpening>
    <PartPanel><PartsAndDials/></PartPanel>
    <PartDemo wears="tutorial-page tutorials">
      <Aggregations/>
      <Part/>
    </PartDemo>
    <PartFoot previous={previous} next={next}/>
  </PartSection>;
};
