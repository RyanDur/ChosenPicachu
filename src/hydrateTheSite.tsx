import {FC, startTransition, useEffect} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {DataRouter, RouterProvider} from 'react-router';
import {Arrival, arrival, ArrivalDrawn} from '@navigation/arrival';
import {PageFocus, phoneLayout} from '@page';
import {Site} from './Site';

type RoutedSiteProps = {router: DataRouter; arrived: Arrival};

const RoutedSite: FC<RoutedSiteProps> = ({router, arrived}) => {
  useEffect(() => arrived.follow(router), [arrived, router]);
  return <Site><ArrivalDrawn.Provider value={arrived.drawn}>
    <PageFocus.Provider value={() => document.hasFocus()}>
      <RouterProvider router={router} onError={error => console.error(error)}/>
    </PageFocus.Provider>
  </ArrivalDrawn.Provider></Site>;
};

const openIn = (selector: string): HTMLElement[] => [...document.querySelectorAll<HTMLElement>(selector)];

const typedValuesDropped = (open: HTMLElement): void =>
  open.querySelectorAll('input').forEach(field => field.value = field.defaultValue);

// CSS can't close a popover when its query stops matching, so the phone's sheets are closed once the phone layout ends
const sheetsClosedWhenThePhoneLayoutEnds = () =>
  phoneLayout(window).ends(() => openIn('.phone-sheet:popover-open').forEach(sheet => {
    typedValuesDropped(sheet);
    sheet.hidePopover();
  }));

// Android's back gesture closes an open popover before it goes back, so Back and Forward close whatever is open
const popoversClosedOnBackAndForward = () =>
  window.addEventListener('popstate', () => openIn(':popover-open').forEach(open => {
    typedValuesDropped(open);
    open.hidePopover();
  }));

export const hydrateTheSite = {
  overTheBuiltPage: (router: DataRouter): void => {
    sheetsClosedWhenThePhoneLayoutEnds();
    popoversClosedOnBackAndForward();
    startTransition(() => {
      hydrateRoot(document,
        <RoutedSite router={router} arrived={arrival(window)}/>);
    });
  },
  afresh: (router: DataRouter): void => {
    sheetsClosedWhenThePhoneLayoutEnds();
    popoversClosedOnBackAndForward();
    createRoot(document)
      .render(<RoutedSite router={router} arrived={arrival(window)}/>);
  }
};
