import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useControls} from './useControls';

export const PaceDial: FC<{name: string}> = ({name}) => {
  const {pace, change} = useControls();
  return <PillGlider label="pace"
    name={name}
    choices={[
      {words: 'Eager', value: 'eager'},
      {words: 'Lazy', value: 'lazy'}
    ]}
    chosen={pace}
    onChosen={next => change({pace: next})}/>;
};
