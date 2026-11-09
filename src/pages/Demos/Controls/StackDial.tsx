import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useControls} from './useControls';

export const StackDial: FC<{name: string}> = ({name}) => {
  const {stack, change} = useControls();
  return <PillGlider label="stack"
    name={name}
    choices={[
      {words: 'Down', value: 'down'},
      {words: 'Up', value: 'up'},
      {words: 'Left', value: 'left'},
      {words: 'Right', value: 'right'}
    ]}
    chosen={stack}
    onChosen={next => change({stack: next})}/>;
};
