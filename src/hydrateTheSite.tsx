import {FC, PropsWithChildren, startTransition, StrictMode, useEffect} from 'react';
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

// a sibling beside the router would move every useId under it away from the ids the build wrote, so it wraps it
const Drawn: FC<PropsWithChildren<{then: () => void}>> = ({then, children}) => {
  useEffect(then, [then]);
  return children;
};

export const hydrateTheSite = (routerFor: () => DataRouter, drawn: () => void = () => undefined): void => {
  keyTheEntry();
  const router = routerFor();
  startTransition(() => {
    hydrateRoot(document, <StrictMode><Layout>
      <Drawn then={drawn}><RouterProvider router={router} onError={error => console.error(error)}/></Drawn>
    </Layout></StrictMode>);
  });
};
