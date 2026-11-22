import {FC} from 'react';
import {chartKinds} from './chart-kinds';
import {LeftOut} from './desk';

const sentenceOf = (left: LeftOut): string => left.why === 'unknown'
  ? `“${left.entry}” isn’t a chart.`
  : `${chartKinds.names[left.kind]} was already on the desk.`;

export const LeftOutLine: FC<{readonly id: string; readonly leftOut: readonly LeftOut[]}> = ({id, leftOut}) =>
  <p id={id} className="paragraph"><strong className="bold">What the page left out:</strong> {leftOut.map(sentenceOf).join(' ')}</p>;
