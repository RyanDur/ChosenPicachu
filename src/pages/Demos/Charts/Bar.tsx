import {FC, PropsWithChildren} from 'react';
import {shapes} from './shapes';
import './shape.css';

const DEPTH_X = 1;
const DEPTH_Y = 1.5;

type Props = {
  x: number;
  foot: number;
  width: number;
  height: number;
  className?: string;
};

export const Bar: FC<PropsWithChildren<Props>> = ({x, foot, width, height, className, children}) =>
  <g className={className}>
    <rect className="shape side-wall" y={-1} width={1} height={1}
      style={shapes.placed({x: x + DEPTH_X, foot: foot + DEPTH_Y, width, height})}/>
    {children}
    <rect className="shape side-face" y={-1} width={1} height={1}
      style={shapes.placed({x, foot, width, height})}/>
  </g>;
