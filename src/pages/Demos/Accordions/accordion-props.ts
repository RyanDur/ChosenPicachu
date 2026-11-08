import {ReactNode} from 'react';
import {PropsWithClassName} from '../props-with-class-name';
import {FoldMotion} from './fold-motion';

export type Fold = {title: string; text: ReactNode};
type FoldsProps = {folds: Fold[]};
export type AccordionProps = PropsWithClassName & FoldsProps & {motion: FoldMotion};
