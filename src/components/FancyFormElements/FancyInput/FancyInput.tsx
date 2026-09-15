import {FC, ChangeEvent, PropsWithChildren} from 'react';
import {classNames} from '@components/class-names';
import {format} from 'date-fns';
import '../fancy.css';

type FancyTextInputProps = {
  inputId: string;
  type?: string;
  id?: string;
  required?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputClass?: string;
  labelId?: string;
  labelClass?: string;
  value?: string | Date;
  readOnly?: boolean;
  disabled?: boolean;
  pattern?: string;
};

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
) => <label id={id} className={classNames(
  'fancy-input',
  'fancy',
  value !== '' && 'not-empty',
  className
)}>
  <span id={labelId} className={classNames('fancy-title', 'ellipsis', 'bold', labelClass)}>{children}</span>
  <input id={inputId}
    className={classNames('fancy-text', inputClass)}
    pattern={pattern}
    readOnly={readOnly}
    disabled={disabled}
    required={required}
    value={value instanceof Date ? format(value, 'yyyy-MM-dd') : value}
    type={type}
    onChange={onChange}/>
</label>;
