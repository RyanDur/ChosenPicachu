import {carve, Line} from '../../Recipe';

export const elidedHeaders = (carved: Line[]): Line[] => carve.elided(carved,
  '<DraggableColumn column="buys"', '<Column column="change"', '{/* …buys, sells, volume and vwap, written as trades is… */}');
