import {FC, PropsWithChildren, useContext} from 'react';
import {StepName} from './StepName';

export const Codes: FC<PropsWithChildren> = ({children}) =>
  <figure className="step-code" aria-labelledby={useContext(StepName)}>{children}</figure>;
