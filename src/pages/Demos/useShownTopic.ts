import {useContext} from 'react';
import {DemoTopics} from './demo-topics';
import {ShownTopic} from './shown-topic';

export const useShownTopic = (): DemoTopics => useContext(ShownTopic);
