import {FancyInput} from '../FancyInput';
import {FancySelect} from '../FancySelect';
import states from 'states-us/dist';
import React, {FC} from 'react';
import {AddressInfo} from '../types';

interface AddressProps {
    kind: string;
    onChange: (address: AddressInfo) => void;
    value?: AddressInfo;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
}

export const Address: FC<AddressProps> = (
    {
        kind,
        onChange,
        required,
        disabled,
        readOnly,
        value = {} as AddressInfo
    }) => <>
    <FancyInput id={`${kind}-street-address-cell`} inputId={`${kind}-street-address`}
                required={required} disabled={disabled} value={value.streetAddress} readOnly={readOnly}
                onChange={event => onChange({...value, streetAddress: event.currentTarget.value})}>
        Street
    </FancyInput>
    <FancyInput id={`${kind}-street-address-2-cell`} inputId={`${kind}-street-address-2`}
                disabled={disabled} value={value.streetAddressTwo} readOnly={readOnly}
                onChange={event => onChange({...value, streetAddressTwo: event.currentTarget.value})}>
        Street Line 2
    </FancyInput>
    <FancyInput id={`${kind}-city-cell`} inputId={`${kind}-city`}
                required={required} disabled={disabled} value={value.city} readOnly={readOnly}
                onChange={event => onChange({...value, city: event.currentTarget.value})}>
        City
    </FancyInput>

    <FancySelect
        id={`${kind}-state-cell`}
        selectId={`${kind}-state`}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        value={value.state}
        optionValues={new Set(states.map(({abbreviation}) => abbreviation))}
        onChange={event => onChange({...value, state: event.currentTarget.value})}>
        State
    </FancySelect>

    <FancyInput id={`${kind}-zip-cell`}
                inputId={`${kind}-zip`}
                pattern="^[0-9]{5}(?:-[0-9]{4})?$"
                value={value.zip}
                readOnly={readOnly}
                required={required} disabled={disabled}
                onChange={event => onChange({...value, zip: event.currentTarget.value})}>
        Postal / Zip code
    </FancyInput>
</>;
