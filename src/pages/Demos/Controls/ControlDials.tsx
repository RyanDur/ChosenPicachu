import {FC} from 'react';
import type {Copy} from './Controls';
import {DialGroup} from './DialGroup';
import {DialRow} from './DialRow';
import {useControls} from './useControls';
import {dialChoices} from './dial-choices';

export const ControlDials: FC<{copy: Copy}> = ({copy}) => {
  const {pace, origin, motion, change} = useControls();
  return <DialGroup>
    <DialRow label="pace"
      name={`${copy.kind}-pace`}
      choices={dialChoices.pace}
      chosen={pace}
      onChosen={next => change({pace: next})}
      reading={copy.pace[pace]}/>
    <DialRow label="origin"
      name={`${copy.kind}-origin`}
      choices={dialChoices.origin}
      chosen={origin}
      onChosen={next => change({origin: next})}
      reading={copy.origin[origin]}/>
    <DialRow label="motion"
      name={`${copy.kind}-motion`}
      choices={dialChoices.motion}
      chosen={motion}
      onChosen={next => change({motion: next})}
      reading={copy.motion[motion]}/>
  </DialGroup>;
};
