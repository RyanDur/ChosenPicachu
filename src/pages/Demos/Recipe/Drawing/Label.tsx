import {FC} from 'react';
import {At} from './looks';

export const Label: FC<At & {children: string; anchor?: 'start' | 'middle' | 'end'}> = ({x, y, anchor = 'middle', children}) =>
  <text className="drawn-caption" x={x} y={y} textAnchor={anchor}>{children}</text>;
