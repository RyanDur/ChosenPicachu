import type {Motion, Origin} from '../../Controls';
import tableHtml from './table.html?raw';

export type Dressing = {
  readonly origin: Origin;
  readonly motion: Motion;
};

export const startingTable = ({origin, motion}: Dressing): string =>
  tableHtml.replace('origin="hide" motion="animated"', `origin="${origin}" motion="${motion}"`);
