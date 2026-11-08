import {FC} from 'react';
import reducerSource from '@components/DragSortableTable/model/reducer.ts?sample';
import {Snippet, carve} from '@pages/Demos/Recipe';

const tableReducer = carve.span(reducerSource, 'const answering', 'tableActions.recognizes(action) ? answering');

export const TableReducerCarve: FC = () => <Snippet label="TS" lines={tableReducer}/>;
