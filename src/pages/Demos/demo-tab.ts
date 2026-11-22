import {Maybe, maybe} from '@ryandur/sand';
import {Paths} from '@navigation';
import {DemoTopics} from './demo-topics';

const address = (topic: DemoTopics): string => `${Paths.demos}${topic}/`;

const isAddressOf = (pathname: string, topic: DemoTopics): boolean => pathname === address(topic);

const addressedAt = (pathname: string): Maybe<DemoTopics> =>
  maybe(Object.values(DemoTopics).find(topic => isAddressOf(pathname, topic)));

const currentAt = (pathname: string, topic: DemoTopics): 'page' | 'true' => isAddressOf(pathname, topic) ? 'page' : 'true';

const names: Record<DemoTopics, string> = {
  [DemoTopics.accordions]: 'Accordions',
  [DemoTopics.zIndex]: 'Z-index',
  [DemoTopics.dragAndDrop]: 'Drag sort',
  [DemoTopics.charts]: 'Charts',
  [DemoTopics.tables]: 'Tables'
};

const adds: Record<DemoTopics, string> = {
  [DemoTopics.accordions]: 'one fold, from HTML alone up to script',
  [DemoTopics.zIndex]: 'adds a component, its state, an event and the top layer',
  [DemoTopics.dragAndDrop]: 'adds the browser’s own drag and a key for every move',
  [DemoTopics.charts]: 'adds trades that keep arriving, checked where they enter',
  [DemoTopics.tables]: 'builds one feature from those parts'
};

const formerTabs: ReadonlyMap<string, DemoTopics> = new Map([['dragAndDrop', DemoTopics.dragAndDrop]]);

const topicAt = (segment?: string): Maybe<DemoTopics> =>
  maybe(Object.values(DemoTopics).find(topic => topic === segment));

const topicOf = (tab = ''): DemoTopics =>
  maybe(formerTabs.get(tab)).either(former => former, () => topicAt(tab).orElse(DemoTopics.accordions));

type DemoTab = {
  address: (topic: DemoTopics) => string;
  addressedAt: (pathname: string) => Maybe<DemoTopics>;
  currentAt: (pathname: string, topic: DemoTopics) => 'page' | 'true';
  names: Record<DemoTopics, string>;
  adds: Record<DemoTopics, string>;
  topicOf: (tab?: string) => DemoTopics;
};

export const demoTab: DemoTab = {address, addressedAt, currentAt, names, adds, topicOf};
