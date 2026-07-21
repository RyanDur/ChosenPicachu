import {Outlet} from 'react-router-dom';
import {SideNav} from './pages/BasePage/SideNav';
import {About, Gallery, Games, Home, Users} from './pages';

export const router = {
  path: '/',
  element: <>
    <Outlet/>
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
