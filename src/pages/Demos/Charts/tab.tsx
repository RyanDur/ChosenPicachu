import {FC} from 'react';
import {useEnv} from '@frame/page';
import {ChartsIntroduction} from './Introduction';
import {Workspace} from './Workspace';
import {ChartsTutorial} from './Tutorial';

const ChartsTab: FC = () => {
  const {tradeProduct} = useEnv();

  return <>
    <ChartsIntroduction/>
    <Workspace product={tradeProduct}/>
    <ChartsTutorial/>
  </>;
};

export default ChartsTab;
