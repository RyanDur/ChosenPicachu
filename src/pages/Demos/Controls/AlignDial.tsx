import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useControls} from './useControls';

export const AlignDial: FC<{name: string}> = ({name}) => {
  const {align, change} = useControls();
  return <PillGlider label="align"
    name={name}
    choices={[
      {words: 'Left', value: 'left'},
      {words: 'Center', value: 'center'},
      {words: 'Right', value: 'right'}
    ]}
    chosen={align}
    onChosen={next => change({align: next})}/>;
};
