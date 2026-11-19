import {FC, startTransition, useEffect} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {DataRouter, RouterProvider} from 'react-router';
import {Arrival, arrival, ArrivalDrawn} from '@navigation/arrival';
import {maybe} from '@ryandur/sand';
import {phoneLayout, phoneSheets} from '@page';
import {sheetFields} from '@pages/Gallery/Settings/fields';
import {Site} from './Site';

type RoutedSiteProps = {router: DataRouter; arrived: Arrival};

const RoutedSite: FC<RoutedSiteProps> = ({router, arrived}) => {
  useEffect(() => arrived.follow(router), [arrived, router]);
  return <Site><ArrivalDrawn.Provider value={arrived.drawn}>
    <RouterProvider router={router} onError={error => console.error(error)}/>
  </ArrivalDrawn.Provider></Site>;
};

// CSS can't close a popover when its query stops matching, so the phone's sheets are closed once the phone layout ends
const sheetsClosedWhenThePhoneLayoutEnds = () =>
  phoneLayout(window).ends(() => Object.values(phoneSheets)
    .forEach(sheet => maybe(document.getElementById(sheet)).map(open => open.hidePopover())));

// Android's back gesture closes an open popover before it goes back, so Back and Forward close the gallery's sheet
const gallerySettingsClosedOnBackAndForward = () =>
  window.addEventListener('popstate', () =>
    maybe(document.getElementById(phoneSheets.gallerySettings)).map(sheet => {
      sheetFields.showTheAddress(sheet);
      sheet.hidePopover();
    }));

export const hydrateTheSite = {
  overTheBuiltPage: (router: DataRouter): void => {
    sheetsClosedWhenThePhoneLayoutEnds();
    gallerySettingsClosedOnBackAndForward();
    startTransition(() => {
      hydrateRoot(document,
        <RoutedSite router={router} arrived={arrival(window)}/>);
    });
  },
  afresh: (router: DataRouter): void => {
    sheetsClosedWhenThePhoneLayoutEnds();
    gallerySettingsClosedOnBackAndForward();
    createRoot(document)
      .render(<RoutedSite router={router} arrived={arrival(window)}/>);
  }
};
