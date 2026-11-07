import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useControls} from './useControls';

export const StackDial: FC<{name: string}> = ({name}) => {
  const {stack, change} = useControls();
  return <PillGlider label="stack"
    name={name}
    options={[
      {display: 'Down', value: 'down'},
      {display: 'Up', value: 'up'},
      {display: 'Left', value: 'left'},
      {display: 'Right', value: 'right'}
    ]}
    chosen={stack}
    onChosen={next => change({stack: next})}/>;
};
