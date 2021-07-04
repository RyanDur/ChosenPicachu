import React, {FC, FormEvent, useEffect, useReducer, useState} from 'react';
import {Consumer, UserInfo} from './types';
import {FancyTextInput} from './FancyTextInput';
import {joinClassNames} from '../util';
import {FancyTextarea} from './FancyTextarea';
import {
    resetForm,
    updateDetails,
    updateFirstName,
    updateHomeAddress,
    updateLastName,
    updateWorkAddress
} from './actions';
import {Address} from './Address';
import {formReducer, initialState} from './reducer';
import './Form.layout.css';
import './Form.css';

interface FormProps {
    onSubmit?: Consumer<UserInfo>;
}

export const UserInformation: FC<FormProps> = ({onSubmit}) => {
    const [userInfo, dispatch] = useReducer(formReducer, initialState);
    const [sameAsHome, updateSameAsHome] = useState(false);
    const [isInvalid, updateValidity] = useState(false);

    useEffect(() => {
        if (sameAsHome) dispatch(updateWorkAddress(userInfo.homeAddress));
    }, [sameAsHome, userInfo.homeAddress]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit?.(userInfo);
        reset();
    };

    const reset = () => {
        dispatch(resetForm());
        updateSameAsHome(false);
        updateValidity(false);
    };

    return <section id="user-info-page" className="card overhang gutter">
        <h2 className="title">User Information</h2>
        <form id="user-info"
              className={joinClassNames(isInvalid && 'invalid')}
              onSubmit={handleSubmit}
              onReset={reset}
              onInvalid={() => updateValidity(true)}>
            <h3 id="name-title">User</h3>
            <FancyTextInput id="first-name-cell" inputId="first-name" required={true}
                            value={userInfo.user.firstName}
                            onChange={event => dispatch(updateFirstName(event.currentTarget.value))}>
                First Name
            </FancyTextInput>
            <FancyTextInput id="last-name-cell" inputId="last-name" required={true}
                            value={userInfo.user.lastName}
                            onChange={event => dispatch(updateLastName(event.currentTarget.value))}>
                Last Name
            </FancyTextInput>

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
        </form>
    </section>;
};