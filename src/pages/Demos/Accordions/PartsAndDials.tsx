import {FC} from 'react';
import {DialGroup} from '../Controls';
import {TabSidecar} from '../TabSidecar';
import {AccordionsSize} from './AccordionsSize';
import {FoldMotionDial} from './FoldMotionDial';
import {FoldTypeDial} from './FoldTypeDial';
import {PartsIndex} from './PartsIndex';

export const PartsAndDials: FC = () =>
  <TabSidecar label="parts and dials">
    <AccordionsSize/>
    <PartsIndex/>
    <DialGroup>
      <FoldTypeDial/>
      <FoldMotionDial/>
    </DialGroup>
  </TabSidecar>;
