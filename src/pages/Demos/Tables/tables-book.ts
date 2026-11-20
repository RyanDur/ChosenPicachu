import {Maybe, maybe} from '@ryandur/sand';
import {PartPlace, TablePart, tableParts} from './part-pages';
import {Tutorial, tableTutorials} from './tutorial-pages';

export type BookPart = TablePart | Tutorial;

type Signposted = {part: BookPart; place: PartPlace};

const inOrder: readonly Signposted[] = [
  ...tableParts.inOrder.map(part => ({part, place: tableParts.placeOf(part)})),
  ...tableTutorials.all().map(tutorial => ({part: tutorial, place: tableTutorials.placeOf(tutorial)}))
];

const signposts: PartPlace[] = inOrder.map(({place}) => place);

const minutes = tableParts.inOrder.reduce((sum, part) => sum + tableParts.told(part).minutes, 0) +
  tableTutorials.all().reduce((sum, tutorial) => sum + tableTutorials.minutesOf(tutorial), 0);

const besides = (part: BookPart, step: number): Maybe<PartPlace> =>
  maybe(signposts[inOrder.findIndex(signposted => signposted.part === part) + step]);

export const tablesBook = {
  minutes,
  inTheBook: signposts.length,
  previousOf: (part: BookPart): Maybe<PartPlace> => besides(part, -1),
  nextOf: (part: BookPart): Maybe<PartPlace> => besides(part, 1)
};
