import {has} from '@ryandur/sand';
import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {environment} from '@transport';
import {Feed} from '@pages/Demos/__test_support/feed';
import type {Motion, Origin, Pace} from '../../../Controls';
import {startingTable} from '../starting';
import {boot} from '../boot';

type Stage = {
  readonly feed?: Feed;
  readonly pace?: Pace;
  readonly origin?: Origin;
  readonly motion?: Motion;
};

type MenuChoice = 'ascending' | 'descending' | 'reset';

const header = (name: string): HTMLElement => screen.getByRole('columnheader', {name: new RegExp(name)});
const row = (lookback: string): HTMLElement => screen.getByRole('row', {name: new RegExp(lookback)});
const numberedGrip = (rowNumber: number): HTMLElement => screen.getByRole('button', {name: `move row ${rowNumber}`});
const grip = (lookback: string): HTMLElement => within(row(lookback)).getByRole('button', {name: /move row/});
const columnOrder = (): string[] => screen.getAllByRole('columnheader').map(column => column.getAttribute('aria-label') ?? '');
const menuItem = (column: string, words: string): HTMLElement =>
  within(screen.getByLabelText(`sort ${column} by`)).getByRole('button', {name: words, hidden: true});
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
    window.__environment = {...environment, tradeFeed: has(feed) ? feed.url : ''};
    window.__frame = {pace, origin, motion};
    document.body.innerHTML = startingTable({origin, motion});
    boot(document);
  },
  standWithAHeaderUnnamed: (column: string): void => {
    window.__environment = {...environment, tradeFeed: ''};
    window.__frame = {pace: 'eager', origin: 'hide', motion: 'animated'};
    document.body.innerHTML = startingTable({origin: 'hide', motion: 'animated'});
    header(column).removeAttribute('data-column');
    boot(document);
  },
  standWithASortChoiceWorded: (column: string, choice: MenuChoice, words: string): void => {
    window.__environment = {...environment, tradeFeed: ''};
    window.__frame = {pace: 'eager', origin: 'hide', motion: 'animated'};
    document.body.innerHTML = startingTable({origin: 'hide', motion: 'animated'});
    menuItem(column, choice).textContent = words;
    boot(document);
  },
  table: (): HTMLElement => screen.getByRole('table', {name: 'Live totals by lookback'}),
  header,
  row,
  grip,
  figure: (lookback: string, column: string): HTMLElement =>
    within(row(lookback)).getAllByRole('cell')[columnOrder().indexOf(column) - 1],
  columnOrder,
  lookbackNames: (): string[] => screen.getAllByRole('rowheader').map(rowHeader => rowHeader.textContent.trim()),
  moveReport: (): HTMLElement => screen.getByRole('status', {name: 'move report'}),
  choose: async (column: string, choice: MenuChoice): Promise<void> => userEvent.click(menuItem(column, choice)),
  chooseWorded: async (column: string, words: string): Promise<void> => userEvent.click(menuItem(column, words)),
  liftAndLetGo: async (rowNumber: number): Promise<void> => {
    const held = numberedGrip(rowNumber);
    await userEvent.pointer([{keys: '[MouseLeft>]', target: held}, {keys: '[/MouseLeft]', target: held}]);
  },
  focusColumn: (name: string): void => header(name).focus(),
  focusRow: (lookback: string): void => grip(lookback).focus(),
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
