import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useControls} from './useControls';
import {dialChoices} from './dial-choices';

export const MotionDial: FC<{name: string}> = ({name}) => {
  const {motion, change} = useControls();
  return <PillGlider label="motion"
    name={name}
    choices={dialChoices.motion}
    chosen={motion}
    onChosen={next => change({motion: next})}/>;
};
