import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {DataRouter, RouterProvider} from 'react-router';
import {Layout} from './root';

export const hydrateTheSite = (router: DataRouter): void => startTransition(() => {
  hydrateRoot(document, <StrictMode><Layout>
    <RouterProvider router={router} onError={error => console.error(error)}/>
  </Layout></StrictMode>);
});
