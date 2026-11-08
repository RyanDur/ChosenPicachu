import {startTransition} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {DataRouter, RouterProvider} from 'react-router';
import {Site} from './Site';

export const hydrateTheSite = {
  overTheBuiltPage: (router: DataRouter): void => {
    startTransition(() => {
      hydrateRoot(document, <Site><RouterProvider router={router} onError={error => console.error(error)}/></Site>);
    });
  },
  afresh: (router: DataRouter): void => {
    createRoot(document).render(<Site><RouterProvider router={router} onError={error => console.error(error)}/></Site>);
  }
};
