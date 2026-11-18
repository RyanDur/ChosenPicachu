import {FC, startTransition, useEffect} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {DataRouter, RouterProvider} from 'react-router';
import {Arrival, arrival, ArrivalDrawn} from '@navigation/arrival';
import {PhoneLayout, phoneLayout, ThePhoneLayout} from '@page';
import {Site} from './Site';

type RoutedSiteProps = {router: DataRouter; arrived: Arrival; layout: PhoneLayout};

const RoutedSite: FC<RoutedSiteProps> = ({router, arrived, layout}) => {
  useEffect(() => arrived.follow(router), [arrived, router]);
  return <Site><ArrivalDrawn.Provider value={arrived.drawn}><ThePhoneLayout.Provider value={layout}>
    <RouterProvider router={router} onError={error => console.error(error)}/>
  </ThePhoneLayout.Provider></ArrivalDrawn.Provider></Site>;
};

export const hydrateTheSite = {
  overTheBuiltPage: (router: DataRouter): void => {
    startTransition(() => {
      hydrateRoot(document,
        <RoutedSite router={router} arrived={arrival(window)} layout={phoneLayout(window)}/>);
    });
  },
  afresh: (router: DataRouter): void => {
    createRoot(document)
      .render(<RoutedSite router={router} arrived={arrival(window)} layout={phoneLayout(window)}/>);
  }
};
