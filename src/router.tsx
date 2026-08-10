import {classNames} from '@components/class-names';
import {Navigate, Outlet, useMatches} from 'react-router';
import {Fragment} from 'react';
import {SideNav} from '@pages/BasePage/SideNav';
import {isRegions, Regions} from '@pages/regions';
import {ChartTutorial, Demos, Gallery, Games, Users} from './pages';
import {Paths} from '@pages/Paths';

const NoHeader = () => null;

export const Shell = () => {
  const regions = useMatches()
    .map(match => match.handle)
    .filter(isRegions)
    .reduce<Regions>((parent, child) => ({...parent, ...child}), {header: NoHeader});
  const {header: HeaderRegion, aside: AsideRegion, footer: FooterRegion, provider: Provider = Fragment, mainClassName} = regions;

  return <Provider>
    <HeaderRegion/>
    <main className={classNames('app-main', mainClassName)}>
      <Outlet/>
    </main>
    {AsideRegion !== undefined && <article id="filter">
      <AsideRegion/>
    </article>}
    {FooterRegion !== undefined && <footer id="app-footer" className="stick-to-bottom">
      <FooterRegion/>
    </footer>}
    <SideNav/>
  </Provider>;
};

export const router = {
  path: '/',
  element: <Shell/>,
  children: [
    {path: Paths.home, element: <Navigate to={Paths.demos} replace/>},
    Demos,
    ChartTutorial,
    Users,
    Gallery,
    Games
  ]
};
