import {createBrowserRouter} from 'react-router';
import * as ReactDom from 'react-dom/client';
import {App} from './App';
import {router} from './router';
import {env} from '@env';
import {asyncResult, asyncSuccess, is, maybe, Result} from '@ryandur/sand';
import './index.css';

const controlled = (workers: ServiceWorkerContainer): Promise<unknown> =>
  maybe(workers.controller, is)
    .map(controller => Promise.resolve(controller))
    .orElse(new Promise(resolve => workers.addEventListener('controllerchange', resolve, {once: true})));

const served = (): Result.Async<unknown, unknown> =>
  maybe(navigator.serviceWorker, is)
    .map(workers => asyncResult<unknown, unknown>(controlled(workers)))
    .orElse(asyncSuccess(undefined));

served().onSuccess(() => ReactDom.createRoot(document.getElementById('root')!).render(
  <App
    router={createBrowserRouter([router], {basename: import.meta.env.BASE_URL})}
    onError={error => console.error(error)}
    env={env}/>
));
