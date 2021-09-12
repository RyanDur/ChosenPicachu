import {FancyInput} from '../FancyFormElements/FancyInput';
import {FancySelect} from '../FancyFormElements/FancySelect';
import states from 'states-us/dist';
import React, {FC} from 'react';
import {AddressInfo} from '../types';
import './Address.layout.css';

interface AddressProps {
    onChange: (address: AddressInfo) => void;
    id: string;
    value?: AddressInfo;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
}

export const Address: FC<AddressProps> = (
    {
        onChange,
        id,
        required,
        disabled,
        readOnly,
        value = {} as AddressInfo
    }) => <article id={id} className="address">
    <FancyInput inputId={`${id}-street`} className="street"
                required={required} disabled={disabled} value={value.streetAddress} readOnly={readOnly}
                onChange={event => onChange({...value, streetAddress: event.currentTarget.value as string})}>
        Street
    </FancyInput>
    <FancyInput inputId={`${id}-street-2`} className="street-2"
                disabled={disabled} value={value.streetAddressTwo} readOnly={readOnly}
                onChange={event => onChange({...value, streetAddressTwo: event.currentTarget.value as string})}>
        Street Line 2
    </FancyInput>
    <FancyInput inputId={`${id}-city`} className="city"
                required={required} disabled={disabled} value={value.city} readOnly={readOnly}
                onChange={event => onChange({...value, city: event.currentTarget.value as string})}>
        City
    </FancyInput>

    <FancySelect
        className="state"
        selectId={`${id}-state`}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        value={value.state}
        optionValues={new Set(states.map(({abbreviation}) => abbreviation))}
        onChange={event => onChange({...value, state: event.currentTarget.value as string})}>
        State
    </FancySelect>

    <FancyInput className="zip"
                inputId={`${id}-zip`}
                pattern="^[0-9]{5}(?:-[0-9]{4})?$"
                value={value.zip}
                readOnly={readOnly}
                required={required} disabled={disabled}
                onChange={event => onChange({...value, zip: event.currentTarget.value as string})}>
        Postal / Zip code
    </FancyInput>
</article>;
