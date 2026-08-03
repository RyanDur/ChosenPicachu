import {FC, KeyboardEvent, PointerEvent} from 'react';
import Handle from '@components/grip.svg';

type Props = {
    row: number;
    onLift: (event: PointerEvent<HTMLElement>) => void;
    onNudge: (toward: 1 | -1) => void;
};

export const RowGrip: FC<Props> = ({row, onLift, onNudge}) =>
    <button type="button"
            className="grip grabbable"
            aria-label={`move row ${row}`}
            onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
                if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
                    return;
                }
                event.preventDefault();
                onNudge(event.key === 'ArrowDown' ? 1 : -1);
            }}
            onPointerDown={onLift}>
        <Handle/>
    </button>;
