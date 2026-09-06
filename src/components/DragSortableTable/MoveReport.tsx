import {FC} from 'react';
import {maybe} from '@ryandur/sand';
import {useSelector} from './context';
import {moveReport} from './table-state';

export const MoveReport: FC = () => {
    const landed = useSelector(state => state.landed);

    return <output className="move-report off-screen">{maybe(landed).map(moveReport).orElse('')}</output>;
};
