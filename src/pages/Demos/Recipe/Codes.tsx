import {FC, PropsWithChildren, useContext} from 'react';
import {StepHeadingId} from './StepHeadingId';

export const Codes: FC<PropsWithChildren> = ({children}) =>
  <figure className="step-code" aria-labelledby={useContext(StepHeadingId)}>{children}</figure>;
