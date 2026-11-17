import {FC, useId} from 'react';
import {DemoTopics, demoTab} from '@pages/Demos';
import {PageFoot} from '@pages/Demos/PageFoot';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {Aggregations} from './Aggregations';
import {TablePart, tableParts} from './part-pages';
import {WorldGlider, WorldNote} from './World';
import {DesignAsk, StoryClues, StorySlices} from './Recipe';
import '../Tutorials.css';
import './TutorialPage.css';

const parts: Record<TablePart, FC<{headedBy: string}>> = {
  'the-need-and-its-clues': StoryClues,
  'the-sketch': DesignAsk,
  'the-slices': StorySlices
};

export const PartPage: FC<{part: TablePart}> = ({part}) => {
  const titled = `part${useId()}`;
  const {name, ordinal} = tableParts.told(part);
  const carried = useCarriedAddress();
  const Part = parts[part];
  const linked = ({numbered, to, heading}: {numbered: string; to: string; heading?: string}) =>
    ({numbered, address: carried(to, heading)});
  return <article aria-labelledby={titled} className="tutorial-page tutorials">
    <hgroup>
      <p className="caption">{`${demoTab.names[DemoTopics.tables]} · part ${ordinal} of ${tableParts.inTheBook}`}</p>
      <h2 id={titled} className="title">{name}</h2>
    </hgroup>
    <Aggregations/>
    <WorldGlider/>
    <WorldNote/>
    <Part headedBy={titled}/>
    <PageFoot label="the tables parts"
      previous={tableParts.previousOf(part).map(linked)}
      next={tableParts.nextOf(part).map(linked)}/>
  </article>;
};
