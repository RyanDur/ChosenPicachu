import {BannerProvider, Banners} from '@banners';
import {Location, Outlet, ScrollRestoration} from 'react-router';
import {FC, PropsWithChildren, ReactNode} from 'react';
import './index.css';
import './BasePage.css';
import {FeedbackProvider} from '@feedback';
import {environment} from '@transport';
import {Header, Page, PageError} from '@page';
import {PageNameProvider} from '@page-name';
import names from '@navigation/names.json';
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
        <SiteProviders environment={environment}>{children}</SiteProviders>
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

const Frame: FC<{room: ReactNode}> = ({room}) =>
  <BannerProvider><PageNameProvider><FeedbackProvider>
    {room}
    <Banners/>
    <ScrollRestoration getKey={placeOf}/>
  </FeedbackProvider></PageNameProvider></BannerProvider>;

export const ErrorBoundary: FC = () =>
  <Frame room={<Page header={<Header title="Closed room" listed={names.closedRoom}/>} inView={false}>
    <PageError/>
  </Page>}/>;

export const HydrateFallback: FC = () =>
  <Frame room={<Page header={<Header title="Chosen Picachu" listed={names.home}/>} inView={false} pageUnknown>
    <noscript>
      <p className="paragraph prose">The script draws this page, and it is off. The pages the rail lists are here
        without it.</p>
    </noscript>
  </Page>}/>;

export const Root: FC = () => <Frame room={<Outlet/>}/>;
