import {has, maybe} from '@ryandur/sand';
import {array} from '@components/arrays';
import {Survey, anchored, columnSteps, nudgedColumn, nudgedRow, rowSteps, struckAway, surveyed} from './survey';
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

export type ArrowKey = {
    key: string;
    preventDefault: () => void;
    currentTarget: EventTarget | null;
};

export const columnArrows = (
    held: string,
    order: () => readonly string[],
    arrange: (nudge: {from: number; to: number}) => void
) => (event: ArrowKey): void => {
    maybe(columnSteps[event.key]).map(toward => {
        event.preventDefault();
        const columns = order();
        if (anchored(columns.indexOf(held), columns.length)) {
            return;
        }
        const {from, to} = nudgedColumn(columns, held, toward);
        if (to !== from) {
            arrange({from, to});
        }
    });
};

export const rowArrows = (
    held: number,
    standing: () => readonly number[],
    arrange: (nudge: {to: number; after: number[]}) => void
) => (event: ArrowKey): void => {
    maybe(rowSteps[event.key]).map(toward => {
        event.preventDefault();
        const seats = standing();
        const {to} = nudgedRow(seats, held, toward);
        arrange({to, after: array.moveToIndex(to, held, seats)});
    });
};

export type Faces = {
    heading: string | undefined;
    cells: readonly string[];
};

export const faceOf = (cell: Element): string =>
    ((cell instanceof HTMLElement ? cell.innerText : undefined) ?? cell.textContent ?? '')
        .split('\n')
        .map(line => line.trim())
        .find(line => line.length > 0) ?? '';

const headingFace = (th: Element): string =>
    [...(th.querySelector('.header-cell-content') ?? th).childNodes]
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent ?? '')
        .join('')
        .trim();

export type Grab = {
    survey: Survey;
    box: Flight;
    at: Drift;
    pointerId: number;
    faces: Faces;
};

type GrabEvent = {
    clientX: number;
    clientY: number;
    pointerId: number;
    currentTarget: EventTarget | null;
};

export const columnLift = (
    held: string,
    order: () => readonly string[],
    standing: () => readonly number[],
    grabbed: (grab: Grab) => void
) => (event: GrabEvent): void => {
    const columns = order();
    if (anchored(columns.indexOf(held), columns.length)) {
        return;
    }
    const th = event.currentTarget;
    if (!(th instanceof Element)) {
        return;
    }
    const box = th.getBoundingClientRect();
    const at = columns.indexOf(held);
    maybe(th.closest('table')).map(table =>
        grabbed({
            survey: surveyed(table, columns, standing()),
            box: {x: box.x, y: box.y, width: box.width},
            at: {x: event.clientX, y: event.clientY},
            pointerId: event.pointerId,
            faces: {
                heading: headingFace(th),
                cells: [...table.tBodies[0]?.rows ?? []].map(lane => maybe(lane.cells[at]).map(faceOf).orElse(''))
            }
        }));
};

export const rowLift = (
    order: () => readonly string[],
    standing: () => readonly number[],
    grabbed: (grab: Grab) => void
) => (event: GrabEvent): void => {
    const grip = event.currentTarget;
    if (!(grip instanceof Element)) {
        return;
    }
    const lane = maybe(grip.closest('tr'));
    const box = lane
        .map(row => row.getBoundingClientRect())
        .map(({x, y, width}) => ({x, y, width}))
        .orElse(grounded);
    maybe(grip.closest('table')).map(table =>
        grabbed({
            survey: surveyed(table, order(), standing()),
            box,
            at: {x: event.clientX, y: event.clientY},
            pointerId: event.pointerId,
            faces: {
                heading: undefined,
                cells: lane.map(row => [...row.cells].map(faceOf)).orElse([])
            }
        }));
};

export const carried = (origin: Drift | undefined, moving: {clientX: number; clientY: number}): {origin: Drift; drift: Drift} =>
    has(origin)
        ? {origin, drift: drifted(moving, origin)}
        : {origin: {x: moving.clientX, y: moving.clientY}, drift: still};

type MoveEvent = {
    buttons: number;
    pointerId: number;
    clientX: number;
    clientY: number;
    currentTarget: EventTarget | null;
};

export const surfaceTravel = (
    drift: (moving: {clientX: number; clientY: number}) => void,
    strike: (moving: {clientX: number; clientY: number}) => void,
    drop: () => void
) => (event: MoveEvent): void => {
    if (event.buttons === 0) {
        drop();
        return;
    }
    const surface = event.currentTarget;
    if (surface instanceof Element) {
        surface.setPointerCapture(event.pointerId);
    }
    drift(event);
    strike(event);
};
