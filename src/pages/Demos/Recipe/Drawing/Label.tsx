import {FC, PropsWithChildren} from 'react';
import {At} from './geometry';

export const Label: FC<PropsWithChildren<At & {anchor?: 'start' | 'middle' | 'end'}>> = ({x, y, anchor = 'middle', children}) =>
  <text className="drawn-caption" x={x} y={y} textAnchor={anchor}>{children}</text>;
