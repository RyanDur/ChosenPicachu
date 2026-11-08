import {FC, PropsWithChildren, useId} from 'react';
import {FancyInput, FancySelect} from '../../FancyFormElements';
import {classNames} from '@components';
import {stateAbbreviations} from './states';
import {Address} from '../../profile';
import './AddressFields.css';

type AddressFieldsAttributes = {
  title: string;
  className?: string;
  onEdited: (address: Address) => void;
  value?: Address;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
};

export const AddressFields: FC<PropsWithChildren<AddressFieldsAttributes>> = (
  {
    title,
    children,
    className,
    onEdited,
    required,
    disabled,
    readOnly,
    value = {streetAddress: '', city: '', state: '', zip: ''}
  }) => {
  const titleId = useId();
  return <fieldset className={classNames('address', 'shrinkable', className)} disabled={disabled}
    aria-labelledby={titleId}>
    <legend className="address-title sub-title bold"><span id={titleId}>{title}</span>{children}</legend>
    <FancyInput className="street"
      required={required} value={value.streetAddress} readOnly={readOnly}
      onChange={event => onEdited({...value, streetAddress: event.currentTarget.value})}>
      Street
    </FancyInput>
    <FancyInput className="street-2"
      value={value.streetAddressTwo} readOnly={readOnly}
      onChange={event => onEdited({...value, streetAddressTwo: event.currentTarget.value})}>
      Street Line 2
    </FancyInput>
    <FancyInput className="city"
      required={required} value={value.city} readOnly={readOnly}
      onChange={event => onEdited({...value, city: event.currentTarget.value})}>
      City
    </FancyInput>

    <FancySelect
      className="state"
      required={required}
      readOnly={readOnly}
      value={value.state}
      optionValues={new Set(stateAbbreviations)}
      onChange={event => onEdited({...value, state: event.currentTarget.value})}>
      State
    </FancySelect>

    <FancyInput className="zip"
      pattern="^[0-9]{5}(?:-[0-9]{4})?$"
      value={value.zip}
      readOnly={readOnly}
      required={required}
      onChange={event => onEdited({...value, zip: event.currentTarget.value})}>
      Postal / Zip code
    </FancyInput>
  </fieldset>;
};
