import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useSearchParamsObject} from '@components/search-params';
import {stackParam} from '@components/Banners/params';

export const StackDial: FC<{name: string}> = ({name}) => {
  const {stack = 'down', updateSearchParams} = useSearchParamsObject({stack: stackParam});
  return <PillGlider label="stack"
                     name={name}
                     options={[
                       {display: 'Down', value: 'down'},
                       {display: 'Up', value: 'up'},
                       {display: 'Left', value: 'left'},
                       {display: 'Right', value: 'right'}
                     ]}
                     chosen={stack}
                     onChoose={next => updateSearchParams({stack: next})}/>;
};
