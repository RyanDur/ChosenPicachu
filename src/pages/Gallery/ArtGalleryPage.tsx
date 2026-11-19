import {FC, useEffect} from 'react';
import {useLocation} from 'react-router';
import {useHydrated} from '@components';
import {has, maybe, not, notEmpty} from '@ryandur/sand';
import {Tabs} from '@navigation/Tabs';
import {Loading} from '@components/Loading';
import {ArtGallery} from '@pages/Gallery/Art';
import {Source} from '@pages/Gallery/source';
import {museums} from '@pages/Gallery/museums';
import missingWall from '../../assets/icons/missing-wall.svg?url';
import {StandIn} from '@pages/Gallery/StandIn';
import {opening} from '@pages/Gallery/opening';
import {useGallery, useKnownDoors} from '@pages/Gallery/Context';
import {Doors, doors} from '@pages/Gallery/doors';
import './ArtGalleryPage.css';

const settledIn = (doors: Doors): boolean => museums.all.every(({param}) => doors[param] !== 'unknown');

type Shown =
  | {readonly shown: 'wall'}
  | {readonly shown: 'noMuseumOpen'}
  | {readonly shown: 'movingToAnOpenMuseum'; readonly museum: Source}
  | {readonly shown: 'loading'};

const shownFor = (known: Doors, tab?: Source): Shown => {
  const open = doors.openIn(known);
  if (open.some(({param}) => param === tab)) return {shown: 'wall'};
  if (not(settledIn(known))) return {shown: 'loading'};
  return maybe(open[0])
    .map(({param}): Shown => ({shown: 'movingToAnOpenMuseum', museum: param}))
    .orElse<Shown>({shown: 'noMuseumOpen'});
};

export const ArtGalleryPage: FC = () => {
  const known = useKnownDoors();
  const {tab, updateSearchParams, searchFromShown} = useGallery();
  const {pathname} = useLocation();
  const hydrated = useHydrated();

  const open = doors.openIn(known);
  const shown = shownFor(known, tab);
  const movingTo = shown.shown === 'movingToAnOpenMuseum' ? shown.museum : undefined;

  useEffect(() => {
    if (hydrated && has(movingTo)) updateSearchParams({tab: movingTo}, {replace: true});
  }, [hydrated, movingTo, updateSearchParams]);

  return <>
    {notEmpty(open) && <Tabs label="museums" className="museum-tabs" current={tab}
      values={open.map(museum => ({...museum, to: `${pathname}${searchFromShown({tab: museum.param, page: opening.page})}`}))}/>}
    {{
      wall: <ArtGallery/>,
      noMuseumOpen: <StandIn src={missingWall} alt="no museum is open"/>,
      movingToAnOpenMuseum: <Loading label="loading gallery"/>,
      loading: <Loading label="loading gallery"/>
    }[shown.shown]}
  </>;
};
