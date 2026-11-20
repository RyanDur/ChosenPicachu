import {FC} from 'react';
import {TabSidecar} from '../TabSidecar';
import {ChartsSize} from './ChartsSize';
import {PartsIndex} from './PartsIndex';

export const PartsAndMinutes: FC<{readonly titled?: boolean}> = ({titled}) =>
  <TabSidecar label="parts and minutes"><ChartsSize/><PartsIndex titled={titled}/></TabSidecar>;
