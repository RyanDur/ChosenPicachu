export type Landed =
  | {readonly axis: 'column'; readonly name: string; readonly position: number; readonly of: number}
  | {readonly axis: 'row'; readonly position: number; readonly of: number}
  | {readonly axis: 'share'; readonly name: string; readonly share: number};

export const moveReport = (landed: Landed): string => {
  switch (landed.axis) {
    case 'column':
      return `${landed.name} moved to column ${landed.position + 1} of ${landed.of}`;
    case 'row':
      return `row moved to ${landed.position + 1} of ${landed.of}`;
    case 'share':
      return `${landed.name} resized to ${Math.round(landed.share)}%`;
  }
};
