import {createContext, FC, PropsWithChildren, useContext, useEffect} from 'react';
import {is, not} from '@ryandur/sand';
import {Link, NavigationType, NavLink, useLocation, useMatch, useNavigationType} from 'react-router';
import {Paths} from '@frame/navigation';
import {demoAddress, DemoTopics} from '@pages/Demos';
import {practiceAddress} from '@pages/Practice/types';
import {queryString} from '@transport';
import {opening} from '@pages/Gallery';

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
  const onThePage = is(useMatch({path: page, end: false})) && not(pageUnknown);
  return <Link id={id} className={railPath()} to={to} state={followedFromTheRail}
    aria-current={onThePage ? 'page' : undefined}>{children}</Link>;
};

// React Router mounts each route's page anew, and the followed link goes with the page it was on.
// React's autoFocus focuses only form controls, and the platform's autofocus runs once per document.
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
      to={`${Paths.artGallery}${queryString.from({
        page: opening.page,
        size: opening.size,
        tab: opening.museum
      })}`}>Gallery</RailLink>
    <RailLink id="navigate-games" to={Paths.games}>Games</RailLink>
    <a id="navigate-repo" className="path rail-path bold attentive field reachable" href={Paths.repo}
      rel="noopener noreferrer" target="_blank">Repo</a>
  </nav></PageUnknown.Provider>;
};
