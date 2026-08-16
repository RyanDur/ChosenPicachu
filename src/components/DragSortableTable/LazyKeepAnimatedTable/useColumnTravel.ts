import {PointerEvent, useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {Drift, drifted, Flight, grounded, lazyTravel, still} from '../travel';
import {Bounds, columnUnder, Survey, surveyed} from '../survey';

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

    const lift = (column: string) =>
        (event: PointerEvent<HTMLElement>): void => {
            const anchored = event.currentTarget.getBoundingClientRect();
            maybe(event.currentTarget.closest('table'))
                .map(table => setBounds(maybe(surveyed(table, order, standing))));
            setFlight({x: anchored.x, y: anchored.y, width: anchored.width});
            setAloft(maybe(column));
        };

    const drop = (): void => {
        aloft.and(bounds).and(landing).map(([[held, survey], struck]) =>
            settle(held, struck, survey));
        setLanding(nothing());
        setOrigin(nothing());
        setAloft(nothing());
        setBounds(nothing());
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
        aloft.and(bounds).map(([held, survey]) =>
            setLanding(maybe(lazyTravel(columnUnder(order, survey))(held, event, landing.orElse(undefined)))));
    };

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
