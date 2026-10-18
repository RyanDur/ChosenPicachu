import {BannerProvider, Banners} from '@components/Banners';
import {NavigationType, Outlet, useLocation, useNavigationType} from 'react-router';
import {FC, ReactNode, useEffect, useState} from 'react';
import './BasePage.css';
import {FeedbackProvider} from '@components/Feedback';
import {PageNameProvider} from '@components/PageName';
import {gotoTopOfPage} from '@components/scroll';
import {Home} from '@pages/Home';
import {Users} from '@pages/Users';
import {Gallery} from '@pages/Gallery';
import {Games} from '@pages/Games';
import {TheRecord} from '@pages/Record';
import {Development} from '@pages/Development';
import {PageError} from '@pages/PageError';
import {NoRoom} from '@pages/NoRoom';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import names from '@pages/names.json';
import {Demos} from '@pages/Demos/routes';

type Arrival = 'left alone' | 'at the top of the page';

const arrivalOf = (hash: string, navigation: NavigationType): Arrival =>
  hash === '' && navigation !== NavigationType.Pop ? 'at the top of the page' : 'left alone';

const arrive: Record<Arrival, () => void> = {
  'left alone': () => undefined,
  'at the top of the page': gotoTopOfPage
};

const Site: FC<{room: ReactNode}> = ({room}) => {
  const {pathname, hash} = useLocation();
  const navigation = useNavigationType();
  const [place, setPlace] = useState<{pathname: string; hash: string; arrival: Arrival}>({pathname, hash, arrival: 'left alone'});
  if (place.pathname !== pathname || place.hash !== hash) {
    setPlace({pathname, hash, arrival: arrivalOf(hash, navigation)});
  }
  useEffect(() => arrive[place.arrival](), [place]);

  return <BannerProvider><PageNameProvider><FeedbackProvider>
    {room}
    <Banners/>
  </FeedbackProvider></PageNameProvider></BannerProvider>;
};

const closedRoom = <Page header={<Header title="Closed room" listed={names.closedRoom}/>} inView={false}><PageError/></Page>;

const noRoom = <Page header={<Header title="No such room" listed={names.noRoom}/>} inView={false}><NoRoom/></Page>;

export const router = {
  path: '/',
  element: <Site room={<Outlet/>}/>,
  errorElement: <Site room={closedRoom}/>,
  hydrateFallbackElement: <Site room={<Page header={null}/>}/>,
  children: [
    Home,
    ...Demos,
    Users,
    ...Gallery,
    ...Games,
    TheRecord,
    Development,
    {path: '*', element: noRoom}
  ]
};
