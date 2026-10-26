import {BannerProvider, Banners} from '@components/Banners';
import {Links, NavigationType, Outlet, Scripts, useLocation, useNavigationType} from 'react-router';
import {FC, PropsWithChildren, ReactNode, useEffect, useState} from 'react';
import './index.css';
import './BasePage.css';
import {FeedbackProvider} from '@components/Feedback';
import {PageNameProvider} from '@components/PageName';
import {gotoTopOfPage, ReadersPlaces, readersPlaces} from '@components/scroll';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import names from '@pages/names.json';
import {env} from '@env';
import {SiteProviders} from './SiteProviders';

const base = import.meta.env.BASE_URL;

export const Layout: FC<PropsWithChildren> = ({children}) =>
  <html lang="en">
    <head>
      <meta charSet="UTF-8"/>
      <link rel="icon" type="image/svg+xml" href={`${base}favicon.svg`}/>
      <link rel="preconnect" href="https://www.artic.edu"/>
      <link rel="preconnect" href="https://framemark.vam.ac.uk"/>
      <link rel="preconnect" href="https://api.artic.edu"/>
      <link rel="preconnect" href="https://api.vam.ac.uk"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <script src={`${base}env.js`}/>
      <Links/>
    </head>
    <body>
      <div id="root" className="backdrop">
        <SiteProviders env={env}>{children}</SiteProviders>
      </div>
      <noscript>
        <p>
          Found a mistake, or a better way? Say so on the site’s <a href="https://github.com/RyanDur/ChosenPicachu/discussions">Discussions page on GitHub</a>.
        </p>
      </noscript>
      <Scripts/>
    </body>
  </html>;

type Arrival = 'left alone' | 'at the top of the page' | 'where the reader left it';

const arrivalOf = (hash: string, navigation: NavigationType): Arrival => {
  if (navigation === NavigationType.Pop) return 'where the reader left it';
  return hash === '' ? 'at the top of the page' : 'left alone';
};

const arrive = (arrival: Arrival, places: ReadersPlaces): void => ({
  'left alone': () => undefined,
  'at the top of the page': gotoTopOfPage,
  'where the reader left it': places.returnTo
})[arrival]();

const Site: FC<{room: ReactNode}> = ({room}) => {
  const {pathname, hash} = useLocation();
  const navigation = useNavigationType();
  const [places] = useState(readersPlaces);
  const [place, setPlace] = useState<{pathname: string; hash: string; arrival: Arrival}>({pathname, hash, arrival: arrivalOf(hash, navigation)});
  if (place.pathname !== pathname || place.hash !== hash) {
    setPlace({pathname, hash, arrival: arrivalOf(hash, navigation)});
  }
  useEffect(() => places.keep(), [places]);
  useEffect(() => {
    arrive(place.arrival, places);
  }, [place, places]);

  return <BannerProvider><PageNameProvider><FeedbackProvider>
    {room}
    <Banners/>
  </FeedbackProvider></PageNameProvider></BannerProvider>;
};

export const ErrorBoundary: FC = () =>
  <Site room={<Page header={<Header title="Closed room" listed={names.closedRoom}/>} inView={false}><PageError/></Page>}/>;

export const HydrateFallback: FC = () => null;

const Root: FC = () => <Site room={<Outlet/>}/>;

export default Root;
