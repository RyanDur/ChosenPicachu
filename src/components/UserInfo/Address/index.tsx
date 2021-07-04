import {FancyTextInput} from '../FancyTextInput';
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
}

export const Address: FC<AddressProps> = (
    {
        kind,
        onChange,
        required,
        disabled,
        value = {} as AddressInfo
    }) => <>
    <FancyTextInput id={`${kind}-street-address-cell`} inputId={`${kind}-street-address`}
                    required={required} disabled={disabled} value={value.streetAddress}
                    onChange={event => onChange({...value, streetAddress: event.currentTarget.value})}>
        Street
    </FancyTextInput>
    <FancyTextInput id={`${kind}-street-address-2-cell`} inputId={`${kind}-street-address-2`}
                    disabled={disabled} value={value.streetAddressTwo}
                    onChange={event => onChange({...value, streetAddressTwo: event.currentTarget.value})}>
        Street Line 2
    </FancyTextInput>
    <FancyTextInput id={`${kind}-city-cell`} inputId={`${kind}-city`}
                    required={required} disabled={disabled} value={value.city}
                    onChange={event => onChange({...value, city: event.currentTarget.value})}>
        City
    </FancyTextInput>

    <FancySelect
        id={`${kind}-state-cell`}
        selectId={`${kind}-state`}
        required={required} disabled={disabled}
        value={value.state}
        optionValues={new Set(states.map(({abbreviation}) => abbreviation))}
        onChange={event => onChange({...value, state: event.currentTarget.value})}>
        State
    </FancySelect>

    <FancyTextInput id={`${kind}-zip-cell`}
                    inputId={`${kind}-zip`}
                    pattern="^[0-9]{5}(?:-[0-9]{4})?$"
                    value={value.zip}
                    required={required} disabled={disabled}
                    onChange={event => onChange({...value, zip: event.currentTarget.value})}>
        Postal / Zip code
    </FancyTextInput>
</>;
