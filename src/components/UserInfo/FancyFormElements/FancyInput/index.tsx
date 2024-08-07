import {FC, FormEvent, PropsWithChildren} from 'react';
import {join} from '../../../util';
import {format} from 'date-fns';

interface FancyTextInputProps {
  inputId: string;
  type?: string;
  id?: string;
  required?: boolean;
  onChange?: (event: FormEvent<HTMLInputElement>) => void;
  className?: string;
  inputClass?: string;
  labelId?: string;
  labelClass?: string;
  value?: string | Date;
  readOnly?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  pattern?: string;
}

export const FancyInput: FC<PropsWithChildren<FancyTextInputProps>> = (
  {
    inputId,
    type = 'text',
    children,
    id,
    onChange,
    className,
    inputClass,
    labelId,
    labelClass,
    required = false,
    readOnly = false,
    disabled = false,
    autoFocus = false,
    pattern,
    value = ''
  }
) => <article id={id} className={join(
  'fancy',
  value && 'not-empty',
  className
)}>
    <input id={inputId}
           className={join('fancy-text', inputClass)}
           pattern={pattern}
           readOnly={readOnly}
           disabled={disabled}
           required={required}
           data-testid={inputId}
           autoFocus={autoFocus}
           value={value instanceof Date ? format(value, 'yyyy-MM-dd') : value}
           type={type}
           onChange={onChange}/>
    <label id={labelId} className={join('fancy-title', 'ellipsis', labelClass)} htmlFor={inputId}>{children}</label>
</article>;
