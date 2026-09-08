import {FC} from 'react';
import {maybe} from '@ryandur/sand';
import {Landed, moveReport} from './report';

export const MoveReport: FC<{landed?: Landed}> = ({landed}) =>
    <output className="move-report off-screen">{maybe(landed).map(moveReport).orElse('')}</output>;
