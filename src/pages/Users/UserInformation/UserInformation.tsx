import {FC, useReducer} from 'react';
import {NewUser, User, isPersisted} from '@components/Users/UserInfo/types';
import {FancyInput} from '@components/FancyFormElements/FancyInput';
import {classNames} from '@components/class-names';
import {FancyTextarea} from '@components/FancyFormElements/FancyTextarea';
import {
  formReset,
  sameAsHomeChosen,
  avatarGenerated,
  detailsEdited,
  dateOfBirthEdited,
  emailEdited,
  firstNameEdited,
  homeAddressEdited,
  lastNameEdited,
  workAddressEdited
} from './actions';
import {Address} from './Address';
import {draftOf, formReducer, userOf} from './reducer';
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

const newUser = (): NewUser => ({
  info: {firstName: '', lastName: '', email: ''},
  friends: [],
  homeAddress: {city: '', state: '', streetAddress: '', zip: ''},
  avatar: generateAvatar()
});

export const UserInformation: FC<FormProps & { id?: string }> = ({id, readOnly = false, editing = false}) => {
  const currentUser = useUsersSelector(userWithId(id));
  return <Draft key={currentUser?.id} currentUser={currentUser} readOnly={readOnly} editing={editing}/>;
};

const Draft: FC<FormProps & { currentUser?: User }> = ({currentUser, readOnly = false, editing = false}) => {
  const users = useUsersDispatch();
  const [draft, dispatch] = useReducer(formReducer, currentUser, opened => draftOf(opened ?? newUser()));
  const user = userOf(draft);

  const reset = () => dispatch(formReset(currentUser ?? newUser()));

  return <form id="user-info-form"
               aria-labelledby="form-title"
               className={classNames('user-information', readOnly && 'read-only')}
               onSubmit={event => {
                 event.preventDefault();

                 if (editing && isPersisted(user)) users(userUpdated(user));
                 else users(userAdded(user));

                 reset();
               }}
               onReset={() => reset()}>
    <h2 id="form-title" className="form-title title bold">User Information</h2>
    <FancyInput id="first-name-cell" className="first-name" inputId="first-name" required
                value={user.info.firstName} readOnly={readOnly}
                onChange={event => dispatch(firstNameEdited(event.currentTarget.value))}>
      First Name
    </FancyInput>
    <FancyInput id="last-name-cell" className="last-name" inputId="last-name" required
                value={user.info.lastName} readOnly={readOnly}
                onChange={event => dispatch(lastNameEdited(event.currentTarget.value))}>
      Last Name
    </FancyInput>
    <FancyInput id="email-cell" className="email" inputId="email" value={user.info.email}
                type="email" readOnly={readOnly}
                onChange={event => dispatch(emailEdited(event.currentTarget.value))}>
      Email
    </FancyInput>
    <FancyDateInput id="dob-cell" className="dob" inputId="dob" value={user.info.dob}
                    readOnly={readOnly} required
                    onChange={event => {
                      dispatch(dateOfBirthEdited(parse(event.currentTarget.value, 'yyyy-MM-dd', new Date())));
                    }}>
      Date Of Birth
    </FancyDateInput>

    <button type="button" id="avatar-cell"
            aria-label="Generate a new avatar"
            className="avatar borderless rounded-corners accent raisable"
            disabled={readOnly}
            onClick={() => dispatch(avatarGenerated(generateAvatar()))}>
      <img id="avatar" src={user.avatar} width="244" height="244" fetchPriority="high" alt="avatar"/>
    </button>
    <output className="avatar-report off-screen"
            aria-label="avatar report">{draft.avatarDrawn ? 'A new avatar was drawn.' : ''}</output>

    <h3 id="home-address-title" className="home-address-title sub-title bold">Home Address</h3>
    <Address id="home-address" className="home-address" value={user.homeAddress} readOnly={readOnly} required
             onChange={address => dispatch(homeAddressEdited(address))}/>

    <h3 id="work-address-title" className="work-address-title sub-title bold">Work Address</h3>
    {!readOnly && <label id="same-as-home-cell" className="same-as-home attentive">
        <span id="same-as-home-title">Same as Home</span>
        <input id="same-as-home" className="fancy-check" type="checkbox" checked={draft.sameAsHome}
               onChange={event => dispatch(sameAsHomeChosen(event.currentTarget.checked))}/>
    </label>}
    <Address id="work-address" className="work-address" value={user.workAddress} readOnly={readOnly}
             disabled={draft.sameAsHome}
             onChange={address => dispatch(workAddressEdited(address))}/>

    <FancyTextarea value={user.details} readOnly={readOnly}
                   onChange={event => dispatch(detailsEdited(event.currentTarget.value))}/>

    {!readOnly &&
        <button id="reset-form" type="reset" className="reset button secondary">Reset</button>}
    {readOnly && isPersisted(user) && <Link id="reset-form" to={`${Paths.users}?id=${user.id}&mode=edit`}
                                            className="reset button secondary">Edit</Link>}
    {!editing && !readOnly &&
        <button id="submit" type="submit" className="submit button primary">Add</button>}
    {editing && isPersisted(user) && <Link id="cancel" to={`${Paths.users}?id=${user.id}&mode=view`}
                                           className="cancel button secondary" onClick={reset}>Cancel</Link>}
    {editing && <button id="submit" type="submit" className="submit button primary">Update</button>}

  </form>;
};
