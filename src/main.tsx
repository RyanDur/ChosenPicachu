import {createBrowserRouter} from 'react-router';
import * as ReactDom from 'react-dom/client';
import {maybe} from '@ryandur/sand';
import {App} from './App';
import {router} from './router';
import {env} from '@env';
import './index.css';

const mounted = (root: Element): void => ReactDom.createRoot(root).render(
  <App
    router={createBrowserRouter([router], {basename: import.meta.env.BASE_URL})}
    onError={error => console.error(error)}
    env={env}
  />
);

maybe(document.getElementById('root'))
  .toResult('nothing to mount the app on')
  .onSuccess(mounted)
  .onFailure(error => console.error(error));
