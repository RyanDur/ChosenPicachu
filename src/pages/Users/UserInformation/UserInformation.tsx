import {FC, useEffect, useReducer, useState} from 'react';
import {NewUser, User, isPersisted} from '@components/Users/UserInfo/types';
import {FancyInput} from '@components/FancyFormElements/FancyInput';
import {classNames} from '@components/class-names';
import {FancyTextarea} from '@components/FancyFormElements/FancyTextarea';
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
import {generateAvatar} from './avatars';
import {Link} from 'react-router';
import {FancyDateInput} from '@components/FancyFormElements/FancyDateInput';
import {parse} from 'date-fns';
import {Paths} from '@pages/Paths';
import {useUsersDispatch, useUsersSelector} from '../Provider';
import {userWithId} from '../store';
import {userAdded, userUpdated} from '../store';
import './Form.css';

type FormProps = {
    readOnly?: boolean;
    editing?: boolean;
}

export const UserInformation: FC<FormProps & {id?: string}> = ({id, readOnly = false, editing = false}) => {
    const currentUser = useUsersSelector(userWithId(id));
    return <Draft key={currentUser?.id} currentUser={currentUser ?? initialState} readOnly={readOnly} editing={editing}/>;
};

const Draft: FC<FormProps & {currentUser: NewUser | User}> = ({currentUser, readOnly = false, editing = false}) => {
    const users = useUsersDispatch();
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
                 aria-label="user info"
                 className={classNames('user-information', readOnly && 'read-only')}
                 onSubmit={event => {
                     event.preventDefault();

                     if (editing && isPersisted(user)) users(userUpdated(user));
                     else users(userAdded(user));

                     updateSameAsHome(false);
                     dispatch(resetForm());
                 }}
                 onReset={() => reset()}>
        <h2 id="form-title" className="form-title title bold">User Information</h2>
        <FancyInput id="first-name-cell" className="first-name" inputId="first-name" required
                    value={user.info.firstName} readOnly={readOnly}
                    onChange={event => dispatch(updateFirstName(event.currentTarget.value))}>
            First Name
        </FancyInput>
        <FancyInput id="last-name-cell" className="last-name" inputId="last-name" required
                    value={user.info.lastName} readOnly={readOnly}
                    onChange={event => dispatch(updateLastName(event.currentTarget.value))}>
            Last Name
        </FancyInput>
        <FancyInput id="email-cell" className="email" inputId="email" value={user.info.email}
                    type="email" readOnly={readOnly}
                    onChange={event => dispatch(updateEmail(event.currentTarget.value))}>
            Email
        </FancyInput>
        <FancyDateInput id="dob-cell" className="dob" inputId="dob" value={user.info.dob}
                        readOnly={readOnly} required
                        onChange={event => {
                            dispatch(updateDOB(parse(event.currentTarget.value, 'yyyy-MM-dd', new Date())));
                        }}>
            Date Of Birth
        </FancyDateInput>

        <button type="button" id="avatar-cell"
                aria-label="Generate a new avatar"
                className={classNames('avatar', 'borderless', 'rounded-corners', 'accent', 'raisable', readOnly && 'read-only')}
                disabled={readOnly}
                onClick={() => dispatch(updateAvatar(generateAvatar()))}>
            <img id="avatar" src={user.avatar} width="244" height="244" fetchPriority="high" alt="avatar"/>
        </button>

        <h3 id="home-address-title" className="home-address-title sub-title bold">Home Address</h3>
        <Address id="home-address" className="home-address" value={user.homeAddress} readOnly={readOnly} required
                 onChange={address => dispatch(updateHomeAddress(address))}/>

        <h3 id="work-address-title" className="work-address-title sub-title bold">Work Address</h3>
        <article id="same-as-home-cell" className={classNames('same-as-home', readOnly && 'read-only')}>
            <input id="same-as-home" className="fancy-check" type="checkbox" checked={sameAsHome} disabled={readOnly}
                   onChange={event => updateSameAsHome(event.currentTarget.checked)}/>
            <label id="same-as-home-title" htmlFor="same-as-home">Same as Home</label>
        </article>
        <Address id="work-address" className="work-address" value={user.workAddress} readOnly={readOnly} disabled={sameAsHome}
                 onChange={address => dispatch(updateWorkAddress(address))}/>

        <FancyTextarea value={user.details} readOnly={readOnly}
                       onChange={event => dispatch(updateDetails(event.currentTarget.value))}/>

        {!readOnly && <button id="reset-form" type="reset" disabled={readOnly} className="reset button secondary">Reset</button>}
        {readOnly && isPersisted(user) && <Link id="reset-form" to={`${Paths.users}?id=${user.id}&mode=edit`}
                           className="reset button secondary">Edit</Link>}
        {!editing && !readOnly &&
        <button id="submit" type="submit" disabled={readOnly} className="submit button primary">Add</button>}
        {editing && isPersisted(user) && <Link id="cancel" to={`${Paths.users}?id=${user.id}&mode=view`}
                          className="cancel button secondary" onClick={reset}>Cancel</Link>}
        {editing && <button id="submit" type="submit" className="submit button primary">Update</button>}

    </form>;
};
