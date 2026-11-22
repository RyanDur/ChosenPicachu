import {FC} from 'react';
import {SidecarHeader} from '../SidecarHeader';
import {TabSidecar} from '../TabSidecar';
import {PartsIndex} from './PartsIndex';
import {ZIndexSize} from './ZIndexSize';

export const PartsAndMinutes: FC<{readonly titled?: boolean}> = ({titled = false}) =>
  <TabSidecar label={titled ? 'parts and minutes' : undefined}>
    <SidecarHeader><ZIndexSize/></SidecarHeader>
    <PartsIndex titled={titled}/>
  </TabSidecar>;
