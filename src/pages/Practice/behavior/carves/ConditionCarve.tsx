import {FC} from 'react';
import feedbackSource from '@feedback/Feedback.tsx?sample';
import {carve, Snippet} from '@pages/Demos/Recipe';

const enterCondition = "if (event.key === 'Enter' && not(event.shiftKey) && not(event.nativeEvent.isComposing))";

export const ConditionCarve: FC = () =>
  <Snippet label="TS" lines={carve.between(feedbackSource, enterCondition, enterCondition)}/>;
