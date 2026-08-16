import {FC, KeyboardEvent, PointerEvent} from 'react';
import {maybe} from '@ryandur/sand';
import Handle from '@components/grip.svg';
import {gripLabel, rowSteps} from './survey';
import './RowGrip.css';

type Props = {
    position: number;
    onLift: (event: PointerEvent<HTMLElement>) => void;
    onNudge: (toward: 1 | -1, event: KeyboardEvent<HTMLElement>) => void;
};

export const RowGrip: FC<Props> = ({position, onLift, onNudge}) =>
    <button type="button"
            className="grip grabbable"
            aria-label={gripLabel(position)}
            onKeyDown={(event: KeyboardEvent<HTMLElement>) =>
                maybe(rowSteps[event.key]).map(toward => {
                    event.preventDefault();
                    onNudge(toward, event);
                })}
            onPointerDown={onLift}>
        <Handle/>
    </button>;
