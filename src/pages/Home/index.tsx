import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {HomePage} from './HomePage';
import names from '@pages/names.json';

const HomeHeader = () => <Header title="The three languages" named={names.home}/>;

export const Home = {
  path: Paths.home,
  errorElement: <PageError/>,
  handle: {header: HomeHeader, mainClassName: 'in-view'},
  element: <HomePage/>
};
