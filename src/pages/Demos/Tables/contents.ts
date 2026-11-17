import {PartPlace, tableParts} from './part-pages';
import {tableTutorials} from './tutorial-pages';

const parts: PartPlace[] = tableParts.inOrder.map(tableParts.placeOf);

const tutorials: PartPlace[] = tableTutorials.all().map(tableTutorials.placeOf);

const minutes = tableParts.inOrder.reduce((sum, part) => sum + tableParts.told(part).minutes, 0) +
  tableTutorials.all().reduce((sum, tutorial) => sum + tableTutorials.minutesOf(tutorial), 0);

export const tablesContents = {entries: [...parts, ...tutorials], minutes};
