import {FC, startTransition, useEffect, useState} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {DataRouter, RouterProvider} from 'react-router';
import {Arrival, arrival, ArrivalDrawn} from '@navigation/arrival';
import {currentLocation} from '@navigation';
import {Site} from './Site';

type RoutedSiteProps = {router: DataRouter; arrived: Arrival};

const RoutedSite: FC<RoutedSiteProps> = ({router, arrived}) => {
  const [readLocation] = useState(() => currentLocation.of(router));
  useEffect(() => arrived.follow(router), [arrived, router]);
  return <Site><ArrivalDrawn.Provider value={arrived.drawn}><currentLocation.Read.Provider value={readLocation}>
    <RouterProvider router={router} onError={error => console.error(error)}/>
  </currentLocation.Read.Provider></ArrivalDrawn.Provider></Site>;
};

export const hydrateTheSite = {
  overTheBuiltPage: (router: DataRouter): void => {
    startTransition(() => {
      hydrateRoot(document, <RoutedSite router={router} arrived={arrival(window)}/>);
    });
  },
  afresh: (router: DataRouter): void => {
    createRoot(document).render(<RoutedSite router={router} arrived={arrival(window)}/>);
  }
};
