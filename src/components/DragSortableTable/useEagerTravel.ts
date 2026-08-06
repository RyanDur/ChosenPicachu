import {PointerEvent, useState} from 'react';
import {has} from '@ryandur/sand';
import {Drift, Flight, Travel, grounded, still} from './travel';

export const useEagerTravel = <SUBJECT,>(
    strike: (x: number, y: number, aloft?: SUBJECT) => SUBJECT | undefined,
    settle: (subject: SUBJECT, struck: SUBJECT) => void
): Travel<SUBJECT> => {
    const [aloft, setAloft] = useState<SUBJECT>();
    const [flight, setFlight] = useState<Flight>(grounded);
    const [origin, setOrigin] = useState<Drift>();
    const [drift, setDrift] = useState<Drift>(still);

    const lift = (subject: SUBJECT, anchor: HTMLElement | null) =>
        (): void => {
            const anchored = anchor?.getBoundingClientRect();
            setFlight({x: anchored?.x ?? 0, y: anchored?.y ?? 0, width: anchored?.width ?? 0});
            setAloft(subject);
        };

    const drop = (): void => {
        setOrigin(undefined);
        setAloft(undefined);
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
        if (has(aloft) && has(struck) && struck !== aloft) {
            settle(aloft, struck);
        }
    };

    return {
        aloft,
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
