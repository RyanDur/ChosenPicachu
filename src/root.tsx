import {BannerProvider, Banners} from '@banners';
import {Outlet} from 'react-router';
import {FC, PropsWithChildren} from 'react';
import './index.css';
import './BasePage.css';
import {environment} from '@transport';
import {Frame, Header, Page, PageError} from '@page';
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
    <body id="root" className="backdrop">
      <SiteProviders environment={environment}>{children}</SiteProviders>
      <noscript className="frame-note">
        <p>
          Found a mistake, or a better way? Say so on the
          site’s <a href="https://github.com/RyanDur/ChosenPicachu/discussions">Discussions page on GitHub</a>.
        </p>
      </noscript>
    </body>
  </html>;

export const ErrorBoundary: FC = () =>
  <BannerProvider>
    <Page header={<Header title="Closed site" listed={names.closedSite}/>} inView={false}>
      <PageError>Part of the frame around every page broke, so no page can open right now.</PageError>
    </Page>
    <Banners/>
  </BannerProvider>;

export const Root: FC = () => <Frame><Outlet/></Frame>;
