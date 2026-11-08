import {has, maybe} from '@ryandur/sand';
const SLIMMEST = 5;

export type ColumnWidths = Readonly<Record<string, number>>;

const measuredWidths = (keys: readonly string[], table: HTMLTableElement): ColumnWidths => {
  const widths = [...table.querySelectorAll('thead th')].map(header => header.getBoundingClientRect().width);
  const total = widths.reduce((sum, width) => sum + width, 0);
  return keys.reduce<ColumnWidths>((measured, key, at) =>
    ({...measured, [key]: (widths[at] ?? 0) / (total || 1) * 100}), {});
};

const pixels = (length: string): number => parseFloat(length) || 0;

const controlsWidth = (header: Element): number => {
  const {borderInlineStartWidth, borderInlineEndWidth} = getComputedStyle(header);
  return [...header.querySelectorAll('button')].reduce((sum, control) => sum + control.getBoundingClientRect().width, 0) +
    pixels(borderInlineStartWidth) + pixels(borderInlineEndWidth);
};

const measuredFloors = (keys: readonly string[], table: HTMLTableElement): ColumnWidths => {
  const headers = [...table.querySelectorAll('thead th')];
  const total = headers.reduce((sum, header) => sum + header.getBoundingClientRect().width, 0);
  return keys.reduce<ColumnWidths>((floors, key, at) =>
    ({...floors, [key]: maybe(headers[at]).map(controlsWidth).orElse(0) / (total || 1) * 100}), {});
};

const floorOf = (floors: ColumnWidths, column: string): number => Math.max(SLIMMEST, floors[column] ?? 0);

const traded = (column: string, neighbor: string, delta: number, floors: ColumnWidths) =>
  (previous: ColumnWidths): ColumnWidths => {
    const given = Math.min(
      Math.max(delta, floorOf(floors, column) - previous[column]),
      previous[neighbor] - floorOf(floors, neighbor)
    );
    return {...previous, [column]: previous[column] + given, [neighbor]: previous[neighbor] - given};
  };

const neighborOf = (apportioned: readonly string[], key: string): string => {
  const index = apportioned.indexOf(key);
  return apportioned[index + 1] ?? apportioned[index - 1];
};

const step = 2;

export type Grip = Readonly<{fromX: number; pxPerShare: number}>;

const sought = ({fromX, pxPerShare}: Grip, clientX: number): number => (clientX - fromX) / pxPerShare;

const width = (share?: number): string | undefined =>
  has(share) ? `${share}%` : undefined;

const wholePercent = (share: number): number => Math.round(share);

const resizeLabel = (column: string, share?: number): string =>
  has(share) ? `resize ${column}, ${wholePercent(share)}%` : `resize ${column}`;

const grippedAt = (width: number, clientX: number): Grip | undefined => {
  const pxPerShare = width / 100;
  return pxPerShare ? {fromX: clientX, pxPerShare} : undefined;
};

const soughtTrade = (grip: Grip, clientX: number, carried: number): {delta: number; carried: number} => {
  const share = sought(grip, clientX);
  return {delta: share - carried, carried: share};
};

const arrowTrades: Record<string, number> = {ArrowRight: step, ArrowLeft: -step};

const resizeArrows = (trade: (delta: number) => void) =>
  (event: {key: string; preventDefault: () => void; stopPropagation: () => void}): void => {
    const delta = arrowTrades[event.key];
    if (has(delta)) {
      event.preventDefault();
      event.stopPropagation();
      trade(delta);
    }
  };

const resizeArrowLifted = (ended: () => void) =>
  ({key}: {key: string}): void => {
    if (has(arrowTrades[key])) {
      ended();
    }
  };

export const shares = {
  measuredWidths,
  measuredFloors,
  traded,
  neighborOf,
  sought,
  width,
  wholePercent,
  resizeLabel,
  grippedAt,
  soughtTrade,
  resizeArrows,
  resizeArrowLifted
};
