import {StrictMode} from 'react';
import {createBrowserRouter} from 'react-router';
import {RouterProvider} from 'react-router/dom';
import * as ReactDom from 'react-dom/client';
import {EnvProvider} from '@components/Env';
import {router} from './router';
import './index.css';

ReactDom.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EnvProvider>
      <RouterProvider router={createBrowserRouter([router], {basename: import.meta.env.BASE_URL})}/>
    </EnvProvider>
  </StrictMode>
);
