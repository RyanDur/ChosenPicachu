import {FC} from 'react';
import {DialGroup} from '../Controls';
import {FoldMotionDial} from './FoldMotionDial';
import {FoldTypeDial} from './FoldTypeDial';

export const FoldDials: FC = () =>
  <DialGroup>
    <FoldTypeDial/>
    <FoldMotionDial/>
  </DialGroup>;
