import {FC, startTransition, useEffect} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {DataRouter, RouterProvider} from 'react-router';
import {Arrival, arrival, ArrivalDrawn} from '@navigation/arrival';
import {maybe} from '@ryandur/sand';
import {phoneLayout} from '@page';
import {Site} from './Site';

type RoutedSiteProps = {router: DataRouter; arrived: Arrival};

const RoutedSite: FC<RoutedSiteProps> = ({router, arrived}) => {
  useEffect(() => arrived.follow(router), [arrived, router]);
  return <Site><ArrivalDrawn.Provider value={arrived.drawn}>
    <RouterProvider router={router} onError={error => console.error(error)}/>
  </ArrivalDrawn.Provider></Site>;
};

// CSS can't close a popover when its query stops matching, so the site menu is closed once the phone layout ends
const menuClosedWhenThePhoneLayoutEnds = () =>
  phoneLayout(window).ends(() => maybe(document.getElementById('side-nav')).map(menu => menu.hidePopover()));

export const hydrateTheSite = {
  overTheBuiltPage: (router: DataRouter): void => {
    menuClosedWhenThePhoneLayoutEnds();
    startTransition(() => {
      hydrateRoot(document,
        <RoutedSite router={router} arrived={arrival(window)}/>);
    });
  },
  afresh: (router: DataRouter): void => {
    menuClosedWhenThePhoneLayoutEnds();
    createRoot(document)
      .render(<RoutedSite router={router} arrived={arrival(window)}/>);
  }
};
