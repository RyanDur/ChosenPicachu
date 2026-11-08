import {FC, PropsWithChildren, useContext} from 'react';
import {is, not} from '@ryandur/sand';
import {Link, NavLink, useMatch} from 'react-router';
import {Paths} from '@navigation';
import {DemoTopics, demoTab} from '@pages/Demos';
import {practiceAddress} from '@pages/Practice';
import {queryString} from '@transport';
import {opening} from '@pages/Gallery';
import {PageUnknown} from './PageUnknown';

const railPath = () => 'path rail-path bold attentive field void-dot-before reachable';

type RailLinkProps = PropsWithChildren<{readonly id: string; readonly to: string; readonly end?: boolean}>;

const RailLink: FC<RailLinkProps> = ({id, to, end, children}) => useContext(PageUnknown)
  ? <Link id={id} className={railPath()} to={to}>{children}</Link>
  : <NavLink id={id} className={railPath} to={to} end={end}>{children}</NavLink>;

type SectionLinkProps = PropsWithChildren<{readonly id: string; readonly page: string; readonly to: string}>;

const SectionLink: FC<SectionLinkProps> = ({id, page, to, children}) => {
  const pageUnknown = useContext(PageUnknown);
  const onThePage = is(useMatch({path: page, end: false})) && not(pageUnknown);
  return <Link id={id} className={railPath()} to={to}
    aria-current={onThePage ? 'page' : undefined}>{children}</Link>;
};

export const SideNav: FC = () =>
  <nav id="side-nav" className="side-nav field backdrop-separated" aria-label="site">
    <RailLink id="navigate-home" to={Paths.home} end>Home</RailLink>
    <RailLink id="navigate-record" to={Paths.record}>Record</RailLink>
    <SectionLink id="navigate-practice" page={Paths.practice} to={practiceAddress.of('Structure')}>Practice</SectionLink>
    <SectionLink id="navigate-demos" page={Paths.demos} to={demoTab.address(DemoTopics.accordions)}>Demos</SectionLink>
    <RailLink id="navigate-users" to={Paths.users}>Users</RailLink>
    <RailLink id="navigate-form"
      to={`${Paths.artGallery}${queryString.from({
        page: opening.page,
        size: opening.size,
        tab: opening.museum
      })}`}>Gallery</RailLink>
    <RailLink id="navigate-games" to={Paths.games}>Games</RailLink>
    <a id="navigate-repo" className="path rail-path bold attentive field reachable" href={Paths.repo}
      rel="noopener noreferrer" target="_blank">Repo</a>
  </nav>;
