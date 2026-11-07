import {FC} from 'react';
import {Kind, looks} from './looks';

export const Circle: FC<{cx: number; cy: number; r: number; kind: Kind}> = ({kind, ...circle}) =>
  <circle className={looks.of(kind)} {...circle}/>;
