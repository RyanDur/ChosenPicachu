import {FC} from 'react';
import {useEnvironment} from '@environment';
import {PageWithParts} from '../PageWithParts';
import {ChartsIntroduction} from './Introduction';
import {Workspace} from './Workspace';
import {ChartsTutorial} from './Tutorial';
import {ChartPage} from './ChartPage';
import {useShownChart} from './useShownChart';

export const Room: FC = () => {
  const {tradeProduct} = useEnvironment();

  return useShownChart().either(
    kind => <ChartPage kind={kind}/>,
    () => <PageWithParts>
      <ChartsIntroduction/>
      <Workspace product={tradeProduct}/>
      <ChartsTutorial/>
    </PageWithParts>);
};
