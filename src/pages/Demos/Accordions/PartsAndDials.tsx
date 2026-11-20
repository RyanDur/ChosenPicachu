import {FC} from 'react';
import {DialGroup} from '../Controls';
import {TabSidecar} from '../TabSidecar';
import {AccordionsSize} from './AccordionsSize';
import {FoldMotionDial} from './FoldMotionDial';
import {FoldTypeDial} from './FoldTypeDial';
import {PartsIndex} from './PartsIndex';

export const PartsAndDials: FC<{readonly titled?: boolean}> = ({titled}) =>
  <TabSidecar label="parts and dials">
    <AccordionsSize/>
    <PartsIndex titled={titled}/>
    <DialGroup>
      <FoldTypeDial/>
      <FoldMotionDial/>
    </DialGroup>
  </TabSidecar>;
