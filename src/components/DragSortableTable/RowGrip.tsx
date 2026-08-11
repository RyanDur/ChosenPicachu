import {FC, KeyboardEvent, PointerEvent} from 'react';
import {maybe} from '@ryandur/sand';
import Handle from '@components/grip.svg';
import './RowGrip.css';

const steps: Record<string, 1 | -1> = {ArrowDown: 1, ArrowUp: -1};

type Props = {
    position: number;
    onLift: (event: PointerEvent<HTMLElement>) => void;
    onNudge: (toward: 1 | -1, event: KeyboardEvent<HTMLElement>) => void;
};

export const RowGrip: FC<Props> = ({position, onLift, onNudge}) =>
    <button type="button"
            className="grip grabbable"
            aria-label={`move row ${position + 1}`}
            onKeyDown={(event: KeyboardEvent<HTMLElement>) =>
                maybe(steps[event.key]).map(toward => {
                    event.preventDefault();
                    onNudge(toward, event);
                })}
            onPointerDown={onLift}>
        <Handle/>
    </button>;
