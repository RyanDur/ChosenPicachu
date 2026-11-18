import {FC, startTransition, useEffect} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {DataRouter, RouterProvider} from 'react-router';
import {Arrival, arrival, ArrivalDrawn} from '@navigation/arrival';
import {PhoneLayoutEnding, PhoneLayoutEnds, phoneLayoutEndsOn} from '@page';
import {Site} from './Site';

type RoutedSiteProps = {router: DataRouter; arrived: Arrival; phoneLayoutEnds: PhoneLayoutEnds};

const RoutedSite: FC<RoutedSiteProps> = ({router, arrived, phoneLayoutEnds}) => {
  useEffect(() => arrived.follow(router), [arrived, router]);
  return <Site><ArrivalDrawn.Provider value={arrived.drawn}><PhoneLayoutEnding.Provider value={phoneLayoutEnds}>
    <RouterProvider router={router} onError={error => console.error(error)}/>
  </PhoneLayoutEnding.Provider></ArrivalDrawn.Provider></Site>;
};

export const hydrateTheSite = {
  overTheBuiltPage: (router: DataRouter): void => {
    startTransition(() => {
      hydrateRoot(document,
        <RoutedSite router={router} arrived={arrival(window)} phoneLayoutEnds={phoneLayoutEndsOn(window)}/>);
    });
  },
  afresh: (router: DataRouter): void => {
    createRoot(document)
      .render(<RoutedSite router={router} arrived={arrival(window)} phoneLayoutEnds={phoneLayoutEndsOn(window)}/>);
  }
};
