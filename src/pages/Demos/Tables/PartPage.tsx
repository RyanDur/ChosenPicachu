import {FC, useId} from 'react';
import {DemoTopics, demoTab} from '@pages/Demos';
import {Aggregations} from './Aggregations';
import {TablePart, tableParts} from './part-pages';
import {WorldGlider, WorldNote} from './World';
import {StoryClues} from './Recipe';
import './TutorialPage.css';

export const PartPage: FC<{part: TablePart}> = ({part}) => {
  const titled = `part${useId()}`;
  const {name, ordinal} = tableParts.told(part);
  return <article aria-labelledby={titled} className="tutorial-page tutorials">
    <hgroup>
      <p className="caption">{`${demoTab.names[DemoTopics.tables]} · part ${ordinal} of ${tableParts.inTheBook}`}</p>
      <h2 id={titled} className="title">{name}</h2>
    </hgroup>
    <Aggregations/>
    <WorldGlider/>
    <WorldNote/>
    <StoryClues aria-labelledby={titled}/>
  </article>;
};
