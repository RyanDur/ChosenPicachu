import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {HomePage} from './component';

const HomeHeader = () => <Header title="Home"/>;

export const Home = {
  path: Paths.home,
  errorElement: <PageError/>,
  handle: {header: HomeHeader},
  element: <HomePage/>
};
