import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {DataRouter, RouterProvider} from 'react-router';
import * as schema from 'schemawax';
import {maybe} from '@ryandur/sand';
import {Layout} from './root';

const keyed = schema.object({required: {key: schema.string}});

// the router keys a document opened by its address as 'default', so every such document would share one scroll place
const keyTheEntry = (): void => maybe(keyed.decode(window.history.state)).either(
  () => window.history.replaceState({...window.history.state, key: crypto.randomUUID()}, ''),
  () => undefined);

export const hydrateTheSite = (routerFor: () => DataRouter): void => {
  keyTheEntry();
  const router = routerFor();
  startTransition(() => {
    hydrateRoot(document, <StrictMode><Layout>
      <RouterProvider router={router} onError={error => console.error(error)}/>
    </Layout></StrictMode>);
  });
};
