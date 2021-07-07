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

interface FormProps {
    currentUserInfo?: UserInfo;
    onAdd?: Consumer<UserInfo>;
    readOnly?: boolean;
}

/*
* using the key to force a rerender of component to make sure the default value is set on reset or when the value is ''
* feels a bit hacky but is a workaround for now. Need to reevaluate later if performance becomes a concern
* https://medium.com/@albertogasparin/forcing-state-reset-on-a-react-component-by-using-the-key-prop-14b36cd7448e
* */
export const UserInformation: FC<FormProps> = ({onAdd, readOnly, currentUserInfo = initialState}) => {
    const [userInfo, dispatch] = useReducer(formReducer, initialState, () => currentUserInfo);
    const [sameAsHome, updateSameAsHome] = useState(false);
    const [isInvalid, updateValidity] = useState(false);
    const [resetFormKey, triggerFormReset] = useState(nanoid());

    useEffect(() => {
        if (sameAsHome) dispatch(updateWorkAddress(userInfo.homeAddress));
    }, [sameAsHome, userInfo.homeAddress]);

    const reset = () => {
        dispatch(resetForm());
        updateSameAsHome(false);
        updateValidity(false);
    };

    return <form id="user-info-form"
                 key={resetFormKey}
                 data-testid="user-info-form"
                 className={joinClassNames(isInvalid && 'invalid')}
                 onSubmit={event => {
                     event.preventDefault();
                     onAdd?.(userInfo);
                     reset();
                     triggerFormReset(nanoid());
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

        <article tabIndex={0} id="avatar-cell" className="card"
                 onKeyPress={event => {
                     event.preventDefault();
                     if (!readOnly && event.code === 'Space') dispatch(updateAvatar(generateAvatar()));
                 }}
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
        <article id="same-as-home-cell" className="center-horizontal">
            <label htmlFor="same-as-home">Same as Home</label>
            <input id="same-as-home" type="checkbox" checked={sameAsHome} readOnly={readOnly}
                   onChange={event => updateSameAsHome(event.currentTarget.checked)}/>
        </article>
        <Address disabled={sameAsHome} kind="work" value={userInfo.workAddress} readOnly={readOnly}
                 onChange={address => dispatch(updateWorkAddress(address))}/>

        <FancyTextarea value={userInfo.details} readOnly={readOnly}
                       onChange={event => dispatch(updateDetails(event.currentTarget.value))}/>

        <button id="reset" type="reset" className="secondary ripple">Reset</button>
        <button id="submit" type="submit" className="primary ripple">Add</button>
    </form>;
};