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
  address?: Address;
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
    address = {streetAddress: '', city: '', state: '', zip: ''}
  }) => {
  const titleId = useId();
  return <fieldset className={classNames('address', 'shrinkable', className)} disabled={disabled}
    aria-labelledby={titleId}>
    <legend className="address-title sub-title bold"><span id={titleId}>{title}</span>{children}</legend>
    <FancyInput className="street"
      required={required} value={address.streetAddress} readOnly={readOnly}
      onChange={event => onEdited({...address, streetAddress: event.currentTarget.value})}>
      Street
    </FancyInput>
    <FancyInput className="street-2"
      value={address.streetAddressTwo} readOnly={readOnly}
      onChange={event => onEdited({...address, streetAddressTwo: event.currentTarget.value})}>
      Street Line 2
    </FancyInput>
    <FancyInput className="city"
      required={required} value={address.city} readOnly={readOnly}
      onChange={event => onEdited({...address, city: event.currentTarget.value})}>
      City
    </FancyInput>

    <FancySelect
      className="state"
      required={required}
      readOnly={readOnly}
      value={address.state}
      optionValues={new Set(stateAbbreviations)}
      onChange={event => onEdited({...address, state: event.currentTarget.value})}>
      State
    </FancySelect>

    <FancyInput className="zip"
      pattern="^[0-9]{5}(?:-[0-9]{4})?$"
      value={address.zip}
      readOnly={readOnly}
      required={required}
      onChange={event => onEdited({...address, zip: event.currentTarget.value})}>
      Postal / Zip code
    </FancyInput>
  </fieldset>;
};
