import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useSearchParamsObject} from '@components/search-params';
import {alignParam} from '@components/Banners/params';

export const AlignDial: FC<{name: string}> = ({name}) => {
  const {align = 'center', updateSearchParams} = useSearchParamsObject({align: alignParam});
  return <PillGlider label="align"
                     name={name}
                     options={[
                       {display: 'Left', value: 'left'},
                       {display: 'Center', value: 'center'},
                       {display: 'Right', value: 'right'}
                     ]}
                     chosen={align}
                     onChoose={next => updateSearchParams({align: next})}/>;
};
