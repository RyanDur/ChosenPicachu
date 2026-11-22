import type {Motion, Origin} from '../../Controls';
import tableHtml from './table.html?raw';

export type Dressing = {
  readonly origin: Origin;
  readonly motion: Motion;
};

export const startingTable = ({origin, motion}: Dressing): string =>
  tableHtml.replace('class="fancy-table sortable apportioned moved-tinted hide animated"', `class="fancy-table sortable apportioned moved-tinted ${origin} ${motion}"`);
