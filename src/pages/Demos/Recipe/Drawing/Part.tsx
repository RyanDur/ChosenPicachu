import {FC} from 'react';
import {Sized} from './geometry';
import {Kind} from './looks';
import {Box} from './Box';

export const Part: FC<Sized & {kind: Kind; name: string}> = ({name, x, y, width, height, kind}) => <>
  <Box x={x} y={y} width={width} height={height} kind={kind}/>
  <text className="drawn-caption" x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle">{name}</text>
</>;
