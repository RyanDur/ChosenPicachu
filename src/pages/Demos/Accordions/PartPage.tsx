import {FC, ReactNode} from 'react';
import {PartSection} from '@pages/Demos/PartSection';
import {demoTab, DemoTopics} from '@pages/Demos';
import {AccordionPart, accordionParts} from './part-pages';
import {PartFoot} from './PartFoot';
import {seeded} from '@components/fibs';
import {MaxHeightGuess} from './MaxHeightGuess';
import {MeasuredHeight} from './MeasuredHeight';
import {PlatformGivesNow} from './PlatformGivesNow';
import {SlidingFoldMoves} from './SlidingFoldMoves';
import {RemembersTheFold} from './RemembersTheFold';
import {PartsAndDials} from './PartsAndDials';
import {RemembersTheFoldIntroduction} from './RemembersTheFoldIntroduction';
import {MaxHeightGuessIntroduction} from './MaxHeightGuessIntroduction';
import {MeasuredHeightIntroduction} from './MeasuredHeightIntroduction';
import {PlatformGivesNowIntroduction} from './PlatformGivesNowIntroduction';
import {SlidingFoldMovesIntroduction} from './SlidingFoldMovesIntroduction';

const draws = seeded('the accordion exhibits');
const dealt = draws.wordDeck();

const dealFolds = (count: number) =>
  Array.from({length: count}, () => ({
    heading: dealt(),
    story: Array.from({length: draws.randNumber({min: 1, max: 6})}, () => draws.randParagraph()).join(' ')
  }));
const measuredFolds = {inclusive: dealFolds(5), exclusive: dealFolds(5)};
const knownFolds = {inclusive: dealFolds(5), exclusive: dealFolds(5)};
const platformFolds = {inclusive: dealFolds(5), exclusive: dealFolds(5)};
const slidingFolds = {inclusive: dealFolds(5), exclusive: dealFolds(5)};

type PartWriting = {
  readonly introduction: ReactNode;
  readonly exhibitAndRuns: ReactNode;
  readonly dialed: boolean;
};

const partWritings: Record<AccordionPart, PartWriting> = {
  'a-box-remembers-the-fold': {
    introduction: <RemembersTheFoldIntroduction/>,
    exhibitAndRuns: <RemembersTheFold folds={knownFolds}/>,
    dialed: true
  },
  'the-max-height-guess': {
    introduction: <MaxHeightGuessIntroduction/>,
    exhibitAndRuns: <MaxHeightGuess/>,
    dialed: false
  },
  'the-measured-height': {
    introduction: <MeasuredHeightIntroduction/>,
    exhibitAndRuns: <MeasuredHeight folds={measuredFolds}/>,
    dialed: true
  },
  'what-the-platform-gives-now': {
    introduction: <PlatformGivesNowIntroduction/>,
    exhibitAndRuns: <PlatformGivesNow folds={platformFolds}/>,
    dialed: true
  },
  'how-a-sliding-fold-moves': {
    introduction: <SlidingFoldMovesIntroduction/>,
    exhibitAndRuns: <SlidingFoldMoves folds={slidingFolds}/>,
    dialed: true
  }
};

export const PartPage: FC<{readonly part: AccordionPart}> = ({part}) => {
  const {name, ordinal} = accordionParts.told(part);
  const place = `${demoTab.names[DemoTopics.accordions]} · part ${ordinal} of ${accordionParts.inTheBook}`;
  const {introduction, exhibitAndRuns, dialed} = partWritings[part];
  return <PartSection heading={name} place={place} introduction={introduction}
    panel={<PartsAndDials dialed={dialed}/>} foot={<PartFoot part={part}/>}>
    {exhibitAndRuns}
  </PartSection>;
};
