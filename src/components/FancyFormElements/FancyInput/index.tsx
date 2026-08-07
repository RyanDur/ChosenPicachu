import {FC, FormEvent, PropsWithChildren} from 'react';
import {classNames} from '@components/class-names';
import {format} from 'date-fns';

type FancyTextInputProps = {
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
        pattern,
    value = ''
  }
) => <article id={id} className={classNames(
  'fancy-input',
  'fancy',
  value && 'not-empty',
  className
)}>
    <input id={inputId}
           className={classNames('fancy-text', inputClass)}
           pattern={pattern}
           readOnly={readOnly}
           disabled={disabled}
           required={required}
           value={value instanceof Date ? format(value, 'yyyy-MM-dd') : value}
           type={type}
           onChange={onChange}/>
    <label id={labelId} className={classNames('fancy-title', 'ellipsis', labelClass)} htmlFor={inputId}>{children}</label>
</article>;
