import {FC} from 'react';
import {useEnvironment} from '@environment';
import {TabSidecar} from '../TabSidecar';
import {ChartsIntroduction} from './Introduction';
import {ChartsSize} from './ChartsSize';
import {PartsIndex} from './PartsIndex';
import {Workspace} from './Workspace';
import {ChartsTutorial} from './Tutorial';

export const Room: FC = () => {
  const {tradeProduct} = useEnvironment();

  return <>
    <ChartsIntroduction/>
    <TabSidecar label="parts and minutes"><ChartsSize/><PartsIndex titled/></TabSidecar>
    <Workspace product={tradeProduct}/>
    <ChartsTutorial/>
  </>;
};
