import {PointerEvent, useState} from 'react';
import {has, not} from '@ryandur/sand';

export type DragStyle = 'eager-move' | 'lazy-move' | 'hide-eager-move' | 'hide-lazy-move';

type Flight = {
    x: number;
    y: number;
    width: number;
};

type Drift = {
    x: number;
    y: number;
};

type Travel<SUBJECT> = {
    aloft: SUBJECT | undefined;
    hiding: boolean;
    flight: Flight;
    drift: Drift;
    lift: (subject: SUBJECT, anchor: HTMLElement | null) => (event: PointerEvent<HTMLElement>) => void;
    surface: {
        onPointerMove: (event: PointerEvent<HTMLElement>) => void;
        onPointerUp: () => void;
        onPointerCancel: () => void;
        onLostPointerCapture: () => void;
    };
};

const grounded: Flight = {x: 0, y: 0, width: 0};
const still: Drift = {x: 0, y: 0};

export const useTravel = <SUBJECT,>(
    style: DragStyle | undefined,
    strike: (x: number, y: number, aloft?: SUBJECT) => SUBJECT | undefined,
    settle: (subject: SUBJECT, struck: SUBJECT) => void
): Travel<SUBJECT> => {
    const [aloft, setAloft] = useState<SUBJECT>();
    const [flight, setFlight] = useState<Flight>(grounded);
    const [origin, setOrigin] = useState<Drift>();
    const [drift, setDrift] = useState<Drift>(still);
    const [landing, setLanding] = useState<SUBJECT>();
    const eager = style === 'eager-move' || style === 'hide-eager-move';
    const hiding = style === 'hide-eager-move' || style === 'hide-lazy-move';

    const lift = (subject: SUBJECT, anchor: HTMLElement | null) =>
        (): void => {
            const anchored = anchor?.getBoundingClientRect();
            setFlight({x: anchored?.x ?? 0, y: anchored?.y ?? 0, width: anchored?.width ?? 0});
            setAloft(subject);
        };

    const drop = (): void => {
        if (not(eager) && has(aloft) && has(landing)) {
            settle(aloft, landing);
        }
        setOrigin(undefined);
        setLanding(undefined);
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
        if (has(aloft) && has(struck)) {
            if (struck === aloft) {
                setLanding(undefined);
            } else if (eager) {
                settle(aloft, struck);
            } else {
                setLanding(struck);
            }
        }
    };

    return {
        aloft,
        hiding,
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
