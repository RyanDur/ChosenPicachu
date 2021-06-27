import './Address.layout.css';
import React, {FC, useEffect, useState} from 'react';
import states from 'states-us/dist';
import {AddressInfo} from '../index';

interface AddressProps {
    kind: string;
    consumer: (address: AddressInfo) => void,
    required?: boolean;
    id?: string;
}

export const Address: FC<AddressProps> = ({kind, id, required, consumer}) => {
    const [address, updateAddress] = useState<AddressInfo>({
        city: '',
        state: '',
        streetAddress: '',
        zip: ''
    });

    useEffect(() => {
        consumer(address);
    }, [address]);

    return <article id={id} className="address">
        <article className="street-address-cell stack">
            <input id={`${kind}-street-address`} type="text" required={required} data-testid={`${kind}-street-address`}
                   onChange={event => updateAddress({...address, streetAddress: event.target.value})}/>
            <label htmlFor={`${kind}-street-address`}>Street Address</label>
        </article>
        <article className="street-address-2-cell stack">
            <input id={`${kind}-street-address-2`} type="text" data-testid={`${kind}-street-address-2`}
                   onChange={event => updateAddress({...address, streetAddress2: event.target.value})}/>
            <label htmlFor={`${kind}-street-address-2`}>Street Address Line
                2</label>
        </article>
        <article className="city-cell stack">
            <input id={`${kind}-city`} type="text" required={required} data-testid={`${kind}-city`}
                   onChange={event => updateAddress({...address, city: event.target.value})}/>
            <label htmlFor={`${kind}-city`}>City</label>
        </article>
        <article className="state-cell stack">
            <select id={`${kind}-state`}
                    className="state"
                    defaultValue=""
                    required={required}
                    data-testid={`${kind}-state`}
                    onChange={event => updateAddress({...address, state: event.target.value})}>
                {[<option key="asdfasdfasdf" disabled hidden>Select</option>,
                    ...states.map(({abbreviation}) =>
                        <option key={abbreviation}>{abbreviation}</option>)
                ]}
            </select>
            <label htmlFor={`${kind}-state`}>State / Province</label>
        </article>
        <article className="zip-cell stack">
            <input id={`${kind}-zip`} type="text" required={required} data-testid={`${kind}-zip`}
                   onChange={event => updateAddress({...address, zip: event.target.value})}/>
            <label htmlFor={`${kind}-zip`}>Postal / Zip code</label>
        </article>
    </article>;
};