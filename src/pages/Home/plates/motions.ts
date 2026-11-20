import {FC} from 'react';
import {Ellipse} from './Ellipse';
import {MotionKind} from './thePage';
import {Rippling} from './Rippling';
import {Turning} from './Turning';

export const motions: Record<MotionKind, FC<Ellipse>> = {turning: Turning, rippling: Rippling};
