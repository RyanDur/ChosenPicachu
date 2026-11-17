import {tableParts} from './part-pages';
import {tableTutorials} from './tutorial-pages';

type Entry = {
  title: string;
  to: string;
  heading?: string;
  search?: Record<string, string>;
};

const parts: Entry[] = tableParts.inOrder.map(part => {
  const {name, ordinal} = tableParts.told(part);
  return {title: `${ordinal}. ${name}`, ...tableParts.whereIs(ordinal)};
});

const tutorials: Entry[] = tableTutorials.all().map(tutorial => ({
  title: `${tableParts.inTheBook + tableTutorials.placeOf(tutorial).ordinal}. ${tableTutorials.nameOf(tutorial)}`,
  to: tableTutorials.addressOf(tutorial)
}));

const minutes = tableParts.inOrder.reduce((sum, part) => sum + tableParts.told(part).minutes, 0) +
  tableTutorials.all().reduce((sum, tutorial) => sum + tableTutorials.minutesOf(tutorial), 0);

export const tablesContents = {entries: [...parts, ...tutorials], minutes};
