import {StrictMode} from 'react';
import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom';
import * as ReactDom from 'react-dom/client';
import {HomePage, UsersPage} from './routes';
import {AboutPage, Gallery} from './components';
import {Paths} from './routes/Paths';
import {SideNav} from './routes/BasePage/SideNav';
import './index.css';

const router = createBrowserRouter([{
  path: '/',
  element: <>
    <Outlet/>
    <SideNav/>
  </>,
  children: [
    {
      path: Paths.home,
      element: <HomePage/>
    },
    {
      path: Paths.about,
      element: <AboutPage/>
    },
    {
      path: Paths.users,
      element: <UsersPage/>
    },
    Gallery
  ]
}]);

ReactDom.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);
