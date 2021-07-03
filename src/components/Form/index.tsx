import React, {FC, FormEvent, useEffect, useState} from 'react';
import {data} from '../../data';
import {AddressInfo, User} from './types';
import {FancyTextInput} from './FancyTextInput';
import './Form.layout.css';
import './Form.css';
import {joinClassNames} from '../util';
import {Address} from './Address';

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
    const [focused, updateDetailsFocus] = useState(false);
    const [isInvalid, updateValidity] = useState(false);

    useEffect(() => {
        if (sameAsHome) updateWorkAddress(homeAddress);
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
        <form id="fancy-form"
              className={joinClassNames(isInvalid && 'invalid')}
              onSubmit={handleSubmit}
              onInvalid={() => updateValidity(true)}>
            <h3 id="name-title">Name</h3>
            <FancyTextInput id="first-name-cell" inputId="first-name" required={true}
                            onChange={event => updateUser({
                                ...user, firstName: event.currentTarget.value
                            })}>
                First
            </FancyTextInput>
            <FancyTextInput id="last-name-cell" inputId="last-name" required={true}
                            onChange={event => updateUser({
                                ...user, lastName: event.currentTarget.value
                            })}>
                Last
            </FancyTextInput>

            <h3 id="home-address-title">Home Address</h3>
            <Address kind="home" required={true} onChange={updateHomeAddress}/>

            <h3 id="work-address-title">Work Address</h3>
            <article id="same-as-home-cell" className="center-horizontal">
                <label htmlFor="same-as-home">Same as Home</label>
                <input id="same-as-home" type="checkbox"
                       onChange={event => updateSameAsHome(event.currentTarget.checked)}/>
            </article>
            <Address kind="work" value={workAddress} disabled={sameAsHome} onChange={updateWorkAddress}/>

            <section id="details-cell" className={joinClassNames(
                'fancy',
                focused && 'focus',
                details && 'not-empty'
            )}>
                <label id="details-label" className="fancy-title" htmlFor="details">Details</label>
                <textarea name="details" className="fancy-text" id="details"
                          onFocus={() => updateDetailsFocus(true)}
                          onBlur={() => updateDetailsFocus(false)}
                          onChange={event => updateDetails(event.currentTarget.value)}/>
            </section>

            <button id="submit" className="primary ripple">Submit</button>
        </form>
    </section>;
};