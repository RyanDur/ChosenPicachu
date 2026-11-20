import {FC} from 'react';
import {TabSidecar} from '../TabSidecar';
import {PartsIndex} from './PartsIndex';
import {ZIndexSize} from './ZIndexSize';

export const PartsAndMinutes: FC<{readonly level: 2 | 3}> = ({level}) =>
  <TabSidecar label="parts and minutes">
    <ZIndexSize/>
    <PartsIndex level={level}/>
  </TabSidecar>;
