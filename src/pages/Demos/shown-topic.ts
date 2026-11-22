import {createContext} from 'react';
import {DemoTopics} from './demo-topics';

export const ShownTopic = createContext<DemoTopics>(DemoTopics.accordions);
