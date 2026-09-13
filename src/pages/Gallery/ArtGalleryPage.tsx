import {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {Result, has} from '@ryandur/sand';
import {Tabs} from '@components/Tabs';
import {Loading} from '@components/Loading';
import {useSearchParamsObject} from '@components/search-params';
import {ArtGallery, Source} from '@components/art-gallery';
import {art} from '@components/art-gallery/museums';
import {sourceParam} from '@components/art-gallery/museums/types/resource';
import {HTTPError} from '@transport/types';

const museums = [
  {display: 'The Art Institute of Chicago', param: Source.AIC},
  {display: 'Harvard Art Museums', param: Source.HARVARD},
  {display: 'The Victoria and Albert Museum', param: Source.VAM}
];

type Answers = Partial<Record<Source, boolean>>;

const openIn = (answers: Answers) => museums.filter(({param}) => answers[param] === true);

const answering = (museum: Source, tell: Dispatch<SetStateAction<Answers>>) => (answer: Result<boolean, HTTPError>): void =>
  tell(known => ({...known, [museum]: answer.orElse(false)}));

export const ArtGalleryPage: FC = () => {
  const [answers, updateAnswers] = useState<Answers>({});
  const {tab, updateSearchParams} = useSearchParamsObject({tab: sourceParam});

  useEffect(() => {
    const asking = museums.map(({param}) => art.open(param).onComplete(answering(param, updateAnswers)));
    return () => asking.forEach(asked => asked.cancel());
  }, []);

  const open = openIn(answers);
  const settled = museums.every(({param}) => has(answers[param]));
  const showing = open.some(({param}) => param === tab);

  useEffect(() => {
    const [first] = openIn(answers);
    if (settled && has(tab) && has(first) && !openIn(answers).some(({param}) => param === tab)) {
      updateSearchParams({tab: first.param}, {replace: true});
    }
  }, [settled, tab, answers, updateSearchParams]);

  return <>
    <Tabs label="museums" defaultTab={open[0]?.param} values={open}/>
    {showing ? <ArtGallery/> : settled || <Loading label="loading gallery"/>}
  </>;
};
