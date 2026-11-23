import {DemoTopics} from './demo-topics';
import {PartsGroup} from './parts-listed';
import {accordionsListed} from './Accordions/listed';
import {chartsListed} from './Charts/listed';
import {tablesListed} from './Tables/listed';
import {zIndexListed} from './ZIndexDemo/listed';

export const tabParts: Readonly<Record<DemoTopics, readonly PartsGroup[]>> = {
  [DemoTopics.accordions]: accordionsListed,
  [DemoTopics.zIndex]: zIndexListed,
  [DemoTopics.dragAndDrop]: [],
  [DemoTopics.charts]: chartsListed,
  [DemoTopics.tables]: tablesListed
};
