import {FC, ReactNode} from 'react';
import {seeded} from '@components/fibs';
import {AccordionsExplained} from './Explained';
import {MaxHeightGuess} from './MaxHeightGuess';
import {MeasuredHeight} from './MeasuredHeight';
import {RemembersTheFold} from './RemembersTheFold';
import {PartPage} from './PartPage';
import {AccordionPart} from './part-pages';
import {useShownPart} from './useShownPart';

type Draws = ReturnType<typeof seeded>;

const paragraphs = (count: number, dealt: () => string, {randNumber, randParagraph}: Draws) =>
  Array.from({length: count}, () => ({
    heading: dealt(),
    story: Array.from({length: randNumber({min: 1, max: 6})}, () => randParagraph()).join(' ')
  }));

const draws = seeded('the accordion exhibits');
const dealt = draws.wordDeck();
const measuredFolds = {inclusive: paragraphs(5, dealt, draws), exclusive: paragraphs(5, dealt, draws)};
const knownFolds = {inclusive: paragraphs(5, dealt, draws), exclusive: paragraphs(5, dealt, draws)};
const platformFolds = {inclusive: paragraphs(5, dealt, draws), exclusive: paragraphs(5, dealt, draws)};

const pagesOfParts: Record<AccordionPart, ReactNode> = {
  'a-box-remembers-the-fold': <RemembersTheFold folds={knownFolds}/>,
  'the-max-height-guess': <MaxHeightGuess/>,
  'the-measured-height': <MeasuredHeight folds={measuredFolds}/>
};

export const Room: FC = () => useShownPart().either(
  part => <PartPage part={part}>{pagesOfParts[part]}</PartPage>,
  () => <AccordionsExplained folds={platformFolds}/>);
