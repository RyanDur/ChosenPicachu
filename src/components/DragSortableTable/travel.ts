import {PointerEvent} from 'react';

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

export type Travel<SUBJECT> = {
    aloft?: SUBJECT;
    flight: Flight;
    drift: Drift;
    lift: (subject: SUBJECT, anchor: HTMLElement | null) => (event: PointerEvent<HTMLElement>) => void;
    surface: {
        onPointerMove: (event: PointerEvent<HTMLElement>) => void;
        onPointerUp: () => void;
        onPointerCancel: () => void;
        onLostPointerCapture: () => void;
    };
};

export const eagerly = (style?: DragStyle): boolean =>
    style === 'eager-move' || style === 'hide-eager-move';

export const hides = (style?: DragStyle): boolean =>
    style === 'hide-eager-move' || style === 'hide-lazy-move';

export const grounded: Flight = {x: 0, y: 0, width: 0};
export const still: Drift = {x: 0, y: 0};
