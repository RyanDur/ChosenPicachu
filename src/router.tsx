import {Outlet, useMatches} from 'react-router';
import {Fragment, Suspense} from 'react';
import {SideNav} from './pages/BasePage/SideNav';
import {Loading} from '@components/art-gallery/Loading';
import {isRegions, Regions} from '@pages/regions';
import {About, Gallery, Games, Home, Users} from './pages';

const NoHeader = () => null;

export const Shell = () => {
  const regions = useMatches()
    .map(match => match.handle)
    .filter(isRegions)
    .reduce<Regions>((parent, child) => ({...parent, ...child}), {header: NoHeader});
  const {header: HeaderRegion, aside: AsideRegion, footer: FooterRegion, provider: Provider = Fragment, mainClassName} = regions;

  return <Provider>
    <HeaderRegion/>
    <main data-testid="main" className={mainClassName}>
      <Suspense fallback={<Loading testId="page-loading"/>}>
        <Outlet/>
      </Suspense>
    </main>
    {AsideRegion !== undefined && <article id="filter" data-testid="filter">
      <Suspense fallback={null}><AsideRegion/></Suspense>
    </article>}
    {FooterRegion !== undefined && <footer id="app-footer" className="stick-to-bottom" data-testid="footer">
      <Suspense fallback={null}><FooterRegion/></Suspense>
    </footer>}
    <SideNav/>
  </Provider>;
};

export const router = {
  path: '/',
  element: <Shell/>,
  children: [
    Home,
    About,
    Users,
    Gallery,
    Games
  ]
};
