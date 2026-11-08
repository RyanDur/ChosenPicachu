import {FC} from 'react';
import recentTradesSource from '@pages/Demos/Market/recent-trades.ts?sample';
import {Snippet, carve} from '@pages/Demos/Recipe';

export const RecentTradesCarve: FC = () => <Snippet label="TS" lines={carve.unit(recentTradesSource, 'const load')}/>;
