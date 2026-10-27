import {FC, PropsWithChildren} from 'react';
import {Link, NavLink, useMatch} from 'react-router';
import {Paths} from '@pages/Paths';
import {demoAddress, DemoTopics} from '@pages/Demos/types';
import {practiceAddress} from '@pages/Practice/types';
import {toQueryString} from '@transport/url';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import {Source} from '@components/art-gallery/museums/source';

const railPath = () => 'path rail-path bold attentive field void-dot-before reachable';

const SectionLink: FC<PropsWithChildren<{id: string; page: string; to: string}>> = ({id, page, to, children}) =>
  <Link id={id} className={railPath()} to={to} aria-current={useMatch({path: page, end: false}) === null ? undefined : 'page'}>{children}</Link>;

export const SideNav: FC = () =>
  <nav id="side-nav" className="side-nav field backdrop-separated" aria-label="site">
    <NavLink id="navigate-home" className={railPath} to={Paths.home} end>Home</NavLink>
    <NavLink id="navigate-record" className={railPath} to={Paths.record}>Record</NavLink>
    <SectionLink id="navigate-practice" page={Paths.practice} to={practiceAddress('Structure')}>Practice</SectionLink>
    <SectionLink id="navigate-demos" page={Paths.demos} to={demoAddress(DemoTopics.accordions)}>Demos</SectionLink>
    <NavLink id="navigate-users" className={railPath} to={Paths.users}>Users</NavLink>
    <NavLink id="navigate-form" className={railPath}
      to={`${Paths.artGallery}${toQueryString({
        page: 1,
        size: defaultRecordLimit,
        tab: Source.AIC
      })}`}>Gallery</NavLink>
    <NavLink id="navigate-games" className={railPath} to={Paths.games}>Games</NavLink>
    <a id="navigate-repo" className="path rail-path bold attentive field reachable" href={Paths.repo}
      rel="noopener noreferrer" target="_blank">Repo</a>
  </nav>;
