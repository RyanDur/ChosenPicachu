import {FC, PropsWithChildren, useContext} from 'react';
import {StepName} from './StepName';

export const Words: FC<PropsWithChildren> = ({children}) =>
  <article className="step-words" aria-labelledby={useContext(StepName)}>{children}</article>;
