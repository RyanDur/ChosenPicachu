import {FC, KeyboardEvent, PointerEvent} from 'react';
import Handle from '@components/grip.svg';
import './RowGrip.css';

type Props = {
    position: number;
    onLift: (event: PointerEvent<HTMLElement>) => void;
    onNudge: (toward: 1 | -1, event: KeyboardEvent<HTMLElement>) => void;
};

export const RowGrip: FC<Props> = ({position, onLift, onNudge}) =>
    <button type="button"
            className="grip grabbable"
            aria-label={`move row ${position + 1}`}
            onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
                if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
                    return;
                }
                event.preventDefault();
                onNudge(event.key === 'ArrowDown' ? 1 : -1, event);
            }}
            onPointerDown={onLift}>
        <Handle/>
    </button>;
