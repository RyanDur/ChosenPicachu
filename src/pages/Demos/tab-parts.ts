import {DemoTopics} from './demo-topics';
import {PartsGroup} from './parts-listed';
import {accordionsListed} from './Accordions';
import {chartsListed} from './Charts';
import {tablesListed} from './Tables';
import {zIndexListed} from './ZIndexDemo';

export const tabParts: Readonly<Record<DemoTopics, readonly PartsGroup[]>> = {
  [DemoTopics.accordions]: accordionsListed,
  [DemoTopics.zIndex]: zIndexListed,
  [DemoTopics.dragAndDrop]: [],
  [DemoTopics.charts]: chartsListed,
  [DemoTopics.tables]: tablesListed
};
