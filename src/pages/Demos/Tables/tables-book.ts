import {PartPlace, tableParts} from './part-pages';
import {tableTutorials} from './tutorial-pages';

const signposts: PartPlace[] = [
  ...tableParts.inOrder.map(tableParts.placeOf),
  ...tableTutorials.all().map(tableTutorials.placeOf)
];

const minutes = tableParts.inOrder.reduce((sum, part) => sum + tableParts.told(part).minutes, 0) +
  tableTutorials.all().reduce((sum, tutorial) => sum + tableTutorials.minutesOf(tutorial), 0);

export const tablesBook = {signposts, minutes, inTheBook: signposts.length};
