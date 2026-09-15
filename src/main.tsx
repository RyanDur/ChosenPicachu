import {createBrowserRouter} from 'react-router';
import * as ReactDom from 'react-dom/client';
import {App} from './App';
import {router} from './router';
import {env} from '@env';
import './index.css';

const served = (): Promise<void> =>
  !('serviceWorker' in navigator) || navigator.serviceWorker.controller !== null
    ? Promise.resolve()
    : new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), {once: true}));

void served()
  .then(() => ReactDom.createRoot(document.getElementById('root')!).render(
    <App
      router={createBrowserRouter([router], {basename: import.meta.env.BASE_URL})}
      onError={error => console.error(error)}
      env={env}/>
  ));
