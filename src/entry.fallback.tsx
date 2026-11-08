import {createBrowserRouter} from 'react-router';
import {lazily, siteOpenedBy} from './routes';
import {hydrateTheSite} from './hydrateTheSite';

hydrateTheSite.afresh(createBrowserRouter([siteOpenedBy(lazily())], {basename: import.meta.env.BASE_URL}));
