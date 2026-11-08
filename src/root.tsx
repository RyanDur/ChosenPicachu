import {BannerProvider, Banners} from '@frame/notices/Banners';
import {Location, Outlet, ScrollRestoration} from 'react-router';
import {FC, PropsWithChildren, ReactNode} from 'react';
import './index.css';
import './BasePage.css';
import {FeedbackProvider} from '@frame/notices/Feedback';
import {Header, Page, PageError} from '@frame/page';
import {PageNameProvider} from '@frame/state';
import names from '@frame/navigation/names.json';
import {env} from '@frame/state';
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
    </head>
    <body>
      <div id="root" className="backdrop">
        <SiteProviders env={env}>{children}</SiteProviders>
      </div>
      <noscript>
        <p>
          Found a mistake, or a better way? Say so on the
          site’s <a href="https://github.com/RyanDur/ChosenPicachu/discussions">Discussions page on GitHub</a>.
        </p>
      </noscript>
    </body>
  </html>;

// the router keys every entry opened by its address 'default', so those entries would all share one scroll place
const placeOf = ({key, pathname, search}: Location): string => key === 'default' ? pathname + search : key;

const Site: FC<{room: ReactNode}> = ({room}) =>
  <BannerProvider><PageNameProvider><FeedbackProvider>
    {room}
    <Banners/>
    <ScrollRestoration getKey={placeOf}/>
  </FeedbackProvider></PageNameProvider></BannerProvider>;

export const ErrorBoundary: FC = () =>
  <Site room={<Page header={<Header title="Closed room" listed={names.closedRoom}/>} inView={false}><PageError/></Page>}/>;

export const HydrateFallback: FC = () =>
  <Site room={<Page header={<Header title="Chosen Picachu" listed={names.home}/>} inView={false} pageUnknown>
    <noscript>
      <p className="paragraph prose">The script draws this page, and it is off. The pages the rail lists are here
        without it.</p>
    </noscript>
  </Page>}/>;

export const Root: FC = () => <Site room={<Outlet/>}/>;
