import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useSearchParamsObject} from '@components/search-params';
import {originParam} from './Controls';

export const OriginDial: FC<{name: string}> = ({name}) => {
  const {origin = 'hide', updateSearchParams} = useSearchParamsObject({origin: originParam});
  return <PillGlider label="origin"
                     name={name}
                     options={[
                       {display: 'Keep', value: 'keep'},
                       {display: 'Hide', value: 'hide'}
                     ]}
                     chosen={origin}
                     onChoose={next => updateSearchParams({origin: next})}/>;
};
