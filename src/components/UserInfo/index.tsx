import React, {FC, useEffect, useReducer, useState} from 'react';
import {Consumer, UserInfo} from './types';
import {FancyInput} from './FancyInput';
import {join} from '../util';
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
import {generateAvatar} from '../../avatars';
import {Link} from 'react-router-dom';
import {Paths} from '../../App';
import './Form.layout.css';
import './Form.css';

interface FormProps {
    currentUserInfo?: UserInfo;
    onAdd?: Consumer<UserInfo>;
    onUpdate?: Consumer<UserInfo>;
    readOnly?: boolean;
    editing?: boolean;
}

export const UserInformation: FC<FormProps> = (
    {
        onAdd,
        onUpdate,
        readOnly = false,
        editing = false,
        currentUserInfo = initialState
    }) => {
    const [userInfo, dispatch] = useReducer(formReducer, initialState, () => currentUserInfo);
    const [sameAsHome, updateSameAsHome] = useState(false);

    useEffect(() => {
        if (sameAsHome) dispatch(updateWorkAddress(userInfo.homeAddress));
    }, [sameAsHome, userInfo.homeAddress]);

    const reset = () => {
        if (editing) dispatch(resetForm(currentUserInfo));
        else dispatch(resetForm());
        updateSameAsHome(false);
    };

    return <form id="user-info-form"
                 data-testid="user-info-form"
                 className={join(readOnly && 'read-only')}
                 onSubmit={event => {
                     event.preventDefault();
                     if (editing) onUpdate?.(userInfo);
                     else onAdd?.(userInfo);
                     event.currentTarget.reset?.();
                 }}
                 onReset={event => {
                     reset();
                     event.currentTarget.classList.remove('invalid');
                 }}
                 onInvalid={event => event.currentTarget.classList.add('invalid')}>
        <h3 id="name-title">User</h3>
        <FancyInput id="first-name-cell" inputId="first-name" required
                    value={userInfo.user.firstName} readOnly={readOnly}
                    onChange={event => dispatch(updateFirstName(event.currentTarget.value))}>
            First Name
        </FancyInput>
        <FancyInput id="last-name-cell" inputId="last-name" required
                    value={userInfo.user.lastName} readOnly={readOnly}
                    onChange={event => dispatch(updateLastName(event.currentTarget.value))}>
            Last Name
        </FancyInput>
        <FancyInput id="email-cell" inputId="email" value={userInfo.user.email}
                    type="email" readOnly={readOnly}
                    onChange={event => dispatch(updateEmail(event.currentTarget.value))}>
            Email
        </FancyInput>

        <article tabIndex={0} id="avatar-cell"
                 className={join('card', readOnly && 'read-only')}
                 data-testid="avatar-cell"
                 onKeyPress={event => event.preventDefault()}
                 onClick={() => readOnly || dispatch(updateAvatar(generateAvatar()))}>
            <img id="avatar" src={userInfo.avatar} alt="avatar"/>
        </article>

        <h3 id="home-address-title">Home Address</h3>
        <Address id="home-address" value={userInfo.homeAddress} readOnly={readOnly} required
                 onChange={address => dispatch(updateHomeAddress(address))}/>

        <h3 id="work-address-title">Work Address</h3>
        <article id="same-as-home-cell" className={join('center-horizontal', readOnly && 'read-only')}>
            <input id="same-as-home" type="checkbox" checked={sameAsHome} disabled={readOnly}
                   onChange={event => updateSameAsHome(event.currentTarget.checked)}/>
            <label id="same-as-home-title" htmlFor="same-as-home">Same as Home</label>
        </article>
        <Address id="work-address" value={userInfo.workAddress} readOnly={readOnly} disabled={sameAsHome}
                 onChange={address => dispatch(updateWorkAddress(address))}/>

        <FancyTextarea value={userInfo.details} readOnly={readOnly}
                       onChange={event => dispatch(updateDetails(event.currentTarget.value))}/>

        <button id="reset" type="reset" disabled={readOnly} className="secondary ripple">Reset</button>
        {!editing && <button id="submit" type="submit" disabled={readOnly} className="primary ripple">Add</button>}
        {editing && <Link id="cancel" to={`${Paths.users}?email=${userInfo.user.email}&mode=view`}
                          className="button secondary ripple"
                          onClick={reset}>Cancel</Link>}
        {editing && <button id="submit" type="submit" className="primary ripple">Update</button>}
    </form>;
};