import {FC} from 'react';
import {DialGroup} from '../Controls';
import {TabSidecar} from '../TabSidecar';
import {AccordionsSize} from './AccordionsSize';
import {FoldMotionDial} from './FoldMotionDial';
import {FoldTypeDial} from './FoldTypeDial';
import {PartsIndex} from './PartsIndex';

type Props = {
  readonly titled?: boolean;
  readonly dialed: boolean;
};

export const PartsAndDials: FC<Props> = ({titled = false, dialed}) =>
  <TabSidecar label={titled ? 'parts and dials' : undefined}>
    <AccordionsSize/>
    <PartsIndex titled={titled}/>
    {dialed && <DialGroup>
      <FoldTypeDial/>
      <FoldMotionDial/>
    </DialGroup>}
  </TabSidecar>;
