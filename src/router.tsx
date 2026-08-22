import {classNames} from '@components/class-names';
import {BannerProvider, Banners} from '@components/Banners';
import {Navigate, Outlet, useMatches} from 'react-router';
import {Fragment} from 'react';
import {SideNav} from '@pages/BasePage/SideNav';
import {isRegions, Regions} from '@pages/regions';
import {Paths} from '@pages/Paths';
import {GalleryPaths} from '@pages/Gallery/GalleryRouter/GalleryPaths';
import {GamePaths} from '@pages/Games/GamePaths';

const NoHeader = () => null;

export const MountedTable = () => {
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
      {AsideRegion !== undefined && <article id="filter">
        <AsideRegion/>
      </article>}
      {FooterRegion !== undefined && <footer id="app-footer" className="stick-to-bottom">
        <FooterRegion/>
      </footer>}
      <SideNav/>
    </Provider>
    <Banners/>
  </BannerProvider>;
};

/* Each page joins the bundle it navigates to: this skeleton carries only the
   matchable paths, and every other route property arrives with the page's own
   chunk, so no page downloads another page's code. */
const without = <T extends {path?: string, children?: unknown}>({path, children, ...route}: T) => route;

export const router = {
  path: '/',
  element: <MountedTable/>,
  children: [
    {path: Paths.home, element: <Navigate to={Paths.demos} replace/>},
    {path: Paths.demos, lazy: () => import('@pages/Demos').then(({Demos}) => without(Demos))},
    {
      path: `${Paths.demos}charts/:kind/`,
      lazy: () => import('@pages/Demos').then(({ChartTutorial}) => without(ChartTutorial))
    },
    {path: Paths.users, lazy: () => import('@pages/Users').then(({Users}) => without(Users))},
    {
      path: Paths.artGallery,
      lazy: () => import('@pages/Gallery').then(({Gallery}) => without(Gallery)),
      children: [
        {path: GalleryPaths.home, lazy: () => import('@pages/Gallery').then(({GalleryHome}) => without(GalleryHome))},
        {path: GalleryPaths.piece, lazy: () => import('@pages/Gallery').then(({GalleryPiece}) => without(GalleryPiece))}
      ]
    },
    {
      path: `${Paths.games}*`,
      lazy: () => import('@pages/Games').then(({Games}) => without(Games)),
      children: [
        {path: GamePaths.colorGame, lazy: () => import('@pages/Games').then(({ColorGame}) => without(ColorGame))}
      ]
    }
  ]
};
