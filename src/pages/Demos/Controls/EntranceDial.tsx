import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useControls} from './useControls';

export const EntranceDial: FC<{name: string}> = ({name}) => {
  const {enter, change} = useControls();
  return <PillGlider label="entrance"
    name={name}
    options={[
      {display: 'Above', value: 'above'},
      {display: 'Below', value: 'below'},
      {display: 'Left', value: 'left'},
      {display: 'Right', value: 'right'}
    ]}
    chosen={enter}
    onChosen={next => change({enter: next})}/>;
};
