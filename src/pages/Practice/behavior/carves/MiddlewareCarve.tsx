import {FC} from 'react';
import storeSource from '@components/store/store.ts?sample';
import {Snippet, carve} from '@pages/Demos/Recipe';

export const MiddlewareCarve: FC = () => <Snippet label="TS" lines={carve.unit(storeSource, 'export type Middleware')}/>;
