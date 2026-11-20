import {FC} from 'react';
import {Ellipse} from './Ellipse';

export const Rippling: FC<Ellipse> = ({cx, cy, rx, ry}) => <>
  <ellipse className="drawn-line markup-attribute-drawn hollow" cx={cx} cy={cy} rx={rx * 2.4} ry={ry * 2.4}/>
  <ellipse className="drawn-line markup-attribute-drawn hollow dotted-drawn" cx={cx} cy={cy} rx={rx * 4} ry={ry * 4}/>
</>;
