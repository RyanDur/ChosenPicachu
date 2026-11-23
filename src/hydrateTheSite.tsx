import {FC, startTransition, useEffect} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {DataRouter, RouterProvider} from 'react-router';
import {Arrival, arrival, ArrivalDrawn} from '@navigation/arrival';
import {PageFocus, PagePaints, popovers} from '@page';
import {galleryForms} from '@pages/Gallery';
import {Site} from './Site';

type RoutedSiteProps = {router: DataRouter; arrived: Arrival};

const RoutedSite: FC<RoutedSiteProps> = ({router, arrived}) => {
  useEffect(() => arrived.follow(router), [arrived, router]);
  return <Site><ArrivalDrawn.Provider value={arrived.drawn}>
    <PageFocus.Provider value={() => document.hasFocus()}>
      <PagePaints.Provider value={window}>
        <RouterProvider router={router} onError={error => console.error(error)}/>
      </PagePaints.Provider>
    </PageFocus.Provider>
  </ArrivalDrawn.Provider></Site>;
};

export const hydrateTheSite = {
  overTheBuiltPage: (router: DataRouter): void => {
    popovers(window).closedWhenThePhoneLayoutEnds();
    popovers(window).closedOnBackAndForward();
    galleryForms(window).putBackOnBackAndForward();
    startTransition(() => {
      hydrateRoot(document,
        <RoutedSite router={router} arrived={arrival(window)}/>);
    });
  },
  afresh: (router: DataRouter): void => {
    popovers(window).closedWhenThePhoneLayoutEnds();
    popovers(window).closedOnBackAndForward();
    galleryForms(window).putBackOnBackAndForward();
    createRoot(document)
      .render(<RoutedSite router={router} arrived={arrival(window)}/>);
  }
};
