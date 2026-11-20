import {FC} from 'react';
import {TabSidecar} from '../TabSidecar';
import {PartsIndex} from './PartsIndex';
import {TablesSize} from './TablesSize';
import {WorldGlider, WorldNote} from './World';

export const PartsAndDials: FC = () =>
  <TabSidecar label="parts and dials">
    <TablesSize/>
    <PartsIndex/>
    <WorldGlider/>
    <WorldNote/>
  </TabSidecar>;
