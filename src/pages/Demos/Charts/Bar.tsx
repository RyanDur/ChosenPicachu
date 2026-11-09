import {FC, PropsWithChildren} from 'react';
import {shapes} from './shapes';
import './shape.css';

const DEPTH_X = 1;
const DEPTH_Y = 1.5;

type Props = {
  x: number;
  top: number;
  width: number;
  height: number;
  className?: string;
};

export const Bar: FC<PropsWithChildren<Props>> = ({x, top, width, height, className, children}) =>
  <g className={className}>
    <rect className="shape side-wall" y={-1} width={1} height={1}
      style={shapes.at({x: x + DEPTH_X, base: top + height + DEPTH_Y, width, height})}/>
    {children}
    <rect className="shape side-face" y={-1} width={1} height={1}
      style={shapes.at({x, base: top + height, width, height})}/>
  </g>;
