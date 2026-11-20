import {FC} from 'react';
import {Ellipse} from './Ellipse';

export const Turning: FC<Ellipse> = ({cx, cy, rx, ry}) => <>
  <ellipse className="drawn-line markup-attribute-drawn hollow dotted-drawn" cx={cx} cy={cy} rx={rx * 3} ry={ry * 3}/>
  <path className="drawn-line markup-attribute-drawn hollow" markerEnd="url(#page-turn-head)"
    d={`M ${cx - rx * 2.2} ${cy + rx * 0.6} A ${rx * 2.2} ${rx * 2.2} 0 0 1 ${cx + rx * 0.4} ${cy - rx * 2.2}`}/>
</>;
