import React, {FormEvent, useEffect, useState} from 'react';
import {data} from '../../data';
import {AddressInfo, User} from './types';
import states from 'states-us/dist';
import './Form.layout.css';
import './Form.css';

export const Form = () => {
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
            <section className="name">
                <h3 className="name-title">Name</h3>
                <article id="first-name-cell" className="stack">
                    <input type="text" id="first-name" required
                           onChange={event => updateUser({...user, firstName: event.currentTarget.value})}/>
                    <label id="first-name-label" htmlFor="first-name">First Name</label>
                </article>

                <article id="last-name-cell" className="stack">
                    <input type="text" id="last-name" required
                           onChange={event => updateUser({...user, lastName: event.currentTarget.value})}/>
                    <label id="last-name-label" htmlFor="last-name">Last Name</label>
                </article>
            </section>

            <section id="addresses">
                <h3 id="home-address-title">Home Address</h3>
                <section id={'home-address'} className="address">
                    <article className="street-address-cell stack">
                        <input id={'home-street-address'} type="text" required data-testid={'home-street-address'}
                               onChange={event => updateHomeAddress({
                                   ...homeAddress,
                                   streetAddress: event.currentTarget.value
                               })}/>
                        <label htmlFor={'home-street-address'}>Street Address</label>
                    </article>
                    <article className="street-address-2-cell stack">
                        <input id={'home-street-address-2'} type="text" data-testid={'home-street-address-2'}
                               onChange={event => updateHomeAddress({
                                   ...homeAddress,
                                   streetAddressTwo: event.currentTarget.value
                               })}/>
                        <label htmlFor={'home-street-address-2'}>Street Address Line 2</label>
                    </article>
                    <article className="city-cell stack">
                        <input id={'home-city'} type="text" required data-testid={'home-city'}
                               onChange={event => updateHomeAddress({
                                   ...homeAddress,
                                   city: event.currentTarget.value
                               })}/>
                        <label htmlFor={'home-city'}>City</label>
                    </article>
                    <article className="state-cell stack">
                        <select id={'home-state'}
                                className="state"
                                required
                                defaultValue=""
                                data-testid={'home-state'}
                                onChange={event => updateHomeAddress({
                                    ...homeAddress,
                                    state: event.currentTarget.value
                                })}>
                            {[<option key="placeholder" value="" disabled hidden>Select</option>,
                                ...states.map(({abbreviation}) =>
                                    <option key={abbreviation}>{abbreviation}</option>)
                            ]}
                        </select>
                        <label htmlFor={'home-state'}>State / Province</label>
                    </article>
                    <article className="zip-cell stack">
                        <input id={'home-zip'} type="text" required data-testid={'home-zip'}
                               onChange={event => updateHomeAddress({...homeAddress, zip: event.currentTarget.value})}/>
                        <label htmlFor={'home-zip'}>Postal / Zip code</label>
                    </article>
                </section>

                <section id="work-address-title" className="center-horizontal spread">
                    <h3>Work Address</h3>
                    <article className="center-horizontal">
                        <label htmlFor="same-as-home">Same as Home</label>
                        <input id="same-as-home" type="checkbox"
                               onChange={event => updateSameAsHome(event.currentTarget.checked)}/>
                    </article>
                </section>

                <section id="work-address" className="address">
                    <article className="street-address-cell stack">
                        <input id="work-street-address"
                               type="text"
                               value={workAddress.streetAddress}
                               readOnly={sameAsHome}
                               data-testid="work-street-address"
                               onChange={event => updateWorkAddress({
                                   ...workAddress,
                                   streetAddress: event.currentTarget.value
                               })}/>
                        <label htmlFor="work-street-address">Street Address</label>
                    </article>
                    <article className="street-address-2-cell stack">
                        <input id="work-street-address-2"
                               type="text"
                               value={workAddress.streetAddressTwo || ''}
                               readOnly={sameAsHome}
                               data-testid="work-street-address-2"
                               onChange={event => updateWorkAddress({
                                   ...workAddress,
                                   streetAddressTwo: event.currentTarget.value
                               })}/>
                        <label htmlFor="work-street-address-2">Street Address Line 2</label>
                    </article>
                    <article className="city-cell stack">
                        <input id="work-city"
                               type="text"
                               value={workAddress.city}
                               readOnly={sameAsHome}
                               data-testid="work-city"
                               onChange={event => updateWorkAddress({
                                   ...workAddress,
                                   city: event.currentTarget.value
                               })}/>
                        <label htmlFor="work-city">City</label>
                    </article>
                    <article className="state-cell stack">
                        <select id='work-state'
                                className="state"
                                value={workAddress.state}
                                disabled={sameAsHome}
                                data-testid={'work-state'}
                                onChange={event => updateWorkAddress({
                                    ...workAddress,
                                    state: event.currentTarget.value
                                })}>
                            {[<option key="placeholder" value="" disabled hidden>Select</option>,
                                ...states.map(({abbreviation}) =>
                                    <option key={abbreviation}>{abbreviation}</option>)
                            ]}
                        </select>
                        <label htmlFor="work-state">State / Province</label>
                    </article>
                    <article className="zip-cell stack">
                        <input id="work-zip"
                               type="text"
                               value={workAddress.zip}
                               readOnly={sameAsHome}
                               data-testid="work-zip"
                               onChange={event => updateWorkAddress({...workAddress, zip: event.currentTarget.value})}/>
                        <label htmlFor="work-zip">Postal / Zip code</label>
                    </article>
                </section>
            </section>

            <section id="details-cell" className="stack">
                <textarea name="details" id="details" onChange={event => updateDetails(event.currentTarget.value)}/>
                <label id="details-label" htmlFor="details">Details</label>
            </section>

            <button id="submit">Submit</button>
        </form>
    </section>;
};