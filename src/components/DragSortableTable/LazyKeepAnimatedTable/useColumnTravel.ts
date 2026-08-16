import {useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {columnLift, Drift, drifted, Flight, Grab, grounded, lazyTravel, still, surfaceTravel} from '../travel';
import {Bounds, columnUnder, Survey} from '../survey';

export const useColumnTravel = (
    order: readonly string[],
    standing: readonly number[],
    settle: (column: string, struck: string, survey: Bounds) => void
) => {
    const [aloft, setAloft] = useState<Maybe<string>>(nothing());
    const [bounds, setBounds] = useState<Maybe<Survey>>(nothing());
    const [landing, setLanding] = useState<Maybe<string>>(nothing());
    const [flight, setFlight] = useState<Flight>(grounded);
    const [origin, setOrigin] = useState<Maybe<Drift>>(nothing());
    const [drift, setDrift] = useState<Drift>(still);

    const grabbed = (column: string) => ({survey, box}: Grab): void => {
        setBounds(maybe(survey));
        setFlight(box);
        setAloft(maybe(column));
    };

    const lift = (column: string) =>
        columnLift(column, () => order, () => standing, grabbed(column));

    const drop = (): void => {
        aloft.and(bounds).and(landing).map(([[held, measured], struck]) =>
            settle(held, struck, measured));
        setLanding(nothing());
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
                setLanding(maybe(lazyTravel(columnUnder(order, measured))(held, moving, landing.orElse(undefined)))));
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
