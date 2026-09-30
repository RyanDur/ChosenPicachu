import {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {Result, has, maybe, notEmpty} from '@ryandur/sand';
import {Tabs} from '@components/Tabs';
import {Loading} from '@components/Loading';
import {useSearchParamsObject} from '@components/search-params';
import {ArtGallery, Source} from '@components/art-gallery';
import {art} from '@components/art-gallery/museums';
import {sourceParam} from '@components/art-gallery/museums/source';
import {museums} from '@components/art-gallery/museums/museums';
import {HTTPError} from '@transport/types';
import missingWall from '../../assets/icons/missing-wall.svg?url';

type Answers = Partial<Record<Source, boolean>>;

const openIn = (answers: Answers) => museums.filter(({param}) => answers[param] === true);

const settledIn = (answers: Answers): boolean => museums.every(({param}) => has(answers[param]));

type Shown =
  | {readonly shown: 'wall'}
  | {readonly shown: 'noMuseumOpen'}
  | {readonly shown: 'movingToAnOpenMuseum'; readonly museum: Source}
  | {readonly shown: 'loading'};

const shownFor = (answers: Answers, tab?: Source): Shown => {
  const open = openIn(answers);
  if (open.some(({param}) => param === tab)) return {shown: 'wall'};
  if (!settledIn(answers)) return {shown: 'loading'};
  return maybe(open[0])
    .map(({param}): Shown => ({shown: 'movingToAnOpenMuseum', museum: param}))
    .orElse<Shown>({shown: 'noMuseumOpen'});
};

const answered = (museum: Source, tell: Dispatch<SetStateAction<Answers>>) => (answer: Result<boolean, HTTPError>): void =>
  tell(known => ({...known, [museum]: answer.orElse(false)}));

export const ArtGalleryPage: FC = () => {
  const [answers, updateAnswers] = useState<Answers>({});
  const {tab, updateSearchParams} = useSearchParamsObject({tab: sourceParam});

  useEffect(() => {
    const asked = museums.map(({param}) => art.open(param).onComplete(answered(param, updateAnswers)));
    return () => asked.forEach(asked => asked.cancel());
  }, []);

  const open = openIn(answers);
  const shown = shownFor(answers, tab);
  const movingTo = shown.shown === 'movingToAnOpenMuseum' ? shown.museum : undefined;

  useEffect(() => {
    if (has(movingTo)) updateSearchParams({tab: movingTo}, {replace: true});
  }, [movingTo, updateSearchParams]);

  return <>
    {notEmpty(open) && <Tabs label="museums" values={open}/>}
    {{
      wall: <ArtGallery/>,
      noMuseumOpen: <img className="stand-in" src={missingWall} alt="no museum is open"/>,
      movingToAnOpenMuseum: <Loading label="loading gallery"/>,
      loading: <Loading label="loading gallery"/>
    }[shown.shown]}
  </>;
};
