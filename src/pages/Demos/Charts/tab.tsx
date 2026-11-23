import {FC} from 'react';
import {useEnvironment} from '@environment';
import {PartsBeside} from '../PartsBeside';
import {ChartsIntroduction} from './Introduction';
import {Workspace} from './Workspace';
import {ChartsTutorial} from './Tutorial';
import {ChartPage} from './ChartPage';
import {useShownChart} from './useShownChart';

export const Room: FC = () => {
  const {tradeProduct} = useEnvironment();

  return useShownChart().either(
    kind => <ChartPage kind={kind}/>,
    () => <PartsBeside>
      <ChartsIntroduction/>
      <Workspace product={tradeProduct}/>
      <ChartsTutorial/>
    </PartsBeside>);
};
