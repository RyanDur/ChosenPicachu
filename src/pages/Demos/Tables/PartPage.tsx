import {FC, useId} from 'react';
import {DemoTopics, demoTab} from '@pages/Demos';
import {Aggregations} from './Aggregations';
import {TablePart, tableParts} from './part-pages';
import {PartFoot} from './PartFoot';
import {tablesBook} from './tables-book';
import {DesignAsk, FlowTableRecipe, StillTableRecipe, StoryClues, StorySlices} from './Recipe';
import '../Tutorials.css';
import './TutorialPage.css';

const parts: Record<TablePart, FC<{headedBy: string}>> = {
  'the-need-and-its-clues': StoryClues,
  'the-sketch': DesignAsk,
  'the-slices': StorySlices,
  'the-still-table': StillTableRecipe,
  'the-live-table-and-the-store': FlowTableRecipe
};

export const PartPage: FC<{part: TablePart}> = ({part}) => {
  const titled = `part${useId()}`;
  const {name, ordinal} = tableParts.told(part);
  const Part = parts[part];
  return <article aria-labelledby={titled} className="tutorial-page tutorials">
    <hgroup>
      <p className="caption">{`${demoTab.names[DemoTopics.tables]} · part ${ordinal} of ${tablesBook.inTheBook}`}</p>
      <h2 id={titled} className="title">{name}</h2>
    </hgroup>
    <Aggregations/>
    <Part headedBy={titled}/>
    <PartFoot part={part}/>
  </article>;
};
