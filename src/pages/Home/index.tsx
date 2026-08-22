import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {HomePage} from './component';

const HomeHeader = () => <Header title="The three languages"/>;

export const Home = {
  path: Paths.home,
  errorElement: <PageError/>,
  handle: {header: HomeHeader, mainClassName: 'in-view'},
  element: <HomePage/>
};
