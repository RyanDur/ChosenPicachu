import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useControls} from './useControls';

export const EntranceDial: FC<{name: string}> = ({name}) => {
  const {enter, change} = useControls();
  return <PillGlider label="entrance"
    name={name}
    choices={[
      {words: 'Above', value: 'above'},
      {words: 'Below', value: 'below'},
      {words: 'Left', value: 'left'},
      {words: 'Right', value: 'right'}
    ]}
    chosen={enter}
    onChosen={next => change({enter: next})}/>;
};
