import {FC, startTransition, useEffect} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {DataRouter, RouterProvider} from 'react-router';
import {Site} from './Site';

type RoutedSiteProps = {router: DataRouter; onDrawn: () => () => void};

const RoutedSite: FC<RoutedSiteProps> = ({router, onDrawn}) => {
  useEffect(onDrawn, [onDrawn]);
  return <Site><RouterProvider router={router} onError={error => console.error(error)}/></Site>;
};

export const hydrateTheSite = {
  overTheBuiltPage: (router: DataRouter, onDrawn: () => () => void): void => {
    startTransition(() => {
      hydrateRoot(document, <RoutedSite router={router} onDrawn={onDrawn}/>);
    });
  },
  afresh: (router: DataRouter, onDrawn: () => () => void): void => {
    createRoot(document).render(<RoutedSite router={router} onDrawn={onDrawn}/>);
  }
};
