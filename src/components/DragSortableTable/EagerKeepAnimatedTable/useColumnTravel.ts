import {PointerEvent, useState} from 'react';
import {has} from '@ryandur/sand';
import {Drift, Flight, grounded, still} from '../travel';
import {Bounds, bounded, columnUnder} from '../survey';

export const useColumnTravel = (
    order: readonly string[],
    settle: (column: string, struck: string, survey: Bounds) => void
) => {
    const [aloft, setAloft] = useState<string>();
    const [bounds, setBounds] = useState<Bounds>();
    const [flight, setFlight] = useState<Flight>(grounded);
    const [origin, setOrigin] = useState<Drift>();
    const [drift, setDrift] = useState<Drift>(still);
    const strike = columnUnder(order, bounds);

    const lift = (column: string) =>
        (event: PointerEvent<HTMLElement>): void => {
            const anchored = event.currentTarget.getBoundingClientRect();
            const table = event.currentTarget.closest('table');
            if (has(table)) {
                setBounds(bounded(table, order));
            }
            setFlight({x: anchored.x, y: anchored.y, width: anchored.width});
            setAloft(column);
        };

    const drop = (): void => {
        setOrigin(undefined);
        setAloft(undefined);
        setBounds(undefined);
        setFlight(grounded);
        setDrift(still);
    };

    const travel = (event: PointerEvent<HTMLElement>): void => {
        if (event.buttons === 0) {
            drop();
            return;
        }
        event.currentTarget.setPointerCapture?.(event.pointerId);
        if (has(origin)) {
            setDrift({x: event.clientX - origin.x, y: event.clientY - origin.y});
        } else {
            setOrigin({x: event.clientX, y: event.clientY});
        }
        const struck = strike(event.clientX, event.clientY, aloft);
        if (has(bounds) && has(aloft) && has(struck) && struck !== aloft) {
            settle(aloft, struck, bounds);
        }
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
