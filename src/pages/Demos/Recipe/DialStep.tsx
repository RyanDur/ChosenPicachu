import {FC} from 'react';
import {StepItem, StepProps} from './StepItem';

export const DialStep: FC<StepProps> = ({id, children}) =>
  <StepItem badge="mint-badge-before" id={id}>{children}</StepItem>;
