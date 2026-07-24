import {Outlet} from 'react-router';
import {Suspense} from 'react';
import {SideNav} from './pages/BasePage/SideNav';
import {Loading} from '@components/art-gallery/Loading';
import {About, Gallery, Games, Home, Users} from './pages';

export const router = {
  path: '/',
  element: <>
    <Suspense fallback={<Loading testId="page-loading"/>}>
      <Outlet/>
    </Suspense>
    <SideNav/>
  </>,
  children: [
    Home,
    About,
    Users,
    Gallery,
    Games
  ]
};
