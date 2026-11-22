import {FC} from 'react';
import {SidecarHead} from '../SidecarHead';
import {TabSidecar} from '../TabSidecar';
import {PartsIndex} from './PartsIndex';
import {TablesSize} from './TablesSize';
import {WorldGlider, WorldNote} from './World';

export const PartsAndDials: FC<{readonly label?: string}> = ({label}) =>
  <TabSidecar label={label}>
    <SidecarHead><TablesSize/></SidecarHead>
    <PartsIndex/>
    <WorldGlider/>
    <WorldNote/>
  </TabSidecar>;
