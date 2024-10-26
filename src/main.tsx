import {StrictMode} from 'react';
import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom';
import * as ReactDom from 'react-dom/client';
import {About, Gallery, Home, Users} from './components';
import {SideNav} from './routes/BasePage/SideNav';
import './index.css';

const router = createBrowserRouter([{
  path: '/',
  element: <>
    <Outlet/>
    <SideNav/>
  </>,
  children: [
    Home,
    About,
    Users,
    Gallery
  ]
}]);

ReactDom.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);
