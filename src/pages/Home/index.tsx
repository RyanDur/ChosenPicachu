import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {HomePage} from './HomePage';
import names from '@pages/names.json';

const header = <Header title="The three languages" listed={names.home}/>;

export const Home = {
  path: Paths.home,
  errorElement: <Page header={header}><PageError/></Page>,
  element: <Page header={header}><HomePage/></Page>
};
