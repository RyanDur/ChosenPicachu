import {FC} from 'react';
import {SidecarHead} from '../SidecarHead';
import {TabSidecar} from '../TabSidecar';
import {PartsIndex} from './PartsIndex';
import {ZIndexSize} from './ZIndexSize';

export const PartsAndMinutes: FC<{readonly titled?: boolean}> = ({titled = false}) =>
  <TabSidecar label={titled ? 'parts and minutes' : undefined}>
    <SidecarHead><ZIndexSize/></SidecarHead>
    <PartsIndex titled={titled}/>
  </TabSidecar>;
