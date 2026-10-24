import {has, is} from '@ryandur/sand';
import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {env} from '@env';
import {Feed} from '@pages/Demos/__test_support/feed';
import type {Motion, Origin, Pace} from '../../../Controls';
import {startingTable} from '../starting';
import {define, feed as feedTheTable} from '../boot';
import {builds} from '../builds';

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
const press = async (...keys: string[]): Promise<void> => {
  for (const key of keys) {
    await userEvent.keyboard(key);
  }
};

export const vanillaFrame = {
  stand: ({feed, pace = 'eager', origin = 'hide', motion = 'animated'}: Stage = {}): void => {
    window.__env = {...env, tradeFeed: has(feed) ? feed.url : ''};
    window.__frame = {pace, origin, motion};
    document.body.innerHTML = startingTable({origin, motion});
    const defined = customElements.get('drag-sortable-table');
    if (!is(defined)) {
      define(pace);
    } else if (defined !== builds[pace]) {
      throw new Error(`this window defined drag-sortable-table for another pace than ${pace}; stand ${pace} in its own spec file`);
    }
    feedTheTable(document);
  },
  header,
  row,
  grip,
  figures: (window: string): HTMLElement[] => within(row(window)).getAllByRole('cell'),
  columnOrder: (): string[] => screen.getAllByRole('columnheader').map(column => column.getAttribute('aria-label') ?? ''),
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
