import {FC, useId} from 'react';
import {some, nothing} from '@ryandur/sand';
import {DemoTopics, demoTab} from '@pages/Demos';
import {PageFoot} from '@pages/Demos/PageFoot';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {Aggregations} from './Aggregations';
import {TablePart, tableParts} from './part-pages';
import {WorldGlider, WorldNote} from './World';
import {StoryClues} from './Recipe';
import '../Tutorials.css';
import './TutorialPage.css';

export const PartPage: FC<{part: TablePart}> = ({part}) => {
  const titled = `part${useId()}`;
  const {name, ordinal} = tableParts.told(part);
  const {numbered, heading} = tableParts.onwardOf(part);
  const carried = useCarriedAddress();
  return <article aria-labelledby={titled} className="tutorial-page tutorials">
    <hgroup>
      <p className="caption">{`${demoTab.names[DemoTopics.tables]} · part ${ordinal} of ${tableParts.inTheBook}`}</p>
      <h2 id={titled} className="title">{name}</h2>
    </hgroup>
    <Aggregations/>
    <WorldGlider/>
    <WorldNote/>
    <StoryClues headedByPage aria-labelledby={titled}/>
    <PageFoot label="the tables parts" previous={nothing()}
      next={some({numbered, address: carried(demoTab.address(DemoTopics.tables), heading.id)})}/>
  </article>;
};
