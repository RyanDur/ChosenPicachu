import {FC} from 'react';
import {chartKinds} from './chart-kinds';

export const ChartsSize: FC = () =>
  <p className="paragraph">{`Four parts, about ${chartKinds.minutes} minutes.`}</p>;
