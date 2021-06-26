import './Address.layout.css';
import React from 'react';

interface AddressProps {
    kind: string;
    id?: string;
}

export const Address = ({kind, id}: AddressProps) => {
    return <article id={id} className="address">
        <article className="street-address-cell stack">
            <label htmlFor={`${kind}-street-address`}>Street Address</label>
            <input id={`${kind}-street-address`} className="street-address" type="text"/>
        </article>
        <article className="street-address-2-cell stack">
            <label htmlFor={`${kind}-street-address-2`}>Street Address Line 2</label>
            <input id={`${kind}-street-address-2`} className="street-address-2" type="text"/>
        </article>
        <article className="city-cell stack">
            <label htmlFor={`${kind}-city`}>City</label>
            <input id={`${kind}-city`} className="city" type="text"/>
        </article>
        <article className="state-cell stack">
            <label htmlFor={`${kind}-state`}>State / Province</label>
            <input id={`${kind}-state`} className="state" type="text"/>
        </article>
        <article className="zip-cell stack">
            <label htmlFor={`${kind}-zip`}>Postal / Zip code</label>
            <input id={`${kind}-zip`} className="zip" type="text"/>
        </article>
    </article>;
};