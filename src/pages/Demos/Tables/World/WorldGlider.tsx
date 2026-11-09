import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useControls} from '../../Controls';

export const WorldGlider: FC = () => {
  const {world, change} = useControls();
  return <PillGlider label="world"
    name="table-world"
    choices={[
      {words: 'React', value: 'react'},
      {words: 'Vanilla', value: 'vanilla'}
    ]}
    chosen={world}
    onChosen={next => change({world: next})}/>;
};
