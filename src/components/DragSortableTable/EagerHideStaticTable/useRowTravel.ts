import {PointerEvent, useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {Drift, drifted, eagerTravel, Flight, Grab, grounded, rowLift, still} from '../travel';
import {rowUnder, Survey} from '../survey';

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

    const grabbed = (row: number) => ({survey, box}: Grab): void => {
        setChart(maybe(survey));
        setFlight(box);
        setAloft(maybe(row));
    };

    const lift = (row: number) =>
        rowLift(() => order, () => standing, grabbed(row));

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
            from => setDrift(drifted(event, from)),
            () => setOrigin(maybe({x: event.clientX, y: event.clientY})));
        aloft.and(survey).map(([held, chart]) =>
            eagerTravel(rowUnder(standing, chart), struck => settle(held, struck, chart.rowHeights))(held, event));
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
