import {FC} from 'react';
import reducersSource from '@components/store/reducers.ts?sample';
import {Snippet, carve} from '@pages/Demos/Recipe';

const reducerType = carve.span(reducersSource, 'export type Reducer', 'export const reducers = {combined};');

export const ReducerCarve: FC = () => <Snippet label="TS" lines={reducerType}/>;
