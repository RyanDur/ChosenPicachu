import {FC} from 'react';
import {Link, Navigate, useParams} from 'react-router';
import {useEnv} from '@components/Env';
import {Paths} from '@pages/Paths';
import {StoryList} from '../Recipe';
import {DemoTopics} from '../types';
import {useLiveTrades} from './useLiveTrades';
import {PriceChart} from './PriceChart';
import {Candles} from './Candles';
import {candlesStory, priceStory} from './Tutorial';
import '../Recipe/Recipe.css';

export const ChartPage: FC = () => {
  const {kind} = useParams();
  const {tradeFeed, tradeProduct} = useEnv();
  const liveTrades = useLiveTrades(tradeFeed, tradeProduct);
  if (kind !== 'price' && kind !== 'candles') {
    return <Navigate to={`${Paths.demos}?tab=${DemoTopics.charts}`} replace/>;
  }
  const name = kind === 'price' ? 'price line' : 'candles';
  return <div className="tutorials">
    <Link className="signpost" to={`${Paths.demos}?tab=${DemoTopics.charts}`}>
      back to the workspace
    </Link>
    {kind === 'price'
      ? <PriceChart trades={liveTrades.trades}/>
      : <Candles trades={liveTrades.trades}/>}
    <section aria-label={`build the ${name} yourself`} className="build-steps">
      <StoryList param="graph" stories={[kind === 'price' ? priceStory : candlesStory]}/>
    </section>
  </div>;
};
