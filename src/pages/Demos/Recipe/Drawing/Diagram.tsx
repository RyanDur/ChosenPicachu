import {FC, PropsWithChildren} from 'react';
import {Figure} from '../Figure';
import '../../Drawing.css';

export const Diagram: FC<PropsWithChildren<{title: string; says: string; height: number}>> =
  ({title, says, height, children}) =>
    <Figure className="diagram" viewBox={`0 0 320 ${height}`} title={title} says={says}>{children}</Figure>;
