import {FC, useEffect, useReducer} from 'react';
import {useLocation} from 'react-router';
import {useHydrated} from '@components/hydrated';
import {has, maybe, notEmpty} from '@ryandur/sand';
import {Tabs} from '@components/Tabs';
import {Loading} from '@components/Loading';
import {ArtGallery} from '@pages/Gallery/Art';
import {Source} from '@pages/Gallery/source';
import {art, museums} from '@pages/Gallery/museums';
import missingWall from '../../assets/icons/missing-wall.svg?url';
import {StandIn} from '@pages/Gallery/StandIn';
import {useGallery} from '@pages/Gallery/Context';
import {Doors, doors} from '@pages/Gallery/doors';

const openIn = (doors: Doors) => museums.all.filter(({param}) => doors[param] === 'open');

const settledIn = (doors: Doors): boolean => museums.all.every(({param}) => doors[param] !== 'unknown');

type Shown =
  | {readonly shown: 'wall'}
  | {readonly shown: 'noMuseumOpen'}
  | {readonly shown: 'movingToAnOpenMuseum'; readonly museum: Source}
  | {readonly shown: 'loading'};

const shownFor = (doors: Doors, tab?: Source): Shown => {
  const open = openIn(doors);
  if (open.some(({param}) => param === tab)) return {shown: 'wall'};
  if (!settledIn(doors)) return {shown: 'loading'};
  return maybe(open[0])
    .map(({param}): Shown => ({shown: 'movingToAnOpenMuseum', museum: param}))
    .orElse<Shown>({shown: 'noMuseumOpen'});
};

export const ArtGalleryPage: FC = () => {
  const [known, dispatch] = useReducer(doors.reduce, doors.initial);
  const {tab, updateSearchParams, searchFromShown} = useGallery();
  const {pathname} = useLocation();
  const hydrated = useHydrated();

  useEffect(() => {
    const asked = museums.all.map(({param}) => art.open(param)
      .onComplete(answer => dispatch(doors.answered(param, answer.orElse('closed')))));
    return () => asked.forEach(asked => asked.cancel());
  }, []);

  const open = openIn(known);
  const shown = shownFor(known, tab);
  const movingTo = shown.shown === 'movingToAnOpenMuseum' ? shown.museum : undefined;

  useEffect(() => {
    if (hydrated && has(movingTo)) updateSearchParams({tab: movingTo}, {replace: true});
  }, [hydrated, movingTo, updateSearchParams]);

  return <>
    {notEmpty(open) && <Tabs label="museums" current={tab}
      values={open.map(museum => ({...museum, to: `${pathname}${searchFromShown({tab: museum.param})}`}))}/>}
    {{
      wall: <ArtGallery/>,
      noMuseumOpen: <StandIn src={missingWall} alt="no museum is open"/>,
      movingToAnOpenMuseum: <Loading label="loading gallery"/>,
      loading: <Loading label="loading gallery"/>
    }[shown.shown]}
  </>;
};
