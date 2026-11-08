import {ReactNode} from 'react';
import {PropsWithClassName} from '../props-with-class-name';
import {FoldMotion} from './fold-motion';

export type Fold = {value: ReactNode; key: string};
type ContentProps = {content: Fold[]};
export type AccordionProps = PropsWithClassName & ContentProps & {motion: FoldMotion};
