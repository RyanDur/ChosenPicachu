import {FC} from 'react';
import {Kind, looks, Sized} from './looks';

export const Box: FC<Sized & {kind: Kind}> = ({x, y, width, height, kind}) =>
  <rect className={looks.of(kind)} x={x} y={y} width={width} height={height}/>;
