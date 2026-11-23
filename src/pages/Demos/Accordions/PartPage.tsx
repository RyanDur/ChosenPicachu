import {FC, ReactNode} from 'react';
import {PartSection} from '@pages/Demos/PartSection';
import {ThePart} from '@pages/Demos/the-part';
import {PartOpening} from '@pages/Demos/PartOpening';
import {PartDemo} from '@pages/Demos/PartDemo';
import {Behind, Beside, Onward, PartFoot} from '@pages/Demos/PartFoot';
import {bookEnds} from '@pages/Demos/book-ends';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {demoTab, DemoTopics} from '@pages/Demos';
import {AccordionPart, accordionParts, BookPart} from './part-pages';
import {MaxHeightGuess} from './MaxHeightGuess';
import {MeasuredHeight} from './MeasuredHeight';
import {PlatformGivesNow} from './PlatformGivesNow';
import {SlidingFoldMoves} from './SlidingFoldMoves';
import {RemembersTheFold} from './RemembersTheFold';
import {FoldDials} from './FoldDials';
import {RemembersTheFoldIntroduction} from './RemembersTheFoldIntroduction';
import {MaxHeightGuessIntroduction} from './MaxHeightGuessIntroduction';
import {MeasuredHeightIntroduction} from './MeasuredHeightIntroduction';
import {PlatformGivesNowIntroduction} from './PlatformGivesNowIntroduction';
import {SlidingFoldMovesIntroduction} from './SlidingFoldMovesIntroduction';

type PartContents = {
  readonly introduction: ReactNode;
  readonly exhibitAndRuns: ReactNode;
  readonly offersTheFoldDials: boolean;
};

const partContents: Record<AccordionPart, PartContents> = {
  'a-box-remembers-the-fold': {
    introduction: <RemembersTheFoldIntroduction/>,
    exhibitAndRuns: <RemembersTheFold/>,
    offersTheFoldDials: true
  },
  'the-max-height-guess': {
    introduction: <MaxHeightGuessIntroduction/>,
    exhibitAndRuns: <MaxHeightGuess/>,
    offersTheFoldDials: false
  },
  'the-measured-height': {
    introduction: <MeasuredHeightIntroduction/>,
    exhibitAndRuns: <MeasuredHeight/>,
    offersTheFoldDials: true
  },
  'what-the-platform-gives-now': {
    introduction: <PlatformGivesNowIntroduction/>,
    exhibitAndRuns: <PlatformGivesNow/>,
    offersTheFoldDials: true
  },
  'how-a-sliding-fold-moves': {
    introduction: <SlidingFoldMovesIntroduction/>,
    exhibitAndRuns: <SlidingFoldMoves/>,
    offersTheFoldDials: true
  }
};

const behindTheFirstPart: Behind = bookEnds.behind(DemoTopics.accordions);
const onwardFromTheLastPart: Onward = bookEnds.onward(DemoTopics.accordions);

export const PartPage: FC<{readonly part: AccordionPart}> = ({part}) => {
  const carried = useCarriedAddress();
  const besidePart = (beside: BookPart): Beside => {
    const {to, heading} = accordionParts.whereIs(beside);
    return {kind: 'part', title: accordionParts.numbered(beside), address: carried(to, heading)};
  };
  const {name, ordinal} = accordionParts.told(part);
  const behind = accordionParts.previousOf(part).map((beside): Behind => besidePart(beside)).orElse(behindTheFirstPart);
  const onward = accordionParts.nextOf(part).map((beside): Onward => besidePart(beside)).orElse(onwardFromTheLastPart);
  const place = `${demoTab.names[DemoTopics.accordions]} · part ${ordinal} of ${accordionParts.inTheBook}`;
  const {introduction, exhibitAndRuns, offersTheFoldDials} = partContents[part];
  return <ThePart value={{heading: name, headingId: `${part}-heading`, place, previous: behind, next: onward}}>
    <PartSection>
      <PartOpening>{introduction}</PartOpening>
      {offersTheFoldDials && <FoldDials/>}
      <PartDemo>{exhibitAndRuns}</PartDemo>
      <PartFoot/>
    </PartSection>
  </ThePart>;
};
