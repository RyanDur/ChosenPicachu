import {Maybe, maybe} from '@ryandur/sand';
import {PartPlace, tableParts} from './part-pages';
import {tableTutorials} from './tutorial-pages';

const signposts: PartPlace[] = [
  ...tableParts.inOrder.map(tableParts.placeOf),
  ...tableTutorials.all().map(tableTutorials.placeOf)
];

const minutes = tableParts.inOrder.reduce((sum, part) => sum + tableParts.told(part).minutes, 0) +
  tableTutorials.all().reduce((sum, tutorial) => sum + tableTutorials.minutesOf(tutorial), 0);

const besides = (address: string, step: number): Maybe<PartPlace> =>
  maybe(signposts.find(({to}) => to === address))
    .mBind(here => maybe(signposts[signposts.indexOf(here) + step]));

export const tablesBook = {
  signposts,
  minutes,
  inTheBook: signposts.length,
  previousOf: (address: string): Maybe<PartPlace> => besides(address, -1),
  nextOf: (address: string): Maybe<PartPlace> => besides(address, 1)
};
