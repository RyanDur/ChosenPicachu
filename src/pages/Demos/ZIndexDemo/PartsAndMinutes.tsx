import {FC} from 'react';
import {TabSidecar} from '../TabSidecar';
import {PartsIndex} from './PartsIndex';
import {ZIndexSize} from './ZIndexSize';

export const PartsAndMinutes: FC = () =>
  <TabSidecar label="parts and minutes">
    <ZIndexSize/>
    <PartsIndex/>
  </TabSidecar>;
