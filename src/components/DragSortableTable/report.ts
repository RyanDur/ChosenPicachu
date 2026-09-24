import {has} from '@ryandur/sand';
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
      return `${report.name} resized to ${Math.round(report.share)}%`;
    case 'sort':
      return has(report.direction) ? `${report.name} sorted ${report.direction}` : `${report.name} sort reset`;
  }
};
