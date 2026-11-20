import {FC} from 'react';
import {useEnvironment} from '@environment';
import {TabSidecar} from '../TabSidecar';
import {ChartsIntroduction} from './Introduction';
import {ChartsSize} from './ChartsSize';
import {PartsIndex} from './PartsIndex';
import {Workspace} from './Workspace';
import {ChartsTutorial} from './Tutorial';
import {ChartPage} from './ChartPage';
import {useShownChart} from './useShownChart';

const PartsAndMinutes: FC<{readonly titled?: boolean}> = ({titled}) =>
  <TabSidecar label="parts and minutes"><ChartsSize/><PartsIndex titled={titled}/></TabSidecar>;

export const Room: FC = () => {
  const {tradeProduct} = useEnvironment();

  return useShownChart().either(
    kind => <ChartPage kind={kind} panel={<PartsAndMinutes/>}/>,
    () => <>
      <ChartsIntroduction/>
      <PartsAndMinutes titled/>
      <Workspace product={tradeProduct}/>
      <ChartsTutorial/>
    </>);
};
