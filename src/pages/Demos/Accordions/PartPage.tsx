import {FC, ReactNode, useId} from 'react';
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
import '../PartPage.css';

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
};

const partWritings: Record<AccordionPart, PartWriting> = {
  'a-box-remembers-the-fold': {
    introduction: <RemembersTheFoldIntroduction/>,
    exhibitAndRuns: <RemembersTheFold folds={knownFolds}/>
  },
  'the-max-height-guess': {
    introduction: <MaxHeightGuessIntroduction/>,
    exhibitAndRuns: <MaxHeightGuess/>
  },
  'the-measured-height': {
    introduction: <MeasuredHeightIntroduction/>,
    exhibitAndRuns: <MeasuredHeight folds={measuredFolds}/>
  },
  'what-the-platform-gives-now': {
    introduction: <PlatformGivesNowIntroduction/>,
    exhibitAndRuns: <PlatformGivesNow folds={platformFolds}/>
  },
  'how-a-sliding-fold-moves': {
    introduction: <SlidingFoldMovesIntroduction/>,
    exhibitAndRuns: <SlidingFoldMoves folds={slidingFolds}/>
  }
};

export const PartPage: FC<{readonly part: AccordionPart}> = ({part}) => {
  const titled = `part${useId()}`;
  const {name, ordinal} = accordionParts.told(part);
  return <section aria-labelledby={titled} className="part-page">
    <header className="part-opening">
      <hgroup>
        <p className="caption">
          {`${demoTab.names[DemoTopics.accordions]} · part ${ordinal} of ${accordionParts.inTheBook}`}
        </p>
        <h2 id={titled} className="title">{name}</h2>
      </hgroup>
      {partWritings[part].introduction}
    </header>
    <PartsAndDials level={3}/>
    <section className="part-body">
      {partWritings[part].exhibitAndRuns}
    </section>
    <PartFoot part={part}/>
  </section>;
};
