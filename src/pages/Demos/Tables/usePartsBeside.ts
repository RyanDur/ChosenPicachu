import {Behind, Beside, Onward} from '@pages/Demos/PartFoot';
import {bookEnds} from '@pages/Demos/book-ends';
import {DemoTopics} from '@pages/Demos';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {PartPlace} from './part-pages';
import {BookPart, tablesBook} from './tables-book';

type PartsBeside = {previous: Behind; next: Onward};

const theFirstPart: Behind = bookEnds.behind(DemoTopics.tables);
const theLastPart: Onward = bookEnds.onward(DemoTopics.tables);

export const usePartsBeside = (): (part: BookPart) => PartsBeside => {
  const carried = useCarriedAddress();
  const besidePart = ({title, to, heading}: PartPlace): Beside => ({kind: 'part', title, address: carried(to, heading)});
  return part => ({
    previous: tablesBook.previousOf(part).map((place): Behind => besidePart(place)).orElse(theFirstPart),
    next: tablesBook.nextOf(part).map((place): Onward => besidePart(place)).orElse(theLastPart)
  });
};
