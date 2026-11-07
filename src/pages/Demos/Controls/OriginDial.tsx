import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useControls} from './useControls';

export const OriginDial: FC<{name: string}> = ({name}) => {
  const {origin, change} = useControls();
  return <PillGlider label="origin"
    name={name}
    options={[
      {display: 'Keep', value: 'keep'},
      {display: 'Hide', value: 'hide'}
    ]}
    chosen={origin}
    onChosen={next => change({origin: next})}/>;
};
