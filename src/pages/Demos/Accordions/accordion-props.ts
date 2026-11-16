import {ReactNode} from 'react';
import {PropsWithClassName} from '@components';

export type Fold = {heading: string; story: ReactNode};
type FoldsProps = {folds: Fold[]};
export type AccordionProps = PropsWithClassName<FoldsProps>;
