import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useSearchParamsObject} from '@components/search-params';
import {sideParam} from '@components/Banners/params';

export const SideDial: FC<{name: string}> = ({name}) => {
  const {side = 'top', updateSearchParams} = useSearchParamsObject({side: sideParam});
  return <PillGlider label="side"
                     name={name}
                     options={[
                       {display: 'Top', value: 'top'},
                       {display: 'Middle', value: 'middle'},
                       {display: 'Bottom', value: 'bottom'}
                     ]}
                     chosen={side}
                     onChoose={next => updateSearchParams({side: next})}/>;
};
