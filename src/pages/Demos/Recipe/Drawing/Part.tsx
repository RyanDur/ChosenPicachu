import {FC} from 'react';
import {Kind, Sized} from './looks';
import {Box} from './Box';

export const Part: FC<Sized & {kind: Kind; name: string}> = ({name, ...box}) => <>
  <Box {...box}/>
  <text className="drawn-caption" x={box.x + box.width / 2} y={box.y + box.height / 2 + 4} textAnchor="middle">{name}</text>
</>;
