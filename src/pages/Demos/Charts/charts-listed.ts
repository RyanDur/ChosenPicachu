import {PartsGroup} from '../parts-listed';
import {chartKinds} from './chart-kinds';

export const chartsListed: readonly PartsGroup[] = [
  {
    entries: chartKinds.all.map(kind =>
      ({to: chartKinds.address(kind), name: chartKinds.names[kind], ...chartKinds.told[kind]}))
  }
];
