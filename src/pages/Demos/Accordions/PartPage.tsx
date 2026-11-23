import {FC, ReactNode} from 'react';
import {PartSection} from '@pages/Demos/PartSection';
import {ThePart} from '@pages/Demos/the-part';
import {PartOpening} from '@pages/Demos/PartOpening';
import {PartPanel} from '@pages/Demos/PartPanel';
import {PartDemo} from '@pages/Demos/PartDemo';
import {Behind, Beside, Onward, PartFoot} from '@pages/Demos/PartFoot';
import {bookEnds} from '@pages/Demos/book-ends';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {demoTab, DemoTopics} from '@pages/Demos';
import {AccordionPart, accordionParts, BookPart} from './part-pages';
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

type PartContents = {
  readonly introduction: ReactNode;
  readonly exhibitAndRuns: ReactNode;
  readonly offersTheFoldDials: boolean;
};

const partContents: Record<AccordionPart, PartContents> = {
  'a-box-remembers-the-fold': {
    introduction: <RemembersTheFoldIntroduction/>,
    exhibitAndRuns: <RemembersTheFold folds={knownFolds}/>,
    offersTheFoldDials: true
  },
  'the-max-height-guess': {
    introduction: <MaxHeightGuessIntroduction/>,
    exhibitAndRuns: <MaxHeightGuess/>,
    offersTheFoldDials: false
  },
  'the-measured-height': {
    introduction: <MeasuredHeightIntroduction/>,
    exhibitAndRuns: <MeasuredHeight folds={measuredFolds}/>,
    offersTheFoldDials: true
  },
  'what-the-platform-gives-now': {
    introduction: <PlatformGivesNowIntroduction/>,
    exhibitAndRuns: <PlatformGivesNow folds={platformFolds}/>,
    offersTheFoldDials: true
  },
  'how-a-sliding-fold-moves': {
    introduction: <SlidingFoldMovesIntroduction/>,
    exhibitAndRuns: <SlidingFoldMoves folds={slidingFolds}/>,
    offersTheFoldDials: true
  }
};

const theFirstPart: Behind = bookEnds.behind(DemoTopics.accordions);
const theNextTab: Onward = bookEnds.onward(DemoTopics.accordions);

export const PartPage: FC<{readonly part: AccordionPart}> = ({part}) => {
  const carried = useCarriedAddress();
  const besidePart = (beside: BookPart): Beside => {
    const {to, heading} = accordionParts.whereIs(beside);
    return {kind: 'part', title: accordionParts.numbered(beside), address: carried(to, heading)};
  };
  const {name, ordinal} = accordionParts.told(part);
  const behind = accordionParts.previousOf(part).map((beside): Behind => besidePart(beside)).orElse(theFirstPart);
  const onward = accordionParts.nextOf(part).map((beside): Onward => besidePart(beside)).orElse(theNextTab);
  const place = `${demoTab.names[DemoTopics.accordions]} · part ${ordinal} of ${accordionParts.inTheBook}`;
  const {introduction, exhibitAndRuns, offersTheFoldDials} = partContents[part];
  return <ThePart value={{heading: name, headingId: `${part}-heading`, place, previous: behind, next: onward}}>
    <PartSection>
      <PartOpening>{introduction}</PartOpening>
      <PartPanel><PartsAndDials offersTheFoldDials={offersTheFoldDials}/></PartPanel>
      <PartDemo>{exhibitAndRuns}</PartDemo>
      <PartFoot/>
    </PartSection>
  </ThePart>;
};
