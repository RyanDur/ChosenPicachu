import {FC} from 'react';
import {SidecarHeader} from '../SidecarHeader';
import {TabSidecar} from '../TabSidecar';
import {ChartsSize} from './ChartsSize';
import {PartsIndex} from './PartsIndex';

export const PartsAndMinutes: FC<{readonly titled?: boolean}> = ({titled = false}) =>
  <TabSidecar label={titled ? 'parts and minutes' : undefined}>
    <SidecarHeader><ChartsSize/></SidecarHeader>
    <PartsIndex titled={titled}/>
  </TabSidecar>;
