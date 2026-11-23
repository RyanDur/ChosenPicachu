import {useContext} from 'react';
import {maybe} from '@ryandur/sand';
import {DemoTopics} from './demo-topics';
import {ShownTopic} from './shown-topic';

export const useShownTopic = (): DemoTopics => maybe(useContext(ShownTopic)).either(topic => topic, () => {
  throw new Error('useShownTopic is read outside ShownTopic');
});
