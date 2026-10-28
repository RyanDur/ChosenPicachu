import {FC} from 'react';
import {useParams} from 'react-router';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {PageError} from '@pages/PageError';
import names from '@pages/names.json';
import {isChartKind} from './kinds';
import {Trading} from '../Trading';
import {ChartPage} from './ChartPage';

const ChartsHeader = () => {
  const {kind} = useParams();
  return <Header title="Demos Charts" listed={isChartKind(kind) ? names.charts[kind] : names.demos.charts}/>;
};

export const ErrorBoundary: FC = () => <Page header={<ChartsHeader/>}><PageError/></Page>;

const Room: FC = () => <Page header={<ChartsHeader/>}><Trading><ChartPage/></Trading></Page>;

export default Room;
