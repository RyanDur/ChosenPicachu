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
import {generateAvatar} from '../../avatars';
import {nanoid} from 'nanoid';
import './Form.layout.css';
import './Form.css';
import {Link} from 'react-router-dom';
import {Paths} from '../../App';

interface FormProps {
    currentUserInfo?: UserInfo;
    onAdd?: Consumer<UserInfo>;
    onUpdate?: Consumer<UserInfo>;
    readOnly?: boolean;
    editing?: boolean;
}

/*
* using the key to force a rerender of component to make sure the default value is set on reset or when the value is ''
* feels a bit hacky but is a workaround for now. Need to reevaluate later if performance becomes a concern
* https://medium.com/@albertogasparin/forcing-state-reset-on-a-react-component-by-using-the-key-prop-14b36cd7448e
* */
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
    const [isInvalid, updateValidity] = useState(false);
    const [resetFormKey, triggerFormReset] = useState(nanoid());

    useEffect(() => {
        if (sameAsHome) dispatch(updateWorkAddress(userInfo.homeAddress));
    }, [sameAsHome, userInfo.homeAddress]);

    const reset = () => {
        if (editing) dispatch(resetForm(currentUserInfo));
        else dispatch(resetForm());
        updateSameAsHome(false);
        updateValidity(false);
    };

    const handleUpdate = () => {
        onUpdate?.(userInfo);
        reset();
        triggerFormReset(nanoid());
    };

    return <form id="user-info-form"
                 key={resetFormKey}
                 data-testid="user-info-form"
                 className={joinClassNames(
                     isInvalid && 'invalid',
                     readOnly && 'read-only'
                 )}
                 onSubmit={event => {
                     event.preventDefault();
                     onAdd?.(userInfo);
                     reset();
                 }}
                 onReset={reset}
                 onInvalid={() => updateValidity(true)}>
        <h3 id="name-title">User</h3>
        <FancyInput id="first-name-cell" inputId="first-name" required={true}
                    value={userInfo.user.firstName} readOnly={readOnly}
                    onChange={event => dispatch(updateFirstName(event.currentTarget.value))}>
            First Name
        </FancyInput>
        <FancyInput id="last-name-cell" inputId="last-name" required={true}
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
                 className={joinClassNames('card', readOnly && 'read-only')}
                 data-testid="avatar-cell"
                 onKeyPress={event => event.preventDefault()}
                 onClick={() => {
                     if (!readOnly) {
                         dispatch(updateAvatar(generateAvatar()));
                     }
                 }}>
            <img id="avatar" src={userInfo.avatar} alt="avatar"/>
        </article>

        <h3 id="home-address-title">Home Address</h3>
        <Address required={true} kind="home" value={userInfo.homeAddress} readOnly={readOnly}
                 onChange={address => dispatch(updateHomeAddress(address))}/>

        <h3 id="work-address-title">Work Address</h3>
        <article id="same-as-home-cell"
                 className={joinClassNames('center-horizontal', readOnly && 'read-only')}>
            <label htmlFor="same-as-home">Same as Home</label>
            <input id="same-as-home" type="checkbox" checked={sameAsHome} disabled={readOnly}
                   onChange={event => updateSameAsHome(event.currentTarget.checked)}/>
        </article>
        <Address disabled={sameAsHome} kind="work" value={userInfo.workAddress} readOnly={readOnly}
                 onChange={address => dispatch(updateWorkAddress(address))}/>

        <FancyTextarea value={userInfo.details} readOnly={readOnly}
                       onChange={event => dispatch(updateDetails(event.currentTarget.value))}/>

        <button id="reset" type="reset" disabled={readOnly} className="secondary ripple">Reset</button>
        {!editing && <button id="submit" type="submit" disabled={readOnly} className="primary ripple">Add</button>}
        {editing && <Link id="cancel" to={`${Paths.users}?user=${userInfo.user.email}&mode=view`}
                          className="button secondary ripple"
                          onClick={reset}>Cancel</Link>}
        {editing && <Link to={Paths.users} id="submit" onClick={handleUpdate} className="button primary ripple">Update</Link>}
    </form>;
};