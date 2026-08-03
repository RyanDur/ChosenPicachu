import {FC, ReactNode, RefObject} from 'react';
import {join} from '@components/class-names';
import {Dress} from '../types';

type Props = {
    at: {x: number; y: number; width: number};
    ghost: RefObject<HTMLTableElement | null>;
    dress: Dress;
    children: ReactNode;
};

export const Ghost: FC<Props> = ({at, ghost, dress, children}) =>
    <table ref={ghost}
           className={join(dress.tableClassName, 'column-ghost')}
           style={{
               position: 'fixed',
               top: at.y,
               left: at.x,
               width: at.width,
               willChange: 'transform',
               background: 'var(--paper)',
               boxShadow: 'var(--lift-box-shadow)',
               pointerEvents: 'none'
           }}>
        {children}
    </table>;
