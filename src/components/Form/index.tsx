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
            <FancyTextInput id="first-name-cell" inputId="first-name" label="First Name" required={true}
                            onChange={event => updateUser({...user, firstName: event.currentTarget.value})}/>
            <FancyTextInput id="last-name-cell" inputId="last-name" label="Last Name" required={true}
                            onChange={event => updateUser({...user, lastName: event.currentTarget.value})}/>

            <h3 id="home-address-title">Home Address</h3>
            <FancyTextInput id="home-street-address-cell" inputId="home-street-address"
                            label="Street Address" required={true} testId="home-street-address"
                            onChange={event => updateHomeAddress({
                                ...homeAddress,
                                streetAddress: event.currentTarget.value
                            })}/>
            <FancyTextInput id="home-street-address-2-cell" inputId="home-street-address-2"
                            label="Street Address Line 2" testId="home-street-address-2"
                            onChange={event => updateHomeAddress({
                                ...homeAddress,
                                streetAddressTwo: event.currentTarget.value
                            })}/>

            <FancyTextInput id="home-city-cell" inputId="home-city" label="City" required={true} testId="home-city"
                            onChange={event => updateHomeAddress({...homeAddress, city: event.currentTarget.value})}/>

            <FancySelect
                id="home-state-cell"
                className="stack"
                selectClassName="state"
                selectId="home-state"
                required={true}
                optionValues={new Set(states.map(({abbreviation}) => abbreviation))}
                testId="home-state"
                onChange={event => updateHomeAddress({...homeAddress, state: event.currentTarget.value})}>
                State / Province
            </FancySelect>

            <FancyTextInput id="home-zip-cell" inputId="home-zip"
                            label="Postal / Zip code" required={true} testId="home-zip"
                            onChange={event => updateHomeAddress({...homeAddress, zip: event.currentTarget.value})}/>

            <h3 id="work-address-title">Work Address</h3>
            <article id="same-as-home-cell" className="center-horizontal">
                <label htmlFor="same-as-home">Same as Home</label>
                <input id="same-as-home" type="checkbox"
                       onChange={event => updateSameAsHome(event.currentTarget.checked)}/>
            </article>

            <FancyTextInput id="work-street-address-cell" inputId="work-street-address"
                            label="Street Address" value={workAddress.streetAddress}
                            readOnly={sameAsHome} testId="work-street-address"
                            onChange={event => updateWorkAddress({
                                ...workAddress,
                                streetAddress: event.currentTarget.value
                            })}/>

            <FancyTextInput id="work-street-address-2-cell" inputId="work-street-address-2"
                            label="Street Address Line 2" value={workAddress.streetAddressTwo || ''}
                            readOnly={sameAsHome} testId="work-street-address-2"
                            onChange={event => updateWorkAddress({
                                ...workAddress,
                                streetAddressTwo: event.currentTarget.value
                            })}/>

            <FancyTextInput id="work-city-cell" inputId="work-city" label="City" value={workAddress.city}
                            readOnly={sameAsHome} testId="work-city"
                            onChange={event => updateWorkAddress({
                                ...workAddress,
                                city: event.currentTarget.value
                            })}/>

            <FancySelect
                id="work-state-cell"
                className="stack"
                selectClassName="state"
                selectId="work-state"
                value={workAddress.state}
                required={true}
                disabled={sameAsHome}
                optionValues={new Set(states.map(({abbreviation}) => abbreviation))}
                testId="work-state"
                onChange={event => updateWorkAddress({...workAddress, state: event.currentTarget.value})}>
                State / Province
            </FancySelect>


            <FancyTextInput id="work-zip-cell" inputId="work-zip" label="Postal / Zip code" value={workAddress.zip}
                            readOnly={sameAsHome} testId="work-zip"
                            onChange={event => updateWorkAddress({...workAddress, zip: event.currentTarget.value})}/>

            <section id="details-cell" className="stack">
                <label id="details-label" htmlFor="details">Details</label>
                <textarea name="details" id="details" onChange={event => updateDetails(event.currentTarget.value)}/>
            </section>

            <button id="submit">Submit</button>
        </form>
    </section>;
};