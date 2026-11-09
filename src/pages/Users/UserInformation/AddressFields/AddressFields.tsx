import {FC, PropsWithChildren, useId} from 'react';
import {FancyInput, FancySelect} from '../../FancyFormElements';
import {classNames} from '@components';
import {stateAbbreviations} from './states';
import {AddressName} from '../draftActions';
import {useAddressDraft} from '../useAddressDraft';
import './AddressFields.css';

type AddressFieldsAttributes = {
  title: string;
  className?: string;
  name: AddressName;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
};

export const AddressFields: FC<PropsWithChildren<AddressFieldsAttributes>> = (
  {
    title,
    children,
    className,
    name,
    required,
    disabled,
    readOnly
  }) => {
  const titleId = useId();
  const {address, edit} = useAddressDraft(name);
  return <fieldset name={name} className={classNames('address', 'shrinkable', className)} disabled={disabled}
    aria-labelledby={titleId}>
    <legend className="address-title sub-title bold"><span id={titleId}>{title}</span>{children}</legend>
    <FancyInput className="street"
      required={required} value={address.streetAddress} readOnly={readOnly}
      onChange={event => edit({...address, streetAddress: event.currentTarget.value})}>
      Street
    </FancyInput>
    <FancyInput className="street-2"
      value={address.streetAddressTwo} readOnly={readOnly}
      onChange={event => edit({...address, streetAddressTwo: event.currentTarget.value})}>
      Street Line 2
    </FancyInput>
    <FancyInput className="city"
      required={required} value={address.city} readOnly={readOnly}
      onChange={event => edit({...address, city: event.currentTarget.value})}>
      City
    </FancyInput>

    <FancySelect
      className="state"
      required={required}
      readOnly={readOnly}
      value={address.state}
      optionValues={new Set(stateAbbreviations)}
      onChange={event => edit({...address, state: event.currentTarget.value})}>
      State
    </FancySelect>

    <FancyInput className="zip"
      pattern="^[0-9]{5}(?:-[0-9]{4})?$"
      value={address.zip}
      readOnly={readOnly}
      required={required}
      onChange={event => edit({...address, zip: event.currentTarget.value})}>
      Postal / Zip code
    </FancyInput>
  </fieldset>;
};
