import {useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {Drift, drifted, eagerTravel, Flight, Grab, grounded, rowLift, still, surfaceTravel} from '../travel';
import {rowUnder, Survey} from '../survey';

export const useRowTravel = (
    order: readonly string[],
    standing: readonly number[],
    settle: (row: number, struck: number, heights: Readonly<Record<number, number>>) => void
) => {
    const [aloft, setAloft] = useState<Maybe<number>>(nothing());
    const [bounds, setBounds] = useState<Maybe<Survey>>(nothing());
    const [flight, setFlight] = useState<Flight>(grounded);
    const [origin, setOrigin] = useState<Maybe<Drift>>(nothing());
    const [drift, setDrift] = useState<Drift>(still);

    const grabbed = (row: number) => ({survey, box}: Grab): void => {
        setBounds(maybe(survey));
        setFlight(box);
        setAloft(maybe(row));
    };

    const lift = (row: number) =>
        rowLift(() => order, () => standing, grabbed(row));

    const drop = (): void => {
        setOrigin(nothing());
        setAloft(nothing());
        setBounds(nothing());
        setFlight(grounded);
        setDrift(still);
    };

    const drifting = (moving: {clientX: number; clientY: number}): void => {
        origin.either(
            from => setDrift(drifted(moving, from)),
            () => setOrigin(maybe({x: moving.clientX, y: moving.clientY})));
    };

    const travel = (moving: {clientX: number; clientY: number}): void => {
        aloft.and(bounds).map(([held, measured]) =>
                eagerTravel(rowUnder(standing, measured), struck => settle(held, struck, measured.rowHeights))(held, moving));
    };

    return {
        aloft,
        survey: bounds,
        flight,
        drift,
        lift,
        surface: {
            onPointerMove: surfaceTravel(drifting, travel, drop),
            onPointerUp: drop,
            onPointerCancel: drop,
            onLostPointerCapture: drop
        }
    };
};
