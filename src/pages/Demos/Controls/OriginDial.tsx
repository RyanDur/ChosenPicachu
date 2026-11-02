import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useSearchParamsObject} from '@components/search-params';
import {defaultDials, originParam} from './Controls';

export const OriginDial: FC<{name: string}> = ({name}) => {
  const {origin, updateSearchParams} = useSearchParamsObject({origin: originParam}, defaultDials);
  return <PillGlider label="origin"
    name={name}
    options={[
      {display: 'Keep', value: 'keep'},
      {display: 'Hide', value: 'hide'}
    ]}
    chosen={origin}
    onChosen={next => updateSearchParams({origin: next})}/>;
};
