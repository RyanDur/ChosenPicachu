import {FancyTextInput} from '../FancyTextInput';
import {FancySelect} from '../FancySelect';
import states from 'states-us/dist';
import React, {FC, useEffect, useReducer} from 'react';
import {AddressInfo} from '../types';
import {AddressActions} from './actions';
import {addressReducer} from './reducer';

interface AddressProps {
    kind: string;
    onChange: (address: AddressInfo) => void;
    required?: boolean;
    disabled?: boolean;
    value?: AddressInfo;
}

type Indexable = {
    [index in (string | number)]: unknown;
};

const notEmpty = (obj: Indexable, ...optional: (string | number)[]): boolean =>
    !!Object.keys(obj)
        .filter(key => !optional.includes(key))
        .map(key => obj[key])
        .filter(value => !!value)
        .length;

export const Address: FC<AddressProps> = (
    {
        kind,
        onChange,
        required,
        disabled,
        value = {}
    }) => {
    const [address, dispatch] = useReducer(addressReducer, value);

    useEffect(() => {
        if (notEmpty(address, 'streetAddressTwo')) onChange(address as AddressInfo);
    }, [address, onChange]);

    return <>
        <FancyTextInput id={`${kind}-street-address-cell`} inputId={`${kind}-street-address`}
                        required={required} disabled={disabled} value={value?.streetAddress}
                        onChange={event => dispatch({
                            type: AddressActions.UPDATE_STREET_ADDRESS, streetAddress: event.currentTarget.value
                        })}>
            Street
        </FancyTextInput>
        <FancyTextInput id={`${kind}-street-address-2-cell`} inputId={`${kind}-street-address-2`}
                        disabled={disabled} value={value?.streetAddressTwo}
                        onChange={event => dispatch({
                            type: AddressActions.UPDATE_STREET_ADDRESS_2, streetAddressTwo: event.currentTarget.value
                        })}>
            Street Line 2
        </FancyTextInput>
        <FancyTextInput id={`${kind}-city-cell`} inputId={`${kind}-city`}
                        required={required} disabled={disabled} value={value?.city}
                        onChange={event => dispatch({
                            type: AddressActions.UPDATE_CITY, city: event.currentTarget.value
                        })}>
            City
        </FancyTextInput>

        <FancySelect
            id={`${kind}-state-cell`}
            selectId={`${kind}-state`}
            required={required} disabled={disabled}
            value={value?.state}
            optionValues={new Set(states.map(({abbreviation}) => abbreviation))}
            onChange={event => dispatch({type: AddressActions.UPDATE_STATE, state: event.currentTarget.value})}>
            State
        </FancySelect>

        <FancyTextInput id={`${kind}-zip-cell`}
                        inputId={`${kind}-zip`}
                        pattern="^[0-9]{5}(?:-[0-9]{4})?$"
                        value={value?.zip}
                        required={required} disabled={disabled}
                        onChange={event => dispatch({type: AddressActions.UPDATE_ZIP, zip: event.currentTarget.value})}>
            Postal / Zip code
        </FancyTextInput>
    </>;
};
