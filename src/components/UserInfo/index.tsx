import {FC, useEffect, useReducer, useState} from 'react';
import {User} from './types';
import {FancyInput} from './FancyFormElements/FancyInput';
import {join} from '../util';
import {FancyTextarea} from './FancyFormElements/FancyTextarea';
import {
  resetForm,
  updateAvatar,
  updateDetails,
  updateDOB,
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
import {FancyDateInput} from './FancyFormElements/FancyDateInput';
import {toDate} from 'date-fns';
import {Consumer} from '@ryandur/sand';
import {Paths} from '../../routes/Paths';
import './Form.layout.css';
import './Form.css';

interface FormProps {
    currentUser?: User;
    onAdd?: Consumer<User>;
    onUpdate?: Consumer<User>;
    readOnly?: boolean;
    editing?: boolean;
}

export const UserInformation: FC<FormProps> = (
    {
        onAdd,
        onUpdate,
        readOnly = false,
        editing = false,
        currentUser = initialState
    }) => {
    const [user, dispatch] = useReducer(formReducer, currentUser, () => currentUser);
    const [sameAsHome, updateSameAsHome] = useState(false);

    useEffect(() => {
        if (sameAsHome) dispatch(updateWorkAddress(user.homeAddress));
    }, [sameAsHome, user.homeAddress]);

    const reset = () => {
        if (editing) dispatch(resetForm(currentUser));
        else dispatch(resetForm());
        updateSameAsHome(false);
    };

    return <form id="user-info-form"
                 data-testid="user-info-form"
                 className={join(readOnly && 'read-only')}
                 onSubmit={event => {
                     event.preventDefault();

                     if (editing) onUpdate?.(user);
                     else onAdd?.(user);

                     updateSameAsHome(false);
                     dispatch(resetForm());
                 }}
                 onReset={event => {
                     reset();
                     event.currentTarget.classList.remove('invalid');
                 }}
                 onInvalid={event => event.currentTarget.classList.add('invalid')}>
        <h3 id="name-title">User</h3>
        <FancyInput id="first-name-cell" inputId="first-name" required
                    value={user.info.firstName} readOnly={readOnly} autoFocus
                    onChange={event => dispatch(updateFirstName(event.currentTarget.value))}>
            First Name
        </FancyInput>
        <FancyInput id="last-name-cell" inputId="last-name" required
                    value={user.info.lastName} readOnly={readOnly}
                    onChange={event => dispatch(updateLastName(event.currentTarget.value))}>
            Last Name
        </FancyInput>
        <FancyInput id="email-cell" inputId="email" value={user.info.email}
                    type="email" readOnly={readOnly}
                    onChange={event => dispatch(updateEmail(event.currentTarget.value))}>
            Email
        </FancyInput>
        <FancyDateInput id="dob-cell" inputId="dob" value={user.info.dob}
                        readOnly={readOnly} required
                        onChange={event => {
                            dispatch(updateDOB(toDate(event.currentTarget.value)));
                        }}>
            Date Of Birth
        </FancyDateInput>

        <article tabIndex={0} id="avatar-cell"
                 className={join('card', readOnly && 'read-only')}
                 data-testid="avatar-cell"
                 onKeyDown={event => event.preventDefault()}
                 onClick={() => readOnly || dispatch(updateAvatar(generateAvatar()))}>
            <img id="avatar" src={user.avatar} loading="lazy" alt="avatar"/>
        </article>

        <h3 id="home-address-title">Home Address</h3>
        <Address id="home-address" value={user.homeAddress} readOnly={readOnly} required
                 onChange={address => dispatch(updateHomeAddress(address))}/>

        <h3 id="work-address-title">Work Address</h3>
        <article id="same-as-home-cell" className={join('center-horizontal', readOnly && 'read-only')}>
            <input id="same-as-home" type="checkbox" checked={sameAsHome} disabled={readOnly}
                   onChange={event => updateSameAsHome(event.currentTarget.checked)}/>
            <label id="same-as-home-title" htmlFor="same-as-home">Same as Home</label>
        </article>
        <Address id="work-address" value={user.workAddress} readOnly={readOnly} disabled={sameAsHome}
                 onChange={address => dispatch(updateWorkAddress(address))}/>

        <FancyTextarea value={user.details} readOnly={readOnly}
                       onChange={event => dispatch(updateDetails(event.currentTarget.value))}/>

        {!readOnly && <button id="reset-form" type="reset" disabled={readOnly} className="secondary">Reset</button>}
        {readOnly && <Link id="reset-form" to={`${Paths.users}?id=${user.id}&mode=edit`}
                           className="button secondary">Edit</Link>}
        {!editing && !readOnly &&
        <button id="submit" type="submit" disabled={readOnly} className="primary">Add</button>}
        {editing && <Link id="cancel" to={`${Paths.users}?id=${user.id}&mode=view`}
                          className="button secondary" onClick={reset}>Cancel</Link>}
        {editing && <button id="submit" type="submit" className="primary">Update</button>}

    </form>;
};
