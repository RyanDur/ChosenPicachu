import {FC} from 'react';
import {has} from '@ryandur/sand';
import {chartKinds} from './chart-kinds';
import {LeftOut} from './desk';
import {useDesk} from './useDesk';

const sentenceOf = (omission: LeftOut): string => {
  switch (omission.why) {
    case 'unknown':
      return `“${omission.entry}” isn’t a chart.`;
    case 'repeat':
      return `${chartKinds.names[omission.kind]} was already on the desk.`;
    case 'unknown period':
      return `${chartKinds.names[omission.kind]} has no “${omission.period}” period, so it shows the hour.`;
    case 'no periods':
      return `${chartKinds.names[omission.kind]} has no periods.`;
    case 'none seated':
      return 'No chart was left, so the page shows the price line.';
  }
};

export const LeftOutLine: FC = () => {
  const {leftOut} = useDesk();
  return has(leftOut) && <p className="paragraph">
    <strong className="bold">What the page left out:</strong> {leftOut.map(sentenceOf).join(' ')}
  </p>;
};
