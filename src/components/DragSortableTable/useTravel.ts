import {PointerEvent, RefObject, useRef, useState} from 'react';
import {has, not} from '@ryandur/sand';

export type DragStyle = 'eager-move' | 'lazy-move' | 'hide-eager-move' | 'hide-lazy-move';

type Flight = {
    x: number;
    y: number;
    width: number;
};

type Travel<SUBJECT> = {
    aloft: SUBJECT | undefined;
    hiding: boolean;
    flight: Flight;
    ghost: RefObject<HTMLTableElement | null>;
    lift: (subject: SUBJECT, anchor: HTMLElement | null) => (event: PointerEvent<HTMLElement>) => void;
    surface: {
        onPointerMove: (event: PointerEvent<HTMLElement>) => void;
        onPointerUp: () => void;
        onPointerCancel: () => void;
    };
};

const grounded: Flight = {x: 0, y: 0, width: 0};

export const useTravel = <SUBJECT,>(
    style: DragStyle | undefined,
    strike: (x: number, y: number, aloft: SUBJECT | undefined) => SUBJECT | undefined,
    settle: (subject: SUBJECT, struck: SUBJECT) => void
): Travel<SUBJECT> => {
    const [aloft, setAloft] = useState<SUBJECT>();
    const [flight, setFlight] = useState<Flight>(grounded);
    const ghost = useRef<HTMLTableElement>(null);
    const origin = useRef<{x: number; y: number}>(null);
    const landing = useRef<SUBJECT>(null);
    const eager = style === 'eager-move' || style === 'hide-eager-move';
    const hiding = style === 'hide-eager-move' || style === 'hide-lazy-move';

    const lift = (subject: SUBJECT, anchor: HTMLElement | null) =>
        (): void => {
            const anchored = anchor?.getBoundingClientRect();
            setFlight({x: anchored?.x ?? 0, y: anchored?.y ?? 0, width: anchored?.width ?? 0});
            setAloft(subject);
        };

    const surface = {
        onPointerMove: (event: PointerEvent<HTMLElement>): void => {
            origin.current = origin.current ?? {x: event.clientX, y: event.clientY};
            ghost.current?.style.setProperty('transform',
                `translate(${event.clientX - origin.current.x}px, ${event.clientY - origin.current.y}px)`);
            const struck = strike(event.clientX, event.clientY, aloft);
            if (has(aloft) && has(struck)) {
                if (struck === aloft) {
                    landing.current = null;
                } else if (eager) {
                    settle(aloft, struck);
                } else {
                    landing.current = struck;
                }
            }
        },
        onPointerUp: (): void => {
            if (not(eager) && has(aloft) && has(landing.current)) {
                settle(aloft, landing.current);
            }
            origin.current = null;
            landing.current = null;
            setAloft(undefined);
            setFlight(grounded);
        },
        onPointerCancel: (): void => surface.onPointerUp()
    };

    return {aloft, hiding, flight, ghost, lift, surface};
};
