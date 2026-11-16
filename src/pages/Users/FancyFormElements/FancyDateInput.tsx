import {FC, PropsWithChildren} from 'react';
import {FancyInput, FancyInputProps} from './FancyInput';

type FancyDateInputProps = Omit<FancyInputProps, 'type'>;

export const FancyDateInput: FC<PropsWithChildren<FancyDateInputProps>> = ({readOnly = false, ...rest}) => readOnly ?
  <FancyInput type="text" readOnly={readOnly} {...rest}/> : <FancyInput type="date" {...rest}/>;
