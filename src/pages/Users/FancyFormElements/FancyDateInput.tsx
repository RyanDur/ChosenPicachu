import {FC, ChangeEvent, PropsWithChildren} from 'react';
import {PropsWithClassName} from '@components';
import {FancyInput} from './FancyInput';

type FancyDateInputProps = PropsWithClassName<{
  required?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  inputClass?: string;
  labelClass?: string;
  value?: string | Date;
  readOnly?: boolean;
  disabled?: boolean;
  pattern?: string;
}>;

export const FancyDateInput: FC<PropsWithChildren<FancyDateInputProps>> = ({readOnly = false, ...rest}) => readOnly ?
  <FancyInput type="text" readOnly={readOnly} {...rest}/> : <FancyInput type="date" {...rest}/>;
