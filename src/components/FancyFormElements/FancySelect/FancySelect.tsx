import {FC, ChangeEvent, PropsWithChildren} from 'react';
import {classNames} from '@components/class-names';
import {FancyInput} from '../FancyInput';
import {Consumer} from '@ryandur/sand';

type FancySelectProps = {
  selectId: string;
  optionValues: Set<string>;
  onChange: Consumer<ChangeEvent<HTMLSelectElement>>;
  value?: string;
  id?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
};

export const FancySelect: FC<PropsWithChildren<FancySelectProps>> = (
  {
    id,
    children,
    value = '',
    optionValues,
    className,
    onChange,
    selectId,
    required = false,
    disabled = false,
    readOnly = false
  }
) => (readOnly || disabled) ? <FancyInput className={className} id={id} value={value} readOnly={readOnly} disabled={disabled} inputId={selectId}>{children}</FancyInput> :
  <label id={id} className={classNames('fancy-select', 'fancy', 'soft-cornered', className)}>
    <span className={classNames('fancy-title', 'bold', 'card-banded', required && 'alarm-starred')}>{children}</span>
    <select id={selectId}
      className={classNames('fancy-select-box', 'fancy-text', 'bare', 'writable', 'soft-cornered', 'chevroned', 'lifted', 'raisable')}
      {...(value ? {value} : {defaultValue: ''})}
      required={required}
      disabled={disabled || readOnly}
      onChange={onChange}>
      {[<option key="placeholder" value="" disabled hidden/>,
        ...Array.from(optionValues).map(state => <option key={state}>{state}</option>)
      ]}
    </select>
  </label>;
