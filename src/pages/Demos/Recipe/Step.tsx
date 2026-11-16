import {FC} from 'react';
import {StepItem, StepProps} from './StepItem';

export const Step: FC<StepProps> = ({id, children}) =>
  <StepItem badge="shadow-badge-before" id={id}>{children}</StepItem>;
