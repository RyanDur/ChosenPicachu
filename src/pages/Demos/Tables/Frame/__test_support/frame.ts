import {has, is} from '@ryandur/sand';
import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {env} from '@env';
import {Feed} from '@pages/Demos/__test_support/feed';
import type {Motion, Origin, Pace} from '../../../Controls';
import {startingTable} from '../starting';
import {define, feed as feedTheTable} from '../boot';

type Stage = {
  readonly feed?: Feed;
  readonly pace?: Pace;
  readonly origin?: Origin;
  readonly motion?: Motion;
};

export const vanillaFrame = {
  stand: ({feed, pace = 'eager', origin = 'hide', motion = 'animated'}: Stage = {}): void => {
    window.__env = {...env, tradeFeed: has(feed) ? feed.url : ''};
    window.__frame = {pace, origin, motion};
    document.body.innerHTML = startingTable({origin, motion});
    if (!is(customElements.get('drag-sortable-table'))) {
      define(pace);
    }
    feedTheTable(document);
  },
  host: (): Element | null => screen.getByRole('table').closest('drag-sortable-table'),
  header: (name: string): HTMLElement => screen.getByRole('columnheader', {name: new RegExp(name)}),
  windowNames: (): string[] => screen.getAllByRole('rowheader').map(header => header.textContent.trim()),
  moveReport: (): HTMLElement => screen.getByRole('status', {name: 'move report'}),
  choose: async (column: string, direction: 'ascending' | 'descending'): Promise<void> =>
    userEvent.click(within(screen.getByLabelText(`sort ${column} by`)).getByRole('button', {name: direction, hidden: true})),
  moveRowByKey: async (row: number, key: string): Promise<void> => {
    screen.getByRole('button', {name: `move row ${row}`}).focus();
    await userEvent.keyboard(key);
  }
};
