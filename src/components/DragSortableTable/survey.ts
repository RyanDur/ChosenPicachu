import {has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {ColumnData} from '@components/Table';

export type Bounds = {
    left: number;
    top: number;
    width: number;
    height: number;
    columnWidths: Readonly<Record<string, number>>;
};

export type Survey = Bounds & {
    rowHeights: Readonly<Record<number, number>>;
};

export const bounded = (surface: HTMLTableElement, order: readonly string[]): Bounds => {
    const bounds = surface.getBoundingClientRect();
    const headers = [...surface.querySelectorAll('thead th')];
    return {
        left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height,
        columnWidths: order.reduce((widths, column, at) => ({
            ...widths,
            [column]: headers[at]?.getBoundingClientRect().width ?? 0
        }), {})
    };
};

export const surveyed = (
    surface: HTMLTableElement,
    order: readonly string[],
    seats: readonly number[]
): Survey => {
    const body = surface.tBodies[0];
    return {
        ...bounded(surface, order),
        rowHeights: seats.reduce((heights, row, position) => ({
            ...heights,
            [row]: body?.rows[position]?.getBoundingClientRect().height ?? 0
        }), {})
    };
};

const deadZone = (struckSize: number, aloftSize: number): number =>
    Math.max(struckSize / 4, (struckSize - aloftSize) / 2);

type Slot<Identity> = {holds: Identity; at: number; size: number; start: number; end: number};

const struckPast = <Identity>(
    slots: readonly Slot<Identity>[],
    home: number,
    coord: number
): Identity | undefined => {
    const struck = slots.find(({end}) => coord < end);
    if (has(struck) && struck.at !== home) {
        const held = deadZone(struck.size, slots[home]?.size ?? 0);
        return (struck.at < home ? coord < struck.end - held : coord > struck.start + held)
            ? struck.holds
            : undefined;
    }
    return struck?.holds;
};

export const columnUnder = (order: readonly string[], survey: Bounds) =>
    (x: number, y: number, aloft: string): string | undefined => {
        if (y >= survey.top && y <= survey.top + survey.height) {
            let edge = survey.left;
            const total = order.reduce((sum, name) => sum + (survey.columnWidths[name] ?? 0), 0) || 1;
            const slots = order.map((column, at) => {
                const size = (survey.columnWidths[column] ?? 0) / total * survey.width;
                edge += size;
                return {holds: column, at, size, start: edge - size, end: edge};
            });
            return struckPast(slots, order.indexOf(aloft), x);
        }
        return undefined;
    };

export const rowUnder = (seats: readonly number[], survey: Survey) =>
    (x: number, y: number, aloft: number): number | undefined => {
        if (x >= survey.left && x <= survey.left + survey.width) {
            const {top, height, rowHeights} = survey;
            let edge = top + height -
                seats.reduce((total, row) => total + rowHeights[row], 0);
            const slots = seats.map((row, at) => {
                const size = rowHeights[row];
                edge += size;
                return {holds: row, at, size, start: edge - size, end: edge};
            });
            return struckPast(slots, seats.indexOf(aloft), y);
        }
        return undefined;
    };

export const anchored = (position: number, count: number): boolean =>
    position === 0 || position === count - 1;

export const columnSteps: Record<string, 1 | -1> = {ArrowRight: 1, ArrowLeft: -1};

export const rowSteps: Record<string, 1 | -1> = {ArrowDown: 1, ArrowUp: -1};

export const nudgedColumn = (order: readonly string[], held: string, toward: number): {from: number; to: number} => {
    const from = order.indexOf(held);
    return {from, to: interior(from + toward, order.length)};
};

export const nudgedRow = (seats: readonly number[], held: number, toward: number): {from: number; to: number} => {
    const from = seats.indexOf(held);
    return {from, to: Math.min(Math.max(from + toward, 0), seats.length - 1)};
};

export const struckAway = <Seat,>(held: Seat, struck: Seat | undefined): struck is Seat =>
    has(struck) && struck !== held;

export type ColumnNudge = {from: number; to: number};

export const columnNudge = (order: readonly string[]) =>
    (held: string, toward: number): ColumnNudge | undefined => {
        const {from, to} = nudgedColumn(order, held, toward);
        return to === from ? undefined : {from, to};
    };

export type RowNudge = {to: number; after: number[]};

export const rowNudge = (seats: readonly number[]) =>
    (held: number, toward: number): RowNudge => {
        const {to} = nudgedRow(seats, held, toward);
        return {to, after: array.moveToIndex(to, held, seats)};
    };

export const gripLabel = (position: number): string => `move row ${position + 1}`;

export const interior = (at: number, count: number): number =>
    Math.min(Math.max(at, 1), count - 2);

export const placed = (
    ordered: readonly ColumnData[],
    column: string,
    to: number
): ColumnData[] => {
    const lifted = ordered.find(definition => definition.column === column);
    return has(lifted) ? array.moveToIndex(to, lifted, ordered) : [...ordered];
};
