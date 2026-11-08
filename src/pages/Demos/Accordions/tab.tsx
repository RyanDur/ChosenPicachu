import {FC} from 'react';
import {seeded} from '@components/fibs';
import {useSearchParamsObject} from '@navigation/search-params';
import {AccordionsExplained} from './Explained';
import {foldMotionParam} from './fold-motion';
import {foldTypeParam} from './fold-type';

type Draws = ReturnType<typeof seeded>;

const paragraphs = (count: number, dealt: () => string, {randNumber, randParagraph}: Draws) =>
  Array.from({length: count}, () => ({
    title: dealt(),
    text: Array.from({length: randNumber({min: 1, max: 6})}, () => randParagraph()).join(' ')
  }));

const draws = seeded('the accordion exhibits');
const dealt = draws.wordDeck();
const foldLists = {
  measured: {inclusive: paragraphs(5, dealt, draws), exclusive: paragraphs(5, dealt, draws)},
  known: {inclusive: paragraphs(5, dealt, draws), exclusive: paragraphs(5, dealt, draws)},
  platform: {inclusive: paragraphs(5, dealt, draws), exclusive: paragraphs(5, dealt, draws)},
  gridRow: {inclusive: paragraphs(5, dealt, draws), exclusive: paragraphs(5, dealt, draws)}
};

export const Room: FC = () => {
  const {type, style, updateSearchParams} =
    useSearchParamsObject({type: foldTypeParam, style: foldMotionParam}, {type: 'exclusive', style: 'reveal'});

  return <AccordionsExplained foldLists={foldLists} type={type}
    onTypeChosen={next => updateSearchParams({type: next})}
    motion={style} onMotionChosen={next => updateSearchParams({style: next})}/>;
};
