import {FC} from 'react';
import {seeded} from '@components/fibs';
import {useSearchParamsObject} from '@frame/navigation/search-params';
import {AccordionsExplained} from './Explained';
import {foldMotionParam} from './fold-motion';
import {foldTypeParam} from './fold-type';

type Draws = ReturnType<typeof seeded>;

const paragraphs = (count: number, dealt: () => string, {randNumber, randParagraph}: Draws) =>
  Array.from({length: count}, () => ({
    key: dealt(),
    value: Array.from({length: randNumber({min: 1, max: 6})}, () => randParagraph()).join(' ')
  }));

const draws = seeded('the accordion exhibits');
const dealt = draws.wordDeck();
const contents = {
  measured: {inclusive: paragraphs(5, dealt, draws), exclusive: paragraphs(5, dealt, draws)},
  known: {inclusive: paragraphs(5, dealt, draws), exclusive: paragraphs(5, dealt, draws)},
  platform: {inclusive: paragraphs(5, dealt, draws), exclusive: paragraphs(5, dealt, draws)},
  gridRow: {inclusive: paragraphs(5, dealt, draws), exclusive: paragraphs(5, dealt, draws)}
};

const AccordionsTab: FC = () => {
  const {type, style, updateSearchParams} =
    useSearchParamsObject({type: foldTypeParam, style: foldMotionParam}, {type: 'exclusive', style: 'reveal'});

  return <AccordionsExplained contents={contents} type={type}
    onTypeChosen={next => updateSearchParams({type: next})}
    motion={style} onMotionChosen={next => updateSearchParams({style: next})}/>;
};

export default AccordionsTab;
