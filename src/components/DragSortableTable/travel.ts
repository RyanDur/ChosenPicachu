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
