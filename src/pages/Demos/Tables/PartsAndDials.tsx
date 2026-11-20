import {FC} from 'react';
import {TabSidecar} from '../TabSidecar';
import {PartsIndex} from './PartsIndex';
import {TablesSize} from './TablesSize';
import {WorldGlider, WorldNote} from './World';

export const PartsAndDials: FC<{readonly titled?: boolean}> = ({titled = false}) =>
  <TabSidecar label={titled ? 'parts and dials' : undefined}>
    <TablesSize/>
    <PartsIndex/>
    <WorldGlider/>
    <WorldNote/>
  </TabSidecar>;
