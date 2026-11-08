import {ReactNode, startTransition, StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {DataRouter, RouterProvider} from 'react-router';
import * as schema from 'schemawax';
import {maybe} from '@ryandur/sand';
import {Layout} from './root';

const keyed = schema.object({required: {key: schema.string}});

// the router keys a document opened by its address as 'default', so every such document would share one scroll place
const keyTheEntry = (): void => maybe(keyed.decode(window.history.state)).either(
  () => undefined,
  () => window.history.replaceState({...window.history.state, key: crypto.randomUUID()}, ''));

const siteOn = (routerFor: () => DataRouter): ReactNode => {
  keyTheEntry();
  return <StrictMode><Layout>
    <RouterProvider router={routerFor()} onError={error => console.error(error)}/>
  </Layout></StrictMode>;
};

export const hydrateTheSite = {
  overTheBuiltPage: (routerFor: () => DataRouter): void => {
    const site = siteOn(routerFor);
    startTransition(() => {
      hydrateRoot(document, site);
    });
  },
  afresh: (routerFor: () => DataRouter): void => {
    createRoot(document).render(siteOn(routerFor));
  }
};
