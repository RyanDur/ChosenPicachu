import React, {FC, useEffect, useReducer, useState} from 'react';
import {Consumer, UserInfo} from './types';
import {FancyInput} from './FancyInput';
import {joinClassNames} from '../util';
import {FancyTextarea} from './FancyTextarea';
import {
    resetForm,
    updateAvatar,
    updateDetails,
    updateEmail,
    updateFirstName,
    updateHomeAddress,
    updateLastName,
    updateWorkAddress
} from './actions';
import {Address} from './Address';
import {formReducer, initialState} from './reducer';
import './Form.layout.css';
import './Form.css';
import {generateAvatar} from '../../avatars';

interface FormProps {
    onAdd?: Consumer<UserInfo>;
}

export const UserInformation: FC<FormProps> = ({onAdd}) => {
    const [userInfo, dispatch] = useReducer(formReducer, initialState);
    const [sameAsHome, updateSameAsHome] = useState(false);
    const [isInvalid, updateValidity] = useState(false);

    useEffect(() => {
        if (sameAsHome) dispatch(updateWorkAddress(userInfo.homeAddress));
    }, [sameAsHome, userInfo.homeAddress]);

    const reset = () => {
        dispatch(resetForm());
        updateSameAsHome(false);
        updateValidity(false);
    };

    return <form id="user-info-form"
                 className={joinClassNames(isInvalid && 'invalid')}
                 onSubmit={event => {
                     event.preventDefault();
                     onAdd?.(userInfo);
                     reset();
                 }}
                 onReset={reset}
                 onInvalid={() => updateValidity(true)}>
        <h3 id="name-title">User</h3>
        <FancyInput id="first-name-cell" inputId="first-name" required={true}
                    value={userInfo.user.firstName}
                    onChange={event => dispatch(updateFirstName(event.currentTarget.value))}>
            First Name
        </FancyInput>
        <FancyInput id="last-name-cell" inputId="last-name" required={true}
                    value={userInfo.user.lastName}
                    onChange={event => dispatch(updateLastName(event.currentTarget.value))}>
            Last Name
        </FancyInput>
        <FancyInput id="email-cell" inputId="email" value={userInfo.user.email} type="email"
                    onChange={event => dispatch(updateEmail(event.currentTarget.value))}>
            Email
        </FancyInput>

        <article id="avatar-cell" className="card" onClick={() => dispatch(updateAvatar(generateAvatar()))}>
            <img id="avatar" src={userInfo.avatar} alt="avatar"/>
        </article>

        <h3 id="home-address-title">Home Address</h3>
        <Address required={true} kind="home" value={userInfo.homeAddress}
                 onChange={address => dispatch(updateHomeAddress(address))}/>

        <h3 id="work-address-title">Work Address</h3>
        <article id="same-as-home-cell" className="center-horizontal">
            <label htmlFor="same-as-home">Same as Home</label>
            <input id="same-as-home" type="checkbox" checked={sameAsHome}
                   onChange={event => updateSameAsHome(event.currentTarget.checked)}/>
        </article>
        <Address disabled={sameAsHome} kind="work" value={userInfo.workAddress}
                 onChange={address => dispatch(updateWorkAddress(address))}/>

        <FancyTextarea value={userInfo.details}
                       onChange={event => dispatch(updateDetails(event.currentTarget.value))}/>

        <button id="reset" type="reset" className="secondary ripple">Reset</button>
        <button id="submit" type="submit" className="primary ripple">Add</button>
    </form>;
};