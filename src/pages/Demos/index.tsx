import {PageError} from '@pages/PageError';
import {DemosPage} from './DemosPage';
import {Trading} from './Trading';
import {ChartPage} from './Charts/ChartPage';

export const TradingFloor = {
  errorElement: <PageError/>,
  element: <Trading/>
};

export const Demos = {
  errorElement: <PageError/>,
  element: <DemosPage/>
};

export const ChartTutorial = {
  errorElement: <PageError/>,
  element: <ChartPage/>
};
