import {classNames} from '@components/class-names';
import {BannerProvider, Banners} from '@components/Banners';
import {NavigationType, Outlet, useLocation, useMatches, useNavigationType} from 'react-router';
import {FC, Fragment, useEffect, useState} from 'react';
import {SideNav} from '@pages/BasePage/SideNav';
import {Feedback} from '@components/Feedback';
import {PageNameProvider} from '@components/PageName';
import {isRegions, Regions} from '@pages/regions';
import {gotoTopOfPage, gotoTopOfPane} from '@components/scroll';
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

type Arrival = 'left alone' | 'at the top of the page' | 'at the top of the pane';

const arrivalOf = (pageChanged: boolean, hash: string, navigation: NavigationType): Arrival => {
  if (navigation === NavigationType.Pop) return pageChanged ? 'at the top of the pane' : 'left alone';
  return hash === '' ? 'at the top of the page' : 'left alone';
};

const arrive: Record<Arrival, () => void> = {
  'left alone': () => undefined,
  'at the top of the page': gotoTopOfPage,
  // the browser restores the document's scroll on Back and Forward, never a pane's
  'at the top of the pane': gotoTopOfPane
};

const Site: FC<{closed?: boolean}> = ({closed = false}) => {
  const {pathname, hash} = useLocation();
  const navigation = useNavigationType();
  const [place, setPlace] = useState<{pathname: string; hash: string; arrival: Arrival}>({pathname, hash, arrival: 'left alone'});
  const pageChanged = place.pathname !== pathname;
  if (pageChanged || place.hash !== hash) {
    setPlace({pathname, hash, arrival: arrivalOf(pageChanged, hash, navigation)});
  }
  useEffect(() => arrive[place.arrival](), [place]);
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
