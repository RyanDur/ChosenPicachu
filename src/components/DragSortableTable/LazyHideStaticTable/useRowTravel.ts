import {PointerEvent, useState} from 'react';
import {has} from '@ryandur/sand';
import {Drift, Flight, grounded, still} from '../travel';
import {Survey, surveyed, cardUnder} from '../survey';

export const useRowTravel = (
    standing: readonly number[],
    settle: (card: number, struck: number, heights: Readonly<Record<number, number>>) => void
) => {
    const [aloft, setAloft] = useState<number>();
    const [survey, setChart] = useState<Survey>();
    const [flight, setFlight] = useState<Flight>(grounded);
    const [origin, setOrigin] = useState<Drift>();
    const [drift, setDrift] = useState<Drift>(still);
    const [landing, setLanding] = useState<number>();
    const strike = cardUnder(standing, survey);

    const lift = (card: number) =>
        (event: PointerEvent<HTMLElement>): void => {
            const lane = event.currentTarget.closest('tr');
            const table = event.currentTarget.closest('table');
            if (has(table)) {
                setChart(surveyed(table, standing));
            }
            const anchored = lane?.getBoundingClientRect();
            setFlight({x: anchored?.x ?? 0, y: anchored?.y ?? 0, width: anchored?.width ?? 0});
            setAloft(card);
        };

    const drop = (): void => {
        if (has(survey) && has(aloft) && has(landing)) {
            settle(aloft, landing, survey.rowHeights);
        }
        setOrigin(undefined);
        setLanding(undefined);
        setAloft(undefined);
        setChart(undefined);
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
            setLanding(struck === aloft ? undefined : struck);
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
