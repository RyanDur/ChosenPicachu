import {FC} from 'react';
import {At} from './looks';

export const Chevron: FC<At & {turn: number}> = ({x, y, turn}) =>
  <polyline className="chevron hollow drawn" points="-10,-10 10,-10 10,10" transform={`translate(${x} ${y}) rotate(${turn})`}/>;
