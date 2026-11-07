import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useWorld} from './useWorld';

export const WorldGlider: FC = () => {
  const {world, updateSearchParams} = useWorld();
  return <PillGlider label="world"
    name="table-world"
    options={[
      {display: 'React', value: 'react'},
      {display: 'Vanilla', value: 'vanilla'}
    ]}
    chosen={world}
    onChosen={next => updateSearchParams({world: next})}/>;
};
