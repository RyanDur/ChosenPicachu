import {FC} from 'react';
import {TabSidecar} from '../TabSidecar';
import {PartsIndex} from './PartsIndex';
import {ZIndexSize} from './ZIndexSize';

export const PartsAndMinutes: FC<{readonly titled?: boolean}> = ({titled}) =>
  <TabSidecar label="parts and minutes">
    <ZIndexSize/>
    <PartsIndex titled={titled}/>
  </TabSidecar>;
