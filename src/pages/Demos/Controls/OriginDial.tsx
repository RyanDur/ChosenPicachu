import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useControls} from './useControls';

export const OriginDial: FC<{name: string}> = ({name}) => {
  const {origin, change} = useControls();
  return <PillGlider label="origin"
    name={name}
    choices={[
      {words: 'Keep', value: 'keep'},
      {words: 'Hide', value: 'hide'}
    ]}
    chosen={origin}
    onChosen={next => change({origin: next})}/>;
};
