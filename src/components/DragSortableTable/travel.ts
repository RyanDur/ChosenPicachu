import {has} from '@ryandur/sand';
import {struckAway} from './survey';
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
