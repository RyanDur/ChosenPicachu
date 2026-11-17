import {shares} from './shares';
import {Maybe, nothing, some} from '@ryandur/sand';
import {Direction} from './sorting';

export type Report =
  | {readonly about: 'column'; readonly name: string; readonly landedAt: number; readonly outOf: number}
  | {readonly about: 'row'; readonly name: string; readonly landedAt: number; readonly outOf: number}
  | {readonly about: 'share'; readonly name: string; readonly share: number}
  | {readonly about: 'sort'; readonly name: string; readonly direction: Maybe<Direction>};

const move = (report: Report): string => {
  switch (report.about) {
    case 'column':
      return `${report.name} moved to column ${report.landedAt + 1} of ${report.outOf}`;
    case 'row':
      return `${report.name} moved to ${report.landedAt + 1} of ${report.outOf}`;
    case 'share':
      return `${report.name} resized to ${shares.wholePercent(report.share)}%`;
    case 'sort':
      return report.direction.map(direction => `${report.name} sorted ${direction}`).orElse(`${report.name} sort reset`);
  }
};

export type Landing = {readonly name: string; readonly order: readonly string[]};

const landing = (axis: 'column' | 'row', orderAtLift: readonly string[], held: string, {name, order}: Landing): Maybe<Report> => {
  const from = orderAtLift.indexOf(held);
  const to = order.indexOf(held);
  if (to === from || to < 0) {
    return nothing();
  }
  const report: Report = axis === 'column'
    ? {about: 'column', name, landedAt: to, outOf: order.length}
    : {about: 'row', name, landedAt: to, outOf: order.length};
  return some(report);
};

const spoken = (report: Maybe<Report>): string => report.map(move).orElse('');

export const tableReports = {
  move,
  landing,
  spoken
};
