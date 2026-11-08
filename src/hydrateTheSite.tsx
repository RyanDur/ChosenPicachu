import {FC, startTransition, StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {DataRouter, RouterProvider} from 'react-router';
import {Layout} from './root';

const Site: FC<{router: DataRouter}> = ({router}) =>
  <StrictMode><Layout>
    <RouterProvider router={router} onError={error => console.error(error)}/>
  </Layout></StrictMode>;

export const hydrateTheSite = {
  overTheBuiltPage: (router: DataRouter): void => {
    const site = <Site router={router}/>;
    startTransition(() => {
      hydrateRoot(document, site);
    });
  },
  afresh: (router: DataRouter): void => {
    createRoot(document).render(<Site router={router}/>);
  }
};
