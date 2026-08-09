import {FC, ReactNode} from 'react';
import {classNames} from '@components/class-names';
import './Ghost.css';

type Props = {
    at: {x: number; y: number; width: number};
    drift: {x: number; y: number};
    className: string;
    children: ReactNode;
};

export const Ghost: FC<Props> = ({at, drift, className, children}) =>
    <table className={classNames(className, 'column-ghost')}
           aria-hidden="true"
           style={{
               '--flight-x': `${at.x}px`,
               '--flight-y': `${at.y}px`,
               '--flight-width': `${at.width}px`,
               '--drift-x': `${drift.x}px`,
               '--drift-y': `${drift.y}px`
           }}>
        {children}
    </table>;
