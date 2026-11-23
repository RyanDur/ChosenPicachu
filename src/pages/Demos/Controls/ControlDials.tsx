import {FC} from 'react';
import type {Copy} from './Controls';
import {DialGroup} from './DialGroup';
import {PillGlider} from '@components/PillGlider';
import {DialRow} from './DialRow';
import {Reading} from './Reading';
import {useControls} from './useControls';
import {dialChoices} from './dial-choices';

export const ControlDials: FC<{copy: Copy}> = ({copy}) => {
  const {pace, origin, motion, change} = useControls();
  return <DialGroup>
    <DialRow label="pace">
      <PillGlider label="pace"
        name={`${copy.kind}-pace`}
        choices={dialChoices.pace}
        chosen={pace}
        onChosen={next => change({pace: next})}/>
      <Reading>{copy.pace[pace]}</Reading>
    </DialRow>
    <DialRow label="origin">
      <PillGlider label="origin"
        name={`${copy.kind}-origin`}
        choices={dialChoices.origin}
        chosen={origin}
        onChosen={next => change({origin: next})}/>
      <Reading>{copy.origin[origin]}</Reading>
    </DialRow>
    <DialRow label="motion">
      <PillGlider label="motion"
        name={`${copy.kind}-motion`}
        choices={dialChoices.motion}
        chosen={motion}
        onChosen={next => change({motion: next})}/>
      <Reading>{copy.motion[motion]}</Reading>
    </DialRow>
  </DialGroup>;
};
