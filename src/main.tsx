import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {AboutPage, HomePage, UsersPage} from './routes';
import * as ReactDom from "react-dom/client";
import {StrictMode} from "react";
import {Paths} from './routes/Paths';
import {Gallery} from './components/Gallery';
import './index.css';

const router = createBrowserRouter([
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
]);

ReactDom.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);
