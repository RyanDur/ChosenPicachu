import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {lazy} from 'react';

const AboutPage = lazy(() => import('./component').then(m => ({default: m.AboutPage})));

export const About = {
  path: Paths.about,
  errorElement: <PageError/>,
  element: <AboutPage/>
};