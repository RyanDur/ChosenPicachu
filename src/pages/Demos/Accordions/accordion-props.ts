import {ReactNode} from 'react';
import {PropsWithClassName} from '@components';

export type Fold = {summary: string; body: ReactNode};
type FoldsProps = {folds: Fold[]};
export type AccordionProps = PropsWithClassName<FoldsProps>;
