import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {useSearchParamsObject} from '@components/search-params';
import {motionParam} from './Controls';

export const MotionDial: FC<{name: string}> = ({name}) => {
  const {motion = 'animated', updateSearchParams} = useSearchParamsObject({motion: motionParam});
  return <PillGlider label="motion"
                     name={name}
                     options={[
                       {display: 'Animate', value: 'animated'},
                       {display: 'Static', value: 'static'}
                     ]}
                     chosen={motion}
                     onChoose={next => updateSearchParams({motion: next})}/>;
};
