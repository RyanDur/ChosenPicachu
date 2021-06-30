import React, {FC, FormEvent, useEffect, useState} from 'react';
import {data} from '../../data';
import {AddressInfo, User} from './types';
import states from 'states-us/dist';
import './Form.layout.css';
import './Form.css';
import {FancyTextInput} from './FancyTextInput';
import {FancySelect} from './FancySelect';

export const Form: FC = () => {
    const initialAddress: AddressInfo = {
        city: '',
        state: '',
        streetAddress: '',
        zip: ''
    };

    const [user, updateUser] = useState<User>({firstName: '', lastName: ''});
    const [homeAddress, updateHomeAddress] = useState<AddressInfo>(initialAddress);
    const [workAddress, updateWorkAddress] = useState<AddressInfo>(initialAddress);
    const [details, updateDetails] = useState<string>();
    const [sameAsHome, updateSameAsHome] = useState(false);

    useEffect(() => {
        if (sameAsHome) {
            updateWorkAddress(homeAddress);
        }
    }, [sameAsHome, homeAddress]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        data.post({
            user,
            homeAddress,
            workAddress,
            details
        });
    };

    return <section className="card overhang gutter">
        <form id="fancy-form" onSubmit={handleSubmit}>
            <h3 id="name-title">Name</h3>
            <FancyTextInput id="first-name-cell" inputId="first-name" required={true}
                            onChange={event => updateUser({...user, firstName: event.currentTarget.value})}>
                First Name
            </FancyTextInput>
            <FancyTextInput id="last-name-cell" inputId="last-name" required={true}
                            onChange={event => updateUser({...user, lastName: event.currentTarget.value})}>
                Last Name
            </FancyTextInput>

            <h3 id="home-address-title">Home Address</h3>
            <FancyTextInput id="home-street-address-cell" inputId="home-street-address" required={true}
                            onChange={event => updateHomeAddress({
                                ...homeAddress, streetAddress: event.currentTarget.value
                            })}>
                Street Address
            </FancyTextInput>
            <FancyTextInput id="home-street-address-2-cell" inputId="home-street-address-2"
                            onChange={event => updateHomeAddress({
                                ...homeAddress, streetAddressTwo: event.currentTarget.value
                            })}>
                Street Address Line 2
            </FancyTextInput>
            <FancyTextInput id="home-city-cell" inputId="home-city" required={true}
                            onChange={event => updateHomeAddress({...homeAddress, city: event.currentTarget.value})}>
                City
            </FancyTextInput>

            <FancySelect
                id="home-state-cell"
                className="stack"
                selectClassName="state"
                selectId="home-state"
                required={true}
                optionValues={new Set(states.map(({abbreviation}) => abbreviation))}
                onChange={event => updateHomeAddress({...homeAddress, state: event.currentTarget.value})}>
                State
            </FancySelect>

            <FancyTextInput id="home-zip-cell" inputId="home-zip" required={true}
                            onChange={event => updateHomeAddress({...homeAddress, zip: event.currentTarget.value})}>
                Postal / Zip code
            </FancyTextInput>

            <h3 id="work-address-title">Work Address</h3>
            <article id="same-as-home-cell" className="center-horizontal">
                <label htmlFor="same-as-home">Same as Home</label>
                <input id="same-as-home" type="checkbox"
                       onChange={event => updateSameAsHome(event.currentTarget.checked)}/>
            </article>

            <FancyTextInput id="work-street-address-cell" inputId="work-street-address"
                            value={workAddress.streetAddress} disabled={sameAsHome}
                            onChange={event => updateWorkAddress({
                                ...workAddress, streetAddress: event.currentTarget.value
                            })}>
                Street Address
            </FancyTextInput>

            <FancyTextInput id="work-street-address-2-cell" inputId="work-street-address-2"
                            value={workAddress.streetAddressTwo || ''} disabled={sameAsHome}
                            onChange={event => updateWorkAddress({
                                ...workAddress, streetAddressTwo: event.currentTarget.value
                            })}>
                Street Address Line 2
            </FancyTextInput>

            <FancyTextInput id="work-city-cell" inputId="work-city" value={workAddress.city} disabled={sameAsHome}
                            onChange={event => updateWorkAddress({
                                ...workAddress, city: event.currentTarget.value
                            })}>
                City
            </FancyTextInput>

            <FancySelect
                id="work-state-cell"
                className="stack"
                selectClassName="state"
                selectId="work-state"
                value={workAddress.state}
                disabled={sameAsHome}
                optionValues={new Set(states.map(({abbreviation}) => abbreviation))}
                onChange={event => updateWorkAddress({...workAddress, state: event.currentTarget.value})}>
                State
            </FancySelect>

            <FancyTextInput id="work-zip-cell" inputId="work-zip" value={workAddress.zip} disabled={sameAsHome}
                            onChange={event => updateWorkAddress({...workAddress, zip: event.currentTarget.value})}>
                Postal / Zip code
            </FancyTextInput>

            <section id="details-cell" className="stack">
                <label id="details-label" htmlFor="details">Details</label>
                <textarea name="details" id="details" onChange={event => updateDetails(event.currentTarget.value)}/>
            </section>

            <button id="submit">Submit</button>
        </form>
    </section>;
};