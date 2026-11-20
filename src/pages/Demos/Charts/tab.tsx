import {FC} from 'react';
import {useEnvironment} from '@environment';
import {ChartsIntroduction} from './Introduction';
import {Workspace} from './Workspace';
import {ChartsTutorial} from './Tutorial';
import {ChartPage} from './ChartPage';
import {useShownChart} from './useShownChart';
import {PartsAndMinutes} from './PartsAndMinutes';

export const Room: FC = () => {
  const {tradeProduct} = useEnvironment();

  return useShownChart().either(
    kind => <ChartPage kind={kind}/>,
    () => <>
      <ChartsIntroduction/>
      <PartsAndMinutes titled/>
      <Workspace product={tradeProduct}/>
      <ChartsTutorial/>
    </>);
};
