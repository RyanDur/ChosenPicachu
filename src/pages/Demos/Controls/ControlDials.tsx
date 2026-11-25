import {FC} from 'react';
import type {Copy} from './Controls';
import {DialGroup} from './DialGroup';
import {DialRow} from './DialRow';
import {Reading} from './Reading';
import {useControls} from './useControls';
import {PaceDial} from './PaceDial';
import {OriginDial} from './OriginDial';
import {MotionDial} from './MotionDial';

export const ControlDials: FC<{copy: Copy}> = ({copy}) => {
  const {pace, origin, motion} = useControls();
  return <DialGroup>
    <DialRow label="pace">
      <PaceDial name={`${copy.kind}-pace`}/>
      <Reading>{copy.pace[pace]}</Reading>
    </DialRow>
    <DialRow label="origin">
      <OriginDial name={`${copy.kind}-origin`}/>
      <Reading>{copy.origin[origin]}</Reading>
    </DialRow>
    <DialRow label="motion">
      <MotionDial name={`${copy.kind}-motion`}/>
      <Reading>{copy.motion[motion]}</Reading>
    </DialRow>
  </DialGroup>;
};
