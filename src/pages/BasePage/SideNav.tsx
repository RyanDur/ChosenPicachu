import {FC, PropsWithChildren, useEffect} from 'react';
import {NavigationType, NavLink, useLocation, useNavigationType} from 'react-router';
import {Paths} from '@pages/Paths';
import {toQueryString} from '@transport/url';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import {Source} from '@components/art-gallery/museums/source';

const railPath = () => 'path rail-path bold attentive field void-dot-before reachable';

const followedFromTheRail = 'followed from the rail';

type RailLinkProps = PropsWithChildren<{readonly id: string; readonly to: string; readonly end?: boolean}>;

const RailLink: FC<RailLinkProps> = ({id, to, end, children}) =>
  <NavLink id={id} className={railPath} to={to} end={end} state={followedFromTheRail}>{children}</NavLink>;

// React Router mounts each route's page anew, and the followed link goes with the page it was on
const useKeepsTheReadersPlace = (): void => {
  const {key, state} = useLocation();
  const navigation = useNavigationType();
  useEffect(() => {
    if (state === followedFromTheRail && navigation === NavigationType.Push) {
      document.querySelector<HTMLAnchorElement>('#side-nav [aria-current="page"]')?.focus({preventScroll: true});
    }
  }, [key, state, navigation]);
};

export const SideNav: FC = () => {
  useKeepsTheReadersPlace();

  return <nav id="side-nav" className="side-nav field backdrop-separated" aria-label="site">
    <RailLink id="navigate-home" to={Paths.home} end>Home</RailLink>
    <RailLink id="navigate-record" to={Paths.record}>Record</RailLink>
    <RailLink id="navigate-practice" to={Paths.practice}>Practice</RailLink>
    <RailLink id="navigate-demos" to={Paths.demos}>Demos</RailLink>
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
  </nav>;
};
