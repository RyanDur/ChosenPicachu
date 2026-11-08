import {FC, startTransition} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {DataRouter, RouterProvider} from 'react-router';
import {Site} from './Site';

const RoutedSite: FC<{router: DataRouter}> = ({router}) =>
  <Site><RouterProvider router={router} onError={error => console.error(error)}/></Site>;

export const hydrateTheSite = {
  overTheBuiltPage: (router: DataRouter): void => {
    startTransition(() => {
      hydrateRoot(document, <RoutedSite router={router}/>);
    });
  },
  afresh: (router: DataRouter): void => {
    createRoot(document).render(<RoutedSite router={router}/>);
  }
};
