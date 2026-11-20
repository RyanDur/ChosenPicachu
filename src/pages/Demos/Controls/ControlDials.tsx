import {FC} from 'react';
import type {Copy} from './Controls';
import {DialGroup} from './DialGroup';
import {DialRow} from './DialRow';
import {useControls} from './useControls';

export const ControlDials: FC<{copy: Copy}> = ({copy}) => {
  const {pace, origin, motion, change} = useControls();
  return <DialGroup>
    <DialRow label="pace"
      name={`${copy.kind}-pace`}
      choices={[
        {words: 'Eager', value: 'eager'},
        {words: 'Lazy', value: 'lazy'}
      ]}
      chosen={pace}
      onChosen={next => change({pace: next})}
      reading={copy.pace[pace]}/>
    <DialRow label="origin"
      name={`${copy.kind}-origin`}
      choices={[
        {words: 'Keep', value: 'keep'},
        {words: 'Hide', value: 'hide'}
      ]}
      chosen={origin}
      onChosen={next => change({origin: next})}
      reading={copy.origin[origin]}/>
    <DialRow label="motion"
      name={`${copy.kind}-motion`}
      choices={[
        {words: 'Animate', value: 'animated'},
        {words: 'Static', value: 'static'}
      ]}
      chosen={motion}
      onChosen={next => change({motion: next})}
      reading={copy.motion[motion]}/>
  </DialGroup>;
};
