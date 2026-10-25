import * as schema from 'schemawax';
import {Paths} from '@pages/Paths';

export enum DemoTopics {
  accordions = 'accordions',
  zIndex = 'z-index',
  dragAndDrop = 'dragAndDrop',
  charts = 'charts',
  tables = 'tables'
}

export const demoAddress = (topic: DemoTopics): string => `${Paths.demos}?tab=${topic}`;

export const topicNames: Record<DemoTopics, string> = {
  [DemoTopics.accordions]: 'Accordions',
  [DemoTopics.zIndex]: 'Z-index',
  [DemoTopics.dragAndDrop]: 'Drag sort',
  [DemoTopics.charts]: 'Charts',
  [DemoTopics.tables]: 'Tables'
};

export const demoTopicParam: schema.Decoder<DemoTopics> = schema.literalUnion(...Object.values(DemoTopics));
export type PropsWithClassName = {className?: string};
