import {Outlet} from 'react-router';
import {Suspense} from 'react';
import {SideNav} from './pages/BasePage/SideNav';
import {About, Gallery, Games, Home, Users} from './pages';

export const router = {
  path: '/',
  element: <>
    <Suspense fallback={null}>
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
