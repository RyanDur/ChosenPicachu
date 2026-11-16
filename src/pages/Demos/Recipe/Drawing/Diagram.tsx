import {FC, PropsWithChildren} from 'react';
import {Figure} from '../Figure';
import '../../Drawing.css';

export const Diagram: FC<PropsWithChildren<{lead: string; says: string; height: number}>> =
  ({lead, says, height, children}) =>
    <Figure className="diagram" viewBox={`0 0 320 ${height}`} lead={lead} says={says}>{children}</Figure>;
