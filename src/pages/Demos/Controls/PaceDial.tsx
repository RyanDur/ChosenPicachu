import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useControls} from './useControls';
import {dialChoices} from './dial-choices';

export const PaceDial: FC<{name: string}> = ({name}) => {
  const {pace, change} = useControls();
  return <PillGlider label="pace"
    name={name}
    choices={dialChoices.pace}
    chosen={pace}
    onChosen={next => change({pace: next})}/>;
};
