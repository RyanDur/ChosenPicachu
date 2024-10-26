import {StrictMode} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import * as ReactDom from 'react-dom/client';
import {router} from './router';
import './index.css';

ReactDom.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={createBrowserRouter([router])}/>
  </StrictMode>
);
