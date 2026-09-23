import {classNames} from '@components/class-names';
import {BannerProvider, Banners} from '@components/Banners';
import {Outlet, useLocation, useMatches} from 'react-router';
import {FC, Fragment, useEffect} from 'react';
import {SideNav} from '@pages/BasePage/SideNav';
import {isRegions, Regions} from '@pages/regions';
import {gotoTopOfPage} from '@components/scroll';
import {Paths} from '@pages/Paths';
import {Home} from '@pages/Home';
import {Users} from '@pages/Users';
import {Gallery} from '@pages/Gallery';
import {Games} from '@pages/Games';
import {PageError} from '@pages/PageError';
import {NoRoom} from '@pages/NoRoom';
import {Header} from '@pages/BasePage/Header';

const NoHeader = () => null;
const ClosedRoomHeader = () => <Header title="Closed room"/>;
const NoRoomHeader = () => <Header title="No such room"/>;

export const Site: FC<{closed?: boolean}> = ({closed = false}) => {
  const {pathname, hash} = useLocation();
  useEffect(() => {
    if (hash === '') {
      gotoTopOfPage();
    }
  }, [pathname, hash]);
  const regions = useMatches()
    .map(match => match.handle)
    .filter(isRegions)
    .reduce<Regions>((parent, child) => ({...parent, ...child}), {header: NoHeader});
  const {header: HeaderRegion, aside: AsideRegion, footer: FooterRegion, provider: Provider = Fragment, mainClassName} =
    closed ? {...regions, header: ClosedRoomHeader} : regions;

  return <BannerProvider>
    <Provider>
      <HeaderRegion/>
      <SideNav/>
      <main className={classNames('app-main', 'field', mainClassName)}>
        {closed ? <PageError/> : <Outlet/>}
      </main>
      {AsideRegion && <aside id="filter" className="filter field" aria-label="filters">
        <AsideRegion/>
      </aside>}
      {FooterRegion && <footer id="app-footer" className="app-footer stick-to-bottom field">
        <FooterRegion/>
      </footer>}
    </Provider>
    <Banners/>
  </BannerProvider>;
};

export const router = {
  path: '/',
  element: <Site/>,
  errorElement: <Site closed/>,
  hydrateFallbackElement: <Site/>,
  children: [
    Home,
    {
      lazy: () => import('@pages/Demos').then(({TradingFloor}) => TradingFloor),
      children: [
        {path: Paths.demos, lazy: () => import('@pages/Demos').then(({Demos}) => Demos)},
        {path: Paths.chartTutorial, lazy: () => import('@pages/Demos').then(({ChartTutorial}) => ChartTutorial)}
      ]
    },
    Users,
    Gallery,
    Games,
    {path: '*', handle: {header: NoRoomHeader}, element: <NoRoom/>}
  ]
};
