import {FC} from 'react';
import {useEnv} from '@page';
import {ChartsIntroduction} from './Introduction';
import {Workspace} from './Workspace';
import {ChartsTutorial} from './Tutorial';

export const Room: FC = () => {
  const {tradeProduct} = useEnv();

  return <>
    <ChartsIntroduction/>
    <Workspace product={tradeProduct}/>
    <ChartsTutorial/>
  </>;
};
