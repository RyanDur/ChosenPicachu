import {maybe} from '@ryandur/sand';
import {Survey, anchored, surveyed} from './survey';
import {Drift} from './travel';

export type Flight = {
    x: number;
    y: number;
    width: number;
};

export const grounded: Flight = {x: 0, y: 0, width: 0};

export type Grab = {
    survey: Survey;
    box: Flight;
    at: Drift;
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
    standing: () => readonly string[],
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
    th.setPointerCapture(event.pointerId);
    const box = th.getBoundingClientRect();
    maybe(th.closest('table')).map(table =>
        grabbed({
            survey: surveyed(table, columns, standing()),
            box: {x: box.x, y: box.y, width: box.width},
            at: {x: event.clientX, y: event.clientY}
        }));
};

export const rowLift = (
    order: () => readonly string[],
    standing: () => readonly string[],
    grabbed: (grab: Grab) => void
) => (event: GrabEvent): void => {
    const grip = event.currentTarget;
    if (!(grip instanceof Element)) {
        return;
    }
    grip.setPointerCapture(event.pointerId);
    const box = maybe(grip.closest('tr'))
        .map(row => row.getBoundingClientRect())
        .map(({x, y, width}) => ({x, y, width}))
        .orElse(grounded);
    maybe(grip.closest('table')).map(table =>
        grabbed({
            survey: surveyed(table, order(), standing()),
            box,
            at: {x: event.clientX, y: event.clientY}
        }));
};
