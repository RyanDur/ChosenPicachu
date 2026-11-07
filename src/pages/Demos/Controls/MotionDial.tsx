import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useControls} from './useControls';

export const MotionDial: FC<{name: string}> = ({name}) => {
  const {motion, change} = useControls();
  return <PillGlider label="motion"
    name={name}
    options={[
      {display: 'Animate', value: 'animated'},
      {display: 'Static', value: 'static'}
    ]}
    chosen={motion}
    onChosen={next => change({motion: next})}/>;
};
