import {classNames} from '@components/class-names';
import {BannerProvider, Banners} from '@components/Banners';
import {NavigationType, Outlet, useLocation, useMatches, useNavigationType} from 'react-router';
import {FC, Fragment, useEffect, useState} from 'react';
import {SideNav} from '@pages/BasePage/SideNav';
import {Feedback} from '@components/Feedback';
import {PageNameProvider} from '@components/PageName';
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

const Site: FC<{closed?: boolean}> = ({closed = false}) => {
  const {pathname, hash} = useLocation();
  const navigation = useNavigationType();
  const [place, setPlace] = useState({pathname, hash, startsAtTheTop: false});
  if (place.pathname !== pathname || place.hash !== hash) {
    setPlace({pathname, hash, startsAtTheTop: hash === '' && navigation !== NavigationType.Pop});
  }
  useEffect(() => {
    if (place.startsAtTheTop) gotoTopOfPage();
  }, [place]);
  const regions = useMatches()
    .map(match => match.handle)
    .filter(isRegions)
    .reduce<Regions>((parent, child) => ({...parent, ...child}), {header: NoHeader});
  const {header: HeaderRegion, aside: AsideRegion, footer: FooterRegion, provider: Provider = Fragment, mainClassName} =
    closed ? {...regions, header: ClosedRoomHeader} : regions;

  return <BannerProvider><PageNameProvider>
    <Provider>
      <HeaderRegion/>
      <section className="rail" aria-label="pages and feedback">
        <SideNav/>
        <Feedback/>
      </section>
      {AsideRegion && <AsideRegion/>}
      <main className={classNames('app-main', 'field', mainClassName)}>
        {closed ? <PageError/> : <Outlet/>}
      </main>
      {FooterRegion && <footer id="app-footer" className="app-footer stick-to-bottom field">
        <FooterRegion/>
      </footer>}
    </Provider>
    <Banners/>
  </PageNameProvider></BannerProvider>;
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
