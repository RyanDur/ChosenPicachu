import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useControls} from './useControls';
import {dialChoices} from './dial-choices';

export const OriginDial: FC<{name: string}> = ({name}) => {
  const {origin, change} = useControls();
  return <PillGlider label="origin"
    name={name}
    choices={dialChoices.origin}
    chosen={origin}
    onChosen={next => change({origin: next})}/>;
};
