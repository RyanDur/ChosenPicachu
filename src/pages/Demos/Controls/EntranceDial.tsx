import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useSearchParamsObject} from '@components/search-params';
import {enterParam} from '@components/Banners/params';

export const EntranceDial: FC<{name: string}> = ({name}) => {
  const {enter = 'above', updateSearchParams} = useSearchParamsObject({enter: enterParam});
  return <PillGlider label="entrance"
                     name={name}
                     options={[
                       {display: 'Above', value: 'above'},
                       {display: 'Below', value: 'below'},
                       {display: 'Left', value: 'left'},
                       {display: 'Right', value: 'right'}
                     ]}
                     chosen={enter}
                     onChoose={next => updateSearchParams({enter: next})}/>;
};
