import {FC, KeyboardEvent, PointerEvent} from 'react';
import Handle from '@components/grip.svg';
import {gripLabel} from './survey';
import './RowGrip.css';

type Props = {
    position: number;
    onLift: (event: PointerEvent<HTMLElement>) => void;
    onArrows: (event: KeyboardEvent<HTMLElement>) => void;
};

export const RowGrip: FC<Props> = ({position, onLift, onArrows}) =>
    <button type="button"
            className="grip grabbable"
            aria-label={gripLabel(position)}
            onKeyDown={onArrows}
            onPointerDown={onLift}>
        <Handle/>
    </button>;
