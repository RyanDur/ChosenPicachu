import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {useSearchParamsObject} from '@components/search-params';
import {AboutTopics, aboutTopicParam} from './types';
import {lazy} from 'react';

const AboutPage = lazy(() => import('./component').then(m => ({default: m.AboutPage})));

const AboutHeader = () => {
  const {tab} = useSearchParamsObject({tab: aboutTopicParam}, {tab: AboutTopics.accordions});
  return <Header title={`About ${tab}`}/>;
};

export const About = {
  path: Paths.about,
  errorElement: <PageError/>,
  handle: {header: AboutHeader, mainClassName: 'in-view'},
  element: <AboutPage/>
};
