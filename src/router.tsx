import {classNames} from '@components/class-names';
import {BannerProvider, Banners} from '@components/Banners';
import {NavigationType, Outlet, useLocation, useMatches, useNavigationType} from 'react-router';
import {FC, Fragment, useEffect, useState} from 'react';
import {SideNav} from '@pages/BasePage/SideNav';
import {Feedback} from '@components/Feedback';
import {PageNameProvider} from '@components/PageName';
import {isRegions, Regions} from '@pages/regions';
import {gotoTopOfPage} from '@components/scroll';
import {Home} from '@pages/Home';
import {Users} from '@pages/Users';
import {Gallery} from '@pages/Gallery';
import {Games} from '@pages/Games';
import {PageError} from '@pages/PageError';
import {NoRoom} from '@pages/NoRoom';
import {Header} from '@pages/BasePage/Header';
import {useFrameMeasures} from '@pages/BasePage/useFrameMeasures';
import names from '@pages/names.json';
import {Demos} from '@pages/Demos/routes';

const NoHeader = () => null;
const ClosedRoomHeader = () => <Header title="Closed room" named={names.home}/>;
const NoRoomHeader = () => <Header title="No such room" named={names.home}/>;

type Arrival = 'left alone' | 'at the top of the page';

const arrivalOf = (hash: string, navigation: NavigationType): Arrival =>
  hash === '' && navigation !== NavigationType.Pop ? 'at the top of the page' : 'left alone';

const arrive: Record<Arrival, () => void> = {
  'left alone': () => undefined,
  'at the top of the page': gotoTopOfPage
};

const Site: FC<{closed?: boolean}> = ({closed = false}) => {
  const {pathname, hash} = useLocation();
  const navigation = useNavigationType();
  const [place, setPlace] = useState<{pathname: string; hash: string; arrival: Arrival}>({pathname, hash, arrival: 'left alone'});
  if (place.pathname !== pathname || place.hash !== hash) {
    setPlace({pathname, hash, arrival: arrivalOf(hash, navigation)});
  }
  useEffect(() => arrive[place.arrival](), [place]);
  useFrameMeasures();
  const regions = useMatches()
    .map(match => match.handle)
    .filter(isRegions)
    .reduce<Regions>((parent, child) => ({...parent, ...child}), {header: NoHeader});
  const {header: HeaderRegion, aside: AsideRegion, footer: FooterRegion, provider: Provider = Fragment, mainClassName} =
    closed ? {...regions, header: ClosedRoomHeader} : regions;

  return <BannerProvider><PageNameProvider>
    <Provider>
      <HeaderRegion/>
      <section className="rail backdrop backdrop-below" aria-label="pages and feedback">
        <SideNav/>
        <Feedback/>
      </section>
      {AsideRegion && <AsideRegion/>}
      <main className={classNames('app-main', 'field', mainClassName)}>
        {closed ? <PageError/> : <Outlet/>}
      </main>
      {FooterRegion && <footer id="app-footer" className="app-footer stick-to-bottom field backdrop-above">
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
    Demos,
    Users,
    Gallery,
    Games,
    {path: '*', handle: {header: NoRoomHeader}, element: <NoRoom/>}
  ]
};
