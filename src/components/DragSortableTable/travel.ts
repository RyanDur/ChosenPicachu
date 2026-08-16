import {has, maybe} from '@ryandur/sand';
import {array} from '@components/arrays';
import {Shifted, Slid, bounded, columnNudge, nudgedColumn, nudgedRow, rowNudge, struckAway, surveyed} from './survey';
export type DragStyle = 'eager-move' | 'lazy-move' | 'hide-eager-move' | 'hide-lazy-move';

export type Flight = {
    x: number;
    y: number;
    width: number;
};

export type Drift = {
    x: number;
    y: number;
};

export const grounded: Flight = {x: 0, y: 0, width: 0};
export const still: Drift = {x: 0, y: 0};

export const drifted = (moving: {clientX: number; clientY: number}, from: Drift): Drift =>
    ({x: moving.clientX - from.x, y: moving.clientY - from.y});

export const eagerTravel = <Seat,>(
    under: (x: number, y: number, held: Seat) => Seat | undefined,
    settle: (struck: Seat) => void
) => (held: Seat, moving: {clientX: number; clientY: number}): void => {
    const struck = under(moving.clientX, moving.clientY, held);
    if (struckAway(held, struck)) {
        settle(struck);
    }
};

export const lazyTravel = <Seat,>(under: (x: number, y: number, held: Seat) => Seat | undefined) =>
    (held: Seat, moving: {clientX: number; clientY: number}, landing: Seat | undefined): Seat | undefined => {
        const struck = under(moving.clientX, moving.clientY, held);
        if (!has(struck)) {
            return landing;
        }
        return struckAway(held, struck) ? struck : undefined;
    };

export const animatedColumnArrows = (
    th: HTMLTableCellElement,
    order: readonly string[],
    arrange: (nudge: {from: number; to: number; marks: Slid}) => void
) => (held: string, toward: number): void => {
    if (th.getAnimations().length > 0) {
        return;
    }
    maybe(th.closest('table')).map(table => {
        const nudge = columnNudge(order, bounded(table, order))(held, toward);
        if (has(nudge)) {
            arrange(nudge);
        }
    });
};

export const staticColumnArrows = (
    order: readonly string[],
    arrange: (nudge: {from: number; to: number}) => void
) => (held: string, toward: number): void => {
    const {from, to} = nudgedColumn(order, held, toward);
    if (to !== from) {
        arrange({from, to});
    }
};

export const animatedRowArrows = (
    grip: Element,
    order: readonly string[],
    standing: readonly number[],
    arrange: (nudge: {to: number; after: number[]; drops: Shifted}) => void
) => (held: number, toward: number): void => {
    const sliding = maybe(grip.closest('tr'))
        .map(lane => lane.getAnimations().length > 0)
        .orElse(false);
    if (sliding) {
        return;
    }
    maybe(grip.closest('table')).map(table =>
        arrange(rowNudge(standing, surveyed(table, order, standing).rowHeights)(held, toward)));
};

export const staticRowArrows = (
    standing: readonly number[],
    arrange: (nudge: {to: number; after: number[]}) => void
) => (held: number, toward: number): void => {
    const {to} = nudgedRow(standing, held, toward);
    arrange({to, after: array.moveToIndex(to, held, standing)});
};
