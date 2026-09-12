import type {Motion, Origin} from '../../Controls';
import tableHtml from './table.html?raw';

export type Dressing = {
  readonly origin: Origin;
  readonly motion: Motion;
};

export const startingTable = ({origin, motion}: Dressing): string =>
  tableHtml.replace('class="fancy-table sortable apportioned"', `class="fancy-table sortable apportioned ${origin} ${motion}"`);
