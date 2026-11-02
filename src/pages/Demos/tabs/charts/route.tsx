import {FC} from 'react';
import {useEnv} from '@components/Env';
import {ChartsIntroduction} from '../../Charts/Introduction';
import {Workspace} from '../../Charts/Workspace';
import {ChartsTutorial} from '../../Charts/Tutorial';

const ChartsTab: FC = () => {
  const {tradeProduct} = useEnv();

  return <>
    <ChartsIntroduction/>
    <Workspace product={tradeProduct}/>
    <ChartsTutorial/>
  </>;
};

export default ChartsTab;
