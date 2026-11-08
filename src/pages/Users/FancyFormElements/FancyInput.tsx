import {FC, ChangeEvent, PropsWithChildren} from 'react';
import {classNames} from '@components';
import {format} from 'date-fns';
import './Fancy.css';

type FancyTextInputProps = {
  type?: 'text' | 'email' | 'date';
  id?: string;
  required?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputClass?: string;
  labelClass?: string;
  value?: string | Date;
  readOnly?: boolean;
  disabled?: boolean;
  pattern?: string;
};

export const FancyInput: FC<PropsWithChildren<FancyTextInputProps>> = (
  {
    type = 'text',
    children,
    id,
    onChange,
    className,
    inputClass,
    labelClass,
    required = false,
    readOnly = false,
    disabled = false,
    pattern,
    value = ''
  }
) => <label id={id} className={classNames(
  'fancy',
  'soft-cornered',
  className
)}>
  <span className={classNames('fancy-title', 'ellipsis', 'bold', 'card-banded', required && 'alarm-starred', labelClass)}>{children}</span>
  <input className={classNames('fancy-text', 'writable', 'soft-cornered', 'lifted', 'raisable', inputClass)}
    pattern={pattern}
    placeholder={type === 'date' ? undefined : ' '}
    readOnly={readOnly}
    disabled={disabled}
    required={required}
    value={value instanceof Date ? format(value, 'yyyy-MM-dd') : value}
    type={type}
    onChange={onChange}/>
</label>;
