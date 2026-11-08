import {FC} from 'react';
import {useEnvironment} from '@environment';
import {ChartsIntroduction} from './Introduction';
import {Workspace} from './Workspace';
import {ChartsTutorial} from './Tutorial';

export const Room: FC = () => {
  const {tradeProduct} = useEnvironment();

  return <>
    <ChartsIntroduction/>
    <Workspace product={tradeProduct}/>
    <ChartsTutorial/>
  </>;
};
