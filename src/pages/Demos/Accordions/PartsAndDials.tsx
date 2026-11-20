import {FC} from 'react';
import {DialGroup} from '../Controls';
import {TabSidecar} from '../TabSidecar';
import {AccordionsSize} from './AccordionsSize';
import {FoldMotionDial} from './FoldMotionDial';
import {FoldTypeDial} from './FoldTypeDial';
import {PartsIndex} from './PartsIndex';

export const PartsAndDials: FC<{readonly level: 2 | 3}> = ({level}) =>
  <TabSidecar label="parts and dials">
    <AccordionsSize/>
    <PartsIndex level={level}/>
    <DialGroup>
      <FoldTypeDial/>
      <FoldMotionDial/>
    </DialGroup>
  </TabSidecar>;
