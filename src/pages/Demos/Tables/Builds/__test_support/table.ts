import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type MenuChoice = 'ascending' | 'descending' | 'reset';

const table = (): HTMLTableElement => {
  const found = screen.getAllByRole('table')[0];
  if (!(found instanceof HTMLTableElement)) throw new Error('no table');
  return found;
};
const ownText = (cell: Element): string =>
  cell.getAttribute('aria-label')
  ?? [...cell.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent ?? '').join('').trim();
const lanes = (): HTMLTableRowElement[] => [...table().tBodies[0].rows];
const rowOf = (window: string): HTMLTableRowElement => {
  const row = lanes().find(lane => ownText(lane.cells[0]) === window);
  if (!row) throw new Error(`no row for ${window}`);
  return row;
};
const header = (name: string): HTMLElement => within(table()).getByRole('columnheader', {name});
const grip = (window: string): HTMLElement => within(rowOf(window)).getByRole('button', {name: /move row/});
const menuChoice = (column: string, choice: MenuChoice): HTMLElement =>
  within(screen.getByLabelText(`sort ${column} by`)).getByRole('button', {name: choice, hidden: true});

export const liveTable = {
  header,
  grip,
  columnOrder: (): string[] => within(table()).getAllByRole('columnheader').map(column => column.getAttribute('aria-label') ?? ''),
  windowNames: (): string[] => lanes().map(lane => ownText(lane.cells[0])),
  announced: (): string[] => screen.getAllByRole('status', {name: 'move report'}).map(({textContent}) => textContent ?? '').filter(text => text !== ''),
  moveReports: (): HTMLElement[] => screen.getAllByRole('status', {name: 'move report'}),
  sortToggle: (column: string): HTMLElement | null => screen.queryByRole('button', {name: `sort ${column}`}),
  sortToggleIn: (column: string): HTMLElement | null => within(header(column)).queryByRole('button', {name: `sort ${column}`}),
  resizeHandleIn: (column: string): HTMLElement => within(header(column)).getByRole('button', {name: new RegExp(`resize ${column}`)}),
  menuChoice,
  choose: async (column: string, choice: MenuChoice): Promise<void> => userEvent.click(menuChoice(column, choice)),
  focusColumn: (name: string): void => header(name).focus(),
  focusRow: (window: string): void => grip(window).focus(),
  press: async (...keys: string[]): Promise<void> => {
    for (const key of keys) {
      await userEvent.keyboard(key);
    }
  }
};
