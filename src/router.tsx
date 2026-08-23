import {classNames} from '@components/class-names';
import {BannerProvider, Banners} from '@components/Banners';
import {Outlet, useLocation, useMatches} from 'react-router';
import {Fragment, useEffect} from 'react';
import {SideNav} from '@pages/BasePage/SideNav';
import {isRegions, Regions} from '@pages/regions';
import {Paths} from '@pages/Paths';
import {Home} from '@pages/Home';
import {Users} from '@pages/Users';
import {Gallery} from '@pages/Gallery';
import {Games} from '@pages/Games';

const NoHeader = () => null;

export const MountedTable = () => {
  const {pathname, hash} = useLocation();
  useEffect(() => {
    if (hash === '') {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  const regions = useMatches()
    .map(match => match.handle)
    .filter(isRegions)
    .reduce<Regions>((parent, child) => ({...parent, ...child}), {header: NoHeader});
  const {header: HeaderRegion, aside: AsideRegion, footer: FooterRegion, provider: Provider = Fragment, mainClassName} = regions;

  return <BannerProvider>
    <Provider>
      <HeaderRegion/>
      <main className={classNames('app-main', mainClassName)}>
        <Outlet/>
      </main>
      {AsideRegion !== undefined && <aside id="filter" aria-label="filters">
        <AsideRegion/>
      </aside>}
      {FooterRegion !== undefined && <footer id="app-footer" className="stick-to-bottom">
        <FooterRegion/>
      </footer>}
      <SideNav/>
    </Provider>
    <Banners/>
  </BannerProvider>;
};

export const router = {
  path: '/',
  element: <MountedTable/>,
  children: [
    Home,
    {path: Paths.demos, lazy: () => import('@pages/Demos').then(({Demos}) => Demos)},
    {path: Paths.chartTutorial, lazy: () => import('@pages/Demos').then(({ChartTutorial}) => ChartTutorial)},
    Users,
    Gallery,
    Games
  ]
};
