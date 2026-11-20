import {FC} from 'react';
import {PartSection} from '@pages/Demos/PartSection';
import {DemoTopics, demoTab} from '@pages/Demos';
import {Aggregations} from './Aggregations';
import {TablePart, tableParts} from './part-pages';
import {PartFoot} from './PartFoot';
import {PartsAndDials} from './PartsAndDials';
import {tablesBook} from './tables-book';
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

export const PartPage: FC<{readonly part: TablePart}> = ({part}) => {
  const {name, ordinal} = tableParts.told(part);
  const Part = parts[part];
  const place = `${demoTab.names[DemoTopics.tables]} · part ${ordinal} of ${tablesBook.inTheBook}`;
  return <PartSection title={name} caption={place}
    panel={<PartsAndDials/>} foot={<PartFoot part={part}/>} wears="tutorial-page tutorials">
    <Aggregations/>
    <Part/>
  </PartSection>;
};
