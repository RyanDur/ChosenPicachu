import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useSearchParamsObject} from '@components/search-params';
import {defaultPace, paceParam} from './Controls';

export const PaceDial: FC<{name: string}> = ({name}) => {
  const {pace = defaultPace, updateSearchParams} = useSearchParamsObject({pace: paceParam});
  return <PillGlider label="pace"
    name={name}
    options={[
      {display: 'Eager', value: 'eager'},
      {display: 'Lazy', value: 'lazy'}
    ]}
    chosen={pace}
    onChosen={next => updateSearchParams({pace: next})}/>;
};
