import {useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {Drift, drifted, Flight, Grab, grounded, lazyTravel, rowLift, still, surfaceTravel} from '../travel';
import {rowUnder, Survey} from '../survey';

export const useRowTravel = (
    order: readonly string[],
    standing: readonly number[],
    settle: (row: number, struck: number, heights: Readonly<Record<number, number>>) => void
) => {
    const [aloft, setAloft] = useState<Maybe<number>>(nothing());
    const [survey, setChart] = useState<Maybe<Survey>>(nothing());
    const [landing, setLanding] = useState<Maybe<number>>(nothing());
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
        aloft.and(survey).and(landing).map(([[held, chart], struck]) =>
            settle(held, struck, chart.rowHeights));
        setLanding(nothing());
        setOrigin(nothing());
        setAloft(nothing());
        setChart(nothing());
        setFlight(grounded);
        setDrift(still);
    };

    const travel = surfaceTravel(
        moving => origin.either(
            from => setDrift(drifted(moving, from)),
            () => setOrigin(maybe({x: moving.clientX, y: moving.clientY}))),
        moving => aloft.and(survey).map(([held, chart]) =>
                setLanding(maybe(lazyTravel(rowUnder(standing, chart))(held, moving, landing.orElse(undefined))))),
        drop);

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
