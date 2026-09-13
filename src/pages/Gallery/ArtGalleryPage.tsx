import {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {Result, empty, has, notEmpty} from '@ryandur/sand';
import {Tabs} from '@components/Tabs';
import {Loading} from '@components/Loading';
import {useSearchParamsObject} from '@components/search-params';
import {ArtGallery, Source} from '@components/art-gallery';
import {art} from '@components/art-gallery/museums';
import {sourceParam} from '@components/art-gallery/museums/source';
import {HTTPError} from '@transport/types';
import missingWall from '../../assets/icons/missing-wall.svg?url';

const museums = [
  {display: 'The Art Institute of Chicago', param: Source.AIC},
  {display: 'Harvard Art Museums', param: Source.HARVARD},
  {display: 'The Victoria and Albert Museum', param: Source.VAM},
  {display: 'The Cleveland Museum of Art', param: Source.CLEVELAND}
];

type Answers = Partial<Record<Source, boolean>>;

const openIn = (answers: Answers) => museums.filter(({param}) => answers[param] === true);

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
  const settled = museums.every(({param}) => has(answers[param]));
  const showing = open.some(({param}) => param === tab);
  const first = open[0]?.param;

  useEffect(() => {
    if (settled && has(first) && !showing) updateSearchParams({tab: first}, {replace: true});
  }, [settled, first, showing, updateSearchParams]);

  return <>
    {notEmpty(open) && <Tabs label="museums" values={open}/>}
    {showing && <ArtGallery/>}
    {settled && empty(open) && <img className="stand-in" src={missingWall} alt="no museum is open"/>}
    {settled || <Loading label="loading gallery"/>}
  </>;
};
