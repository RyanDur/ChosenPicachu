import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {HydratedRouter} from 'react-router/dom';

startTransition(() => {
  hydrateRoot(document, <StrictMode><HydratedRouter onError={error => console.error(error)}/></StrictMode>);
});
