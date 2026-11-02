import {FC} from 'react';
import storeSource from '@components/store.ts?sample';
import actionsSource from '@components/DragSortableTable/actions.ts?sample';
import demosStoreSource from '@pages/Demos/store.ts?sample';
import reducerSource from '@components/DragSortableTable/reducer.ts?sample';
import {aside, Snippet} from '@pages/Demos/Recipe';
import {span} from '@pages/Demos/Recipe/carve';

const reducerType = span(storeSource, 'export type Reducer', '(state, action) => reducers.reduce');
const lifted = span(actionsSource, 'export const lifted', 'export const lifted');
const dropped = span(actionsSource, 'export const dropped', 'export const dropped');
const tradeArrived = span(demosStoreSource, 'export const tradeArrived', 'export const tradeArrived');
const tableReducer = span(reducerSource, 'const answering', 'isTableAction(action) ? answering');

export const ReducerCarve: FC = () => <Snippet label="TS" lines={reducerType}/>;

export const EventsCarve: FC = () => <>
  <Snippet label="TS" lines={[...lifted, aside('// …'), ...dropped]}/>
  <Snippet label="TS" lines={tradeArrived}/>
</>;

export const TableReducerCarve: FC = () => <Snippet label="TS" lines={tableReducer}/>;
