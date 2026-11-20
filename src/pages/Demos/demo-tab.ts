import {Maybe, maybe} from '@ryandur/sand';
import {Paths} from '@navigation';
import {DemoTopics} from './demo-topics';

const address = (topic: DemoTopics): string => `${Paths.demos}${topic}/`;

const isAddressOf = (pathname: string, topic: DemoTopics): boolean => pathname === address(topic);

const currentAt = (pathname: string, topic: DemoTopics): 'page' | 'true' => isAddressOf(pathname, topic) ? 'page' : 'true';

const names: Record<DemoTopics, string> = {
  [DemoTopics.accordions]: 'Accordions',
  [DemoTopics.zIndex]: 'Z-index',
  [DemoTopics.dragAndDrop]: 'Drag sort',
  [DemoTopics.charts]: 'Charts',
  [DemoTopics.tables]: 'Tables'
};

const formerTabs: ReadonlyMap<string, DemoTopics> = new Map([['dragAndDrop', DemoTopics.dragAndDrop]]);

const topicAt = (segment?: string): Maybe<DemoTopics> =>
  maybe(Object.values(DemoTopics).find(topic => topic === segment));

const topicOf = (tab = ''): DemoTopics =>
  maybe(formerTabs.get(tab)).either(former => former, () => topicAt(tab).orElse(DemoTopics.accordions));

type DemoTab = {
  address: (topic: DemoTopics) => string;
  isAddressOf: (pathname: string, topic: DemoTopics) => boolean;
  currentAt: (pathname: string, topic: DemoTopics) => 'page' | 'true';
  names: Record<DemoTopics, string>;
  topicOf: (tab?: string) => DemoTopics;
};

export const demoTab: DemoTab = {address, isAddressOf, currentAt, names, topicOf};
