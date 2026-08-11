import {PointerEvent, useState} from 'react';
import {Maybe, has, maybe, nothing} from '@ryandur/sand';
import {Drift, Flight, grounded, still} from '../travel';
import {Survey, surveyed, rowUnder} from '../survey';

export const useRowTravel = (
    order: readonly string[],
    standing: readonly number[],
    settle: (row: number, struck: number, heights: Readonly<Record<number, number>>) => void
) => {
    const [aloft, setAloft] = useState<Maybe<number>>(nothing());
    const [survey, setChart] = useState<Maybe<Survey>>(nothing());
    const [flight, setFlight] = useState<Flight>(grounded);
    const [origin, setOrigin] = useState<Maybe<Drift>>(nothing());
    const [drift, setDrift] = useState<Drift>(still);

    const lift = (row: number) =>
        (event: PointerEvent<HTMLElement>): void => {
            maybe(event.currentTarget.closest('table'))
                .map(table => setChart(maybe(surveyed(table, order, standing))));
            setFlight(maybe(event.currentTarget.closest('tr'))
                .map(lane => lane.getBoundingClientRect())
                .map(({x, y, width}) => ({x, y, width}))
                .orElse(grounded));
            setAloft(maybe(row));
        };

    const drop = (): void => {
        setOrigin(nothing());
        setAloft(nothing());
        setChart(nothing());
        setFlight(grounded);
        setDrift(still);
    };

    const travel = (event: PointerEvent<HTMLElement>): void => {
        if (event.buttons === 0) {
            drop();
            return;
        }
        event.currentTarget.setPointerCapture(event.pointerId);
        origin.either(
            from => setDrift({x: event.clientX - from.x, y: event.clientY - from.y}),
            () => setOrigin(maybe({x: event.clientX, y: event.clientY})));
        aloft.and(survey).map(([held, chart]) => {
            const struck = rowUnder(standing, chart)(event.clientX, event.clientY, held);
            if (has(struck) && struck !== held) {
                settle(held, struck, chart.rowHeights);
            }
        });
    };

    return {
        aloft,
        survey,
        flight,
        drift,
        lift,
        surface: {
            onPointerMove: travel,
            onPointerUp: drop,
            onPointerCancel: drop,
            onLostPointerCapture: drop
        }
    };
};
