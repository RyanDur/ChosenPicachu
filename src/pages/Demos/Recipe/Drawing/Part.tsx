import {FC} from 'react';
import {Sized} from './geometry';
import {Kind, looks} from './looks';

export const Part: FC<Sized & {kind: Kind; name: string}> = ({name, x, y, width, height, kind}) => <>
  <rect className={looks.worn(kind)} x={x} y={y} width={width} height={height}/>
  <text className="drawn-caption" x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle">{name}</text>
</>;
