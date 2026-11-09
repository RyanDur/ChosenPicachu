import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useControls} from './useControls';

export const SideDial: FC<{name: string}> = ({name}) => {
  const {side, change} = useControls();
  return <PillGlider label="side"
    name={name}
    choices={[
      {words: 'Top', value: 'top'},
      {words: 'Middle', value: 'middle'},
      {words: 'Bottom', value: 'bottom'}
    ]}
    chosen={side}
    onChosen={next => change({side: next})}/>;
};
