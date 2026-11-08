import {FC} from 'react';
import {useParams} from 'react-router';
import {Header, Page, PageError} from '@page';
import names from '@navigation/names.json';
import {isChartKind} from './kinds';
import {Trading} from '../Market/Trading';
import {ChartPage} from './ChartPage';

const ChartsHeader = () => {
  const {kind} = useParams();
  return <Header title="Demos Charts" listed={isChartKind(kind) ? names.charts[kind] : names.demos.charts}/>;
};

export const ErrorBoundary: FC = () => <Page header={<ChartsHeader/>}><PageError/></Page>;

export const Room: FC = () => <Page header={<ChartsHeader/>}><Trading><ChartPage/></Trading></Page>;
