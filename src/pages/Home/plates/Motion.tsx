import {FC} from 'react';
import {MotionKind} from './thePage';

type Drawn = {cx: number; cy: number; radius: number; ellipseRatio: number};

type Moving = FC<Drawn>;

const Turning: Moving = ({cx: x, cy: y, radius, ellipseRatio}) => <>
  <ellipse className="drawn-line markup-attribute-drawn hollow dotted-drawn" cx={x} cy={y} rx={radius * 3}
    ry={radius * 3 * ellipseRatio}/>
  <path className="drawn-line markup-attribute-drawn hollow" markerEnd="url(#page-turn-head)"
    d={`M ${x - radius * 2.2} ${y + radius * 0.6} A ${radius * 2.2} ${radius * 2.2} 0 0 1 ${x + radius * 0.4} ${y - radius * 2.2}`}/>
</>;

const Rippling: Moving = ({cx: x, cy: y, radius, ellipseRatio}) => <>
  <ellipse className="drawn-line markup-attribute-drawn hollow" cx={x} cy={y} rx={radius * 2.4}
    ry={radius * 2.4 * ellipseRatio}/>
  <ellipse className="drawn-line markup-attribute-drawn hollow dotted-drawn" cx={x} cy={y} rx={radius * 4}
    ry={radius * 4 * ellipseRatio}/>
</>;

const motions: Record<MotionKind, Moving> = {turning: Turning, rippling: Rippling};

export const Motion: FC<Drawn & {kind: MotionKind}> = ({kind, ...drawn}) => {
  const Moves = motions[kind];
  return <Moves {...drawn}/>;
};
