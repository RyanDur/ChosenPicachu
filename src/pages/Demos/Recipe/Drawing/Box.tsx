import {FC} from 'react';
import {Sized} from './geometry';
import {Kind, looks} from './looks';

export const Box: FC<Sized & {kind: Kind}> = ({x, y, width, height, kind}) =>
  <rect className={looks.of(kind)} x={x} y={y} width={width} height={height}/>;
