import {FC} from 'react';
import {classNames} from '@components';
import {Box} from './edges';

const inset = 9;

export const DrawnBox: FC<{box: Box; look: string}> = ({box: {label, x, y, width, height}, look}) => <>
  <rect className={classNames('drawn-line', look)} x={x} y={y} width={width} height={height}/>
  <text className="drawn-caption" x={x + inset} y={y + inset} dominantBaseline="hanging">{label}</text>
</>;
