import {Paths} from '@pages/Paths';

export enum DemoTopics {
  accordions = 'accordions',
  zIndex = 'z-index',
  dragAndDrop = 'drag-and-drop',
  charts = 'charts',
  tables = 'tables'
}

export const demoAddress = (topic: DemoTopics): string => `${Paths.demos}${topic}/`;

export const topicNames: Record<DemoTopics, string> = {
  [DemoTopics.accordions]: 'Accordions',
  [DemoTopics.zIndex]: 'Z-index',
  [DemoTopics.dragAndDrop]: 'Drag sort',
  [DemoTopics.charts]: 'Charts',
  [DemoTopics.tables]: 'Tables'
};

const formerTabs: ReadonlyMap<string, DemoTopics> = new Map([['dragAndDrop', DemoTopics.dragAndDrop]]);

export const demoTopicAt = (segment?: string): DemoTopics | undefined => Object.values(DemoTopics).find(topic => topic === segment);

export const demoTopicOf = (tab = ''): DemoTopics => formerTabs.get(tab) ?? demoTopicAt(tab) ?? DemoTopics.accordions;

export type PropsWithClassName = {className?: string};
