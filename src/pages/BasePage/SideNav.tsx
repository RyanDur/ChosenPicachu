import {createContext, FC, PropsWithChildren, useContext, useEffect} from 'react';
import {Link, NavigationType, NavLink, useLocation, useMatch, useNavigationType} from 'react-router';
import {Paths} from '@pages/Paths';
import {demoAddress, DemoTopics} from '@pages/Demos/types';
import {practiceAddress} from '@pages/Practice/types';
import {toQueryString} from '@transport/url';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import {Source} from '@components/art-gallery/museums/source';

const railPath = () => 'path rail-path bold attentive field void-dot-before reachable';

const followedFromTheRail = 'followed from the rail';

const PageUnknown = createContext(false);

type RailLinkProps = PropsWithChildren<{readonly id: string; readonly to: string; readonly end?: boolean}>;

const RailLink: FC<RailLinkProps> = ({id, to, end, children}) => useContext(PageUnknown)
  ? <Link id={id} className={railPath()} to={to} state={followedFromTheRail}>{children}</Link>
  : <NavLink id={id} className={railPath} to={to} end={end} state={followedFromTheRail}>{children}</NavLink>;

type SectionLinkProps = PropsWithChildren<{readonly id: string; readonly page: string; readonly to: string}>;

const SectionLink: FC<SectionLinkProps> = ({id, page, to, children}) => {
  const pageUnknown = useContext(PageUnknown);
  const onThePage = useMatch({path: page, end: false}) !== null && !pageUnknown;
  return <Link id={id} className={railPath()} to={to} state={followedFromTheRail}
    aria-current={onThePage ? 'page' : undefined}>{children}</Link>;
};

// React Router mounts each route's page anew, and the followed link goes with the page it was on
const useFocusFollowsTheRail = (): void => {
  const {key, state} = useLocation();
  const navigation = useNavigationType();
  useEffect(() => {
    if (state === followedFromTheRail && navigation === NavigationType.Push) {
      document.querySelector<HTMLAnchorElement>('#side-nav [aria-current="page"]')?.focus({preventScroll: true});
    }
  }, [key, state, navigation]);
};

export const SideNav: FC<{pageUnknown?: boolean}> = ({pageUnknown = false}) => {
  useFocusFollowsTheRail();

  return <PageUnknown.Provider value={pageUnknown}><nav id="side-nav" className="side-nav field backdrop-separated" aria-label="site">
    <RailLink id="navigate-home" to={Paths.home} end>Home</RailLink>
    <RailLink id="navigate-record" to={Paths.record}>Record</RailLink>
    <SectionLink id="navigate-practice" page={Paths.practice} to={practiceAddress('Structure')}>Practice</SectionLink>
    <SectionLink id="navigate-demos" page={Paths.demos} to={demoAddress(DemoTopics.accordions)}>Demos</SectionLink>
    <RailLink id="navigate-users" to={Paths.users}>Users</RailLink>
    <RailLink id="navigate-form"
      to={`${Paths.artGallery}${toQueryString({
        page: 1,
        size: defaultRecordLimit,
        tab: Source.AIC
      })}`}>Gallery</RailLink>
    <RailLink id="navigate-games" to={Paths.games}>Games</RailLink>
    <a id="navigate-repo" className="path rail-path bold attentive field reachable" href={Paths.repo}
      rel="noopener noreferrer" target="_blank">Repo</a>
  </nav></PageUnknown.Provider>;
};
