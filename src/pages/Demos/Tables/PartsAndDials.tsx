import {FC} from 'react';
import {TabSidecar} from '../TabSidecar';
import {PartsIndex} from './PartsIndex';
import {TablesSize} from './TablesSize';
import {WorldGlider, WorldNote} from './World';

export const PartsAndDials: FC<{readonly label?: string}> = ({label}) =>
  <TabSidecar label={label} size={<TablesSize/>}>
    <PartsIndex/>
    <WorldGlider/>
    <WorldNote/>
  </TabSidecar>;
