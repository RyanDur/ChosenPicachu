import {FC, ReactNode} from 'react';
import {join} from '@components/class-names';
import {Dress} from '@components/Table';
import './Ghost.css';

type Props = {
    at: {x: number; y: number; width: number};
    drift: {x: number; y: number};
    dress: Dress;
    children: ReactNode;
};

export const Ghost: FC<Props> = ({at, drift, dress, children}) =>
    <table className={join(dress.tableClassName, 'column-ghost')}
           aria-hidden="true"
           style={{
               top: at.y,
               left: at.x,
               width: at.width,
               transform: `translate(${drift.x}px, ${drift.y}px)`
           }}>
        {children}
    </table>;
