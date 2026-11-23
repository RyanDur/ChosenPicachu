import {Maybe, maybe} from '@ryandur/sand';
import {Paths} from '@navigation';
import {DemoTopics} from './demo-topics';

const course = Object.values(DemoTopics);

const address = (topic: DemoTopics): string => `${Paths.demos}${topic}/`;

const isAddressOf = (pathname: string, topic: DemoTopics): boolean => pathname === address(topic);

const addressedAt = (pathname: string): Maybe<DemoTopics> =>
  maybe(course.find(topic => isAddressOf(pathname, topic)));

const currentAt = (pathname: string, topic: DemoTopics): 'page' | 'true' => isAddressOf(pathname, topic) ? 'page' : 'true';

const names: Record<DemoTopics, string> = {
  [DemoTopics.accordions]: 'Accordions',
  [DemoTopics.zIndex]: 'Z-index',
  [DemoTopics.dragAndDrop]: 'Drag sort',
  [DemoTopics.charts]: 'Charts',
  [DemoTopics.tables]: 'Tables'
};

const points: Record<DemoTopics, string> = {
  [DemoTopics.accordions]: 'HTML first, then CSS, and script only when needed',
  [DemoTopics.zIndex]: 'a bigger number isn’t the fix; the stacking context decides',
  [DemoTopics.dragAndDrop]: 'the browser’s own drag, and script for what it lacks',
  [DemoTopics.charts]: 'a chart is arithmetic over data the page already holds',
  [DemoTopics.tables]: 'the arrangement is the state, and the data never moves'
};

const before = (topic: DemoTopics): Maybe<DemoTopics> => maybe(course[course.indexOf(topic) - 1]);

const after = (topic: DemoTopics): Maybe<DemoTopics> => maybe(course[course.indexOf(topic) + 1]);

const formerTabs: ReadonlyMap<string, DemoTopics> = new Map([['dragAndDrop', DemoTopics.dragAndDrop]]);

const topicAt = (segment?: string): Maybe<DemoTopics> =>
  maybe(course.find(topic => topic === segment));

const topicOf = (tab = ''): DemoTopics =>
  maybe(formerTabs.get(tab)).either(former => former, () => topicAt(tab).orElse(DemoTopics.accordions));

type DemoTab = {
  address: (topic: DemoTopics) => string;
  after: (topic: DemoTopics) => Maybe<DemoTopics>;
  before: (topic: DemoTopics) => Maybe<DemoTopics>;
  addressedAt: (pathname: string) => Maybe<DemoTopics>;
  currentAt: (pathname: string, topic: DemoTopics) => 'page' | 'true';
  names: Record<DemoTopics, string>;
  points: Record<DemoTopics, string>;
  topicOf: (tab?: string) => DemoTopics;
};

export const demoTab: DemoTab = {address, after, before, addressedAt, currentAt, names, points, topicOf};
