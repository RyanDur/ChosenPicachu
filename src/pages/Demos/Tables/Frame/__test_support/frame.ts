import {has} from '@ryandur/sand';
import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {env} from '@env';
import {Feed} from '@pages/Demos/__test_support/feed';
import type {Motion, Origin, Pace} from '../../../Controls';
import {startingTable} from '../starting';
import {feed as feedTheTable} from '../boot';

type Stage = {
  readonly feed?: Feed;
  readonly pace?: Pace;
  readonly origin?: Origin;
  readonly motion?: Motion;
};

type MenuChoice = 'ascending' | 'descending' | 'reset';

const header = (name: string): HTMLElement => screen.getByRole('columnheader', {name: new RegExp(name)});
const row = (window: string): HTMLElement => screen.getByRole('row', {name: new RegExp(window)});
const numberedGrip = (rowNumber: number): HTMLElement => screen.getByRole('button', {name: `move row ${rowNumber}`});
const grip = (window: string): HTMLElement => within(row(window)).getByRole('button', {name: /move row/});
const columnOrder = (): string[] => screen.getAllByRole('columnheader').map(column => column.getAttribute('aria-label') ?? '');
const press = async (...keys: string[]): Promise<void> => {
  for (const key of keys) {
    await userEvent.keyboard(key);
  }
};

export const vanillaFrame = {
  arrive: ({origin = 'hide', motion = 'animated'}: Stage = {}): void => {
    document.body.innerHTML = startingTable({origin, motion});
  },
  stand: ({feed, pace = 'eager', origin = 'hide', motion = 'animated'}: Stage = {}): void => {
    window.__env = {...env, tradeFeed: has(feed) ? feed.url : ''};
    document.body.innerHTML = startingTable({origin, motion});
    feedTheTable(document, pace);
  },
  table: (): HTMLElement => screen.getByRole('table', {name: 'Live aggregations by window'}),
  header,
  row,
  grip,
  figure: (window: string, column: string): HTMLElement =>
    within(row(window)).getAllByRole('cell')[columnOrder().indexOf(column) - 1],
  columnOrder,
  windowNames: (): string[] => screen.getAllByRole('rowheader').map(rowHeader => rowHeader.textContent.trim()),
  moveReport: (): HTMLElement => screen.getByRole('status', {name: 'move report'}),
  choose: async (column: string, choice: MenuChoice): Promise<void> =>
    userEvent.click(within(screen.getByLabelText(`sort ${column} by`)).getByRole('button', {name: choice, hidden: true})),
  liftAndLetGo: async (rowNumber: number): Promise<void> => {
    const held = numberedGrip(rowNumber);
    await userEvent.pointer([{keys: '[MouseLeft>]', target: held}, {keys: '[/MouseLeft]', target: held}]);
  },
  focusColumn: (name: string): void => header(name).focus(),
  focusRow: (window: string): void => grip(window).focus(),
  press,
  moveRowByKey: async (rowNumber: number, key: string): Promise<void> => {
    numberedGrip(rowNumber).focus();
    await press(key);
  },
  moveColumnByKey: async (column: string, key: string): Promise<void> => {
    header(column).focus();
    await press(key);
  }
};
