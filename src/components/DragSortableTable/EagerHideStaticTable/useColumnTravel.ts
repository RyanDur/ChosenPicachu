import {useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {columnLift, Drift, drifted, eagerTravel, Flight, Grab, grounded, still, surfaceTravel} from '../travel';
import {Bounds, columnUnder, Survey} from '../survey';

export const useColumnTravel = (
    order: readonly string[],
    standing: readonly number[],
    settle: (column: string, struck: string, survey: Bounds) => void
) => {
    const [aloft, setAloft] = useState<Maybe<string>>(nothing());
    const [bounds, setBounds] = useState<Maybe<Survey>>(nothing());
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
        setOrigin(nothing());
        setAloft(nothing());
        setBounds(nothing());
        setFlight(grounded);
        setDrift(still);
    };

    const travel = surfaceTravel(
        moving => origin.either(
            from => setDrift(drifted(moving, from)),
            () => setOrigin(maybe({x: moving.clientX, y: moving.clientY}))),
        moving => aloft.and(bounds).map(([held, survey]) =>
                eagerTravel(columnUnder(order, survey), struck => settle(held, struck, survey))(held, moving)),
        drop);

    return {
        aloft,
        survey: bounds,
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
