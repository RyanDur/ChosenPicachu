import {FC, PropsWithChildren} from 'react';
import {classNames} from '@components/class-names';
import {FancyInput} from '@components/FancyFormElements/FancyInput';
import {FancySelect} from '@components/FancyFormElements/FancySelect';
import {stateAbbreviations} from './states';
import {AddressInfo} from '@components/Users/UserInfo/user';
import './Address.css';

type AddressProps = {
  title: string;
  className?: string;
  onEdited: (address: AddressInfo) => void;
  id: string;
  value?: AddressInfo;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
};

export const Address: FC<PropsWithChildren<AddressProps>> = (
  {
    title,
    children,
    className,
    onEdited,
    id,
    required,
    disabled,
    readOnly,
    value = {streetAddress: '', city: '', state: '', zip: ''}
  }) => <fieldset id={id} className={classNames('address', 'shrinkable', className)} disabled={disabled}
  aria-labelledby={`${id}-title`}>
  <legend className="address-title sub-title bold"><span id={`${id}-title`}>{title}</span>{children}</legend>
  <div className="address-fields">
    <FancyInput inputId={`${id}-street`} className="street"
      required={required} value={value.streetAddress} readOnly={readOnly}
      onChange={event => onEdited({...value, streetAddress: event.currentTarget.value})}>
      Street
    </FancyInput>
    <FancyInput inputId={`${id}-street-2`} className="street-2"
      value={value.streetAddressTwo} readOnly={readOnly}
      onChange={event => onEdited({...value, streetAddressTwo: event.currentTarget.value})}>
      Street Line 2
    </FancyInput>
    <FancyInput inputId={`${id}-city`} className="city"
      required={required} value={value.city} readOnly={readOnly}
      onChange={event => onEdited({...value, city: event.currentTarget.value})}>
      City
    </FancyInput>

    <FancySelect
      className="state"
      selectId={`${id}-state`}
      required={required}
      readOnly={readOnly}
      value={value.state}
      optionValues={new Set(stateAbbreviations)}
      onChange={event => onEdited({...value, state: event.currentTarget.value})}>
      State
    </FancySelect>

    <FancyInput className="zip"
      inputId={`${id}-zip`}
      pattern="^[0-9]{5}(?:-[0-9]{4})?$"
      value={value.zip}
      readOnly={readOnly}
      required={required}
      onChange={event => onEdited({...value, zip: event.currentTarget.value})}>
      Postal / Zip code
    </FancyInput>
  </div>
</fieldset>;
