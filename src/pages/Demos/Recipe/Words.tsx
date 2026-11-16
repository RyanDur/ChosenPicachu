import {FC, PropsWithChildren, useContext} from 'react';
import {StepHeadingId} from './StepHeadingId';

export const Words: FC<PropsWithChildren> = ({children}) =>
  <article className="step-words" aria-labelledby={useContext(StepHeadingId)}>{children}</article>;
