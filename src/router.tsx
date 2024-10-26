import {Outlet} from 'react-router-dom';
import {SideNav} from './routes/BasePage/SideNav';
import {About, Gallery, Games, Home, Users} from './components';

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
