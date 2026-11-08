import {ReactNode, startTransition, StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {DataRouter, RouterProvider} from 'react-router';
import {Layout} from './root';

const siteOn = (router: DataRouter): ReactNode =>
  <StrictMode><Layout>
    <RouterProvider router={router} onError={error => console.error(error)}/>
  </Layout></StrictMode>;

export const hydrateTheSite = {
  overTheBuiltPage: (router: DataRouter): void => {
    const site = siteOn(router);
    startTransition(() => {
      hydrateRoot(document, site);
    });
  },
  afresh: (router: DataRouter): void => {
    createRoot(document).render(siteOn(router));
  }
};
