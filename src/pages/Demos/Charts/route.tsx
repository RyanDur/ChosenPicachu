import {FC} from 'react';
import {useParams} from 'react-router';
import {Header, Main, PageError} from '@page';
import names from '@navigation/names.json';
import {chartKinds} from './chart-kinds';
import {Trading} from '../Market/Trading';
import {ChartPage} from './ChartPage';

const ChartsHeader: FC = () => {
  const {kind} = useParams();
  return <Header title="Demos Charts" listed={chartKinds.is(kind) ? names.charts[kind] : names.demos.charts}/>;
};

export const ErrorBoundary: FC = () => <><ChartsHeader/><Main><PageError/></Main></>;

export const Room: FC = () => <><ChartsHeader/><Main><Trading><ChartPage/></Trading></Main></>;
