import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useControls} from '../../Controls';

export const WorldGlider: FC = () => {
  const {world, change} = useControls();
  return <PillGlider label="world"
    name="table-world"
    options={[
      {display: 'React', value: 'react'},
      {display: 'Vanilla', value: 'vanilla'}
    ]}
    chosen={world}
    onChosen={next => change({world: next})}/>;
};
