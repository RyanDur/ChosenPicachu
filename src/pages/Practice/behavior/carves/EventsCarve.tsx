import {FC} from 'react';
import actionsSource from '@components/DragSortableTable/model/actions.ts?sample';
import marketActionsSource from '@pages/Demos/Market/marketActions.ts?sample';
import {Snippet, lines, carve} from '@pages/Demos/Recipe';

const lifted = carve.span(actionsSource, 'const lifted = ', 'const lifted = ');
const dropped = carve.span(actionsSource, 'const dropped = ', 'const dropped = ');
const tradeArrived = carve.span(marketActionsSource, 'tradeArrived: trade =>', 'tradeArrived: trade =>');

export const EventsCarve: FC = () => <>
  <Snippet label="TS" lines={[...lifted, lines.aside('// …'), ...dropped]}/>
  <Snippet label="TS" lines={tradeArrived}/>
</>;
