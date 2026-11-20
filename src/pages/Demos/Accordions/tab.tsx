import {FC, ReactNode} from 'react';
import {seeded} from '@components/fibs';
import {AccordionsExplained} from './Explained';
import {MaxHeightGuess} from './MaxHeightGuess';
import {MeasuredHeight} from './MeasuredHeight';
import {PlatformGivesNow} from './PlatformGivesNow';
import {SlidingFoldMoves} from './SlidingFoldMoves';
import {RemembersTheFold} from './RemembersTheFold';
import {PartPage} from './PartPage';
import {PartsAndDials} from './PartsAndDials';
import {AccordionPart} from './part-pages';
import {useShownPart} from './useShownPart';
import {RemembersTheFoldIntroduction} from './RemembersTheFoldIntroduction';
import {MaxHeightGuessIntroduction} from './MaxHeightGuessIntroduction';
import {MeasuredHeightIntroduction} from './MeasuredHeightIntroduction';
import {PlatformGivesNowIntroduction} from './PlatformGivesNowIntroduction';
import {SlidingFoldMovesIntroduction} from './SlidingFoldMovesIntroduction';

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
const slidingFolds = {inclusive: paragraphs(5, dealt, draws), exclusive: paragraphs(5, dealt, draws)};

type Contents = {
  readonly introduction: ReactNode;
  readonly body: ReactNode;
};

const pagesOfParts: Record<AccordionPart, Contents> = {
  'a-box-remembers-the-fold': {introduction: <RemembersTheFoldIntroduction/>, body: <RemembersTheFold folds={knownFolds}/>},
  'the-max-height-guess': {introduction: <MaxHeightGuessIntroduction/>, body: <MaxHeightGuess/>},
  'the-measured-height': {introduction: <MeasuredHeightIntroduction/>, body: <MeasuredHeight folds={measuredFolds}/>},
  'what-the-platform-gives-now': {introduction: <PlatformGivesNowIntroduction/>, body: <PlatformGivesNow folds={platformFolds}/>},
  'how-a-sliding-fold-moves': {introduction: <SlidingFoldMovesIntroduction/>, body: <SlidingFoldMoves folds={slidingFolds}/>}
};

export const Room: FC = () => useShownPart().either(
  part => <PartPage part={part} introduction={pagesOfParts[part].introduction} panel={<PartsAndDials/>}>
    {pagesOfParts[part].body}
  </PartPage>,
  () => <AccordionsExplained/>);
