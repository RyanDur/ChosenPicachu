import {has} from '@ryandur/sand';
import {Direction} from './sorting';

export type Landed =
  | {readonly axis: 'column'; readonly name: string; readonly position: number; readonly of: number}
  | {readonly axis: 'row'; readonly position: number; readonly of: number}
  | {readonly axis: 'share'; readonly name: string; readonly share: number}
  | {readonly axis: 'sort'; readonly name: string; readonly direction?: Direction};

export const moveReport = (landed: Landed): string => {
  switch (landed.axis) {
    case 'column':
      return `${landed.name} moved to column ${landed.position + 1} of ${landed.of}`;
    case 'row':
      return `row moved to ${landed.position + 1} of ${landed.of}`;
    case 'share':
      return `${landed.name} resized to ${Math.round(landed.share)}%`;
    case 'sort':
      return has(landed.direction) ? `${landed.name} sorted ${landed.direction}` : `${landed.name} sort reset`;
  }
};
