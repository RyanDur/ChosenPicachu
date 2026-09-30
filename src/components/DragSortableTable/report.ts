import {wholePercent} from '@components/Table/shares';
import {Maybe, has, nothing, some} from '@ryandur/sand';
import {Direction} from './sorting';

export type Report =
  | {readonly about: 'column'; readonly name: string; readonly position: number; readonly of: number}
  | {readonly about: 'row'; readonly name: string; readonly position: number; readonly of: number}
  | {readonly about: 'share'; readonly name: string; readonly share: number}
  | {readonly about: 'sort'; readonly name: string; readonly direction?: Direction};

export const moveReport = (report: Report): string => {
  switch (report.about) {
    case 'column':
      return `${report.name} moved to column ${report.position + 1} of ${report.of}`;
    case 'row':
      return `${report.name} moved to ${report.position + 1} of ${report.of}`;
    case 'share':
      return `${report.name} resized to ${wholePercent(report.share)}%`;
    case 'sort':
      return has(report.direction) ? `${report.name} sorted ${report.direction}` : `${report.name} sort reset`;
  }
};

export type Landing = {readonly name: string; readonly order: readonly string[]};

export const landingReport = (axis: 'column' | 'row', orderAtLift: readonly string[], held: string, {name, order}: Landing): Maybe<Report> => {
  const from = orderAtLift.indexOf(held);
  const to = order.indexOf(held);
  if (to === from || to < 0) {
    return nothing();
  }
  const report: Report = axis === 'column'
    ? {about: 'column', name, position: to, of: order.length}
    : {about: 'row', name, position: to, of: order.length};
  return some(report);
};
