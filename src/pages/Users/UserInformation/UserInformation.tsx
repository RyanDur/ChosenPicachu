import {FC, useReducer} from 'react';
import {classNames} from '@components/class-names';
import {NewUser, User} from '@components/Users/UserInfo/user';
import {FancyInput} from '@components/FancyFormElements/FancyInput';
import {FancyTextarea} from '@components/FancyFormElements/FancyTextarea';
import {
  avatarDrawn,
  dateOfBirthEdited,
  detailsEdited,
  emailEdited,
  firstNameEdited,
  formReset,
  homeAddressEdited,
  lastNameEdited,
  sameAsHomeChosen,
  workAddressEdited
} from './actions';
import {Address} from './Address';
import {avatarReport, draftOf, formReducer, userOf} from './reducer';
import {drawAvatar} from './avatars';
import {Link} from 'react-router';
import {FancyDateInput} from '@components/FancyFormElements/FancyDateInput';
import {isValid, parse} from 'date-fns';
import {Opened, userAt} from '../mode';
import {useUsersDispatch} from '../Provider';
import {userAdded, userUpdated} from '../store';
import './UserInformation.css';

const newUser = (): NewUser => ({
  info: {firstName: '', lastName: '', email: ''},
  friends: [],
  homeAddress: {city: '', state: '', streetAddress: '', zip: ''},
  avatar: drawAvatar()
});

const shown = (open: Opened): User | undefined => open.mode === 'adding' ? open.copying : open.user;

export const UserInformation: FC<{open?: Opened; className?: string}> = ({open = {mode: 'adding'}, className}) =>
  <Draft key={shown(open)?.id} open={open} className={className}/>;

const Draft: FC<{open: Opened; className?: string}> = ({open, className}) => {
  const users = useUsersDispatch();
  const [draft, dispatch] = useReducer(formReducer, shown(open), started => draftOf(started ?? newUser()));
  const user = userOf(draft);
  const readOnly = open.mode === 'viewing';
  const editing = open.mode === 'editing';

  const reset = () => dispatch(formReset(shown(open) ?? newUser()));

  return <form id="user-info-form"
    aria-labelledby="form-title"
    className={classNames('user-information', className)}
    onSubmit={event => {
      event.preventDefault();

      if (open.mode === 'editing') users(userUpdated({...open.user, ...user}));
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
        const born = parse(event.currentTarget.value, 'yyyy-MM-dd', new Date());
        dispatch(dateOfBirthEdited(isValid(born) ? born : undefined));
      }}>
      Date Of Birth
    </FancyDateInput>

    <button type="button" id="avatar-cell"
      aria-label="Draw a new avatar"
      className="avatar borderless rounded-corners accent raisable"
      disabled={readOnly}
      onClick={() => dispatch(avatarDrawn(drawAvatar()))}>
      <img id="avatar" src={user.avatar} width="244" height="244" fetchPriority="high" alt="avatar"/>
    </button>
    <output className="off-screen"
      aria-label="avatar report">{avatarReport(draft)}</output>

    <Address id="home-address" title="Home Address" className="home-address" value={user.homeAddress}
      readOnly={readOnly} required
      onChange={address => dispatch(homeAddressEdited(address))}/>

    <Address id="work-address" title="Work Address" className="work-address"
      value={draft.sameAsHome ? user.homeAddress : draft.typedWork} readOnly={readOnly}
      disabled={draft.sameAsHome}
      onChange={address => dispatch(workAddressEdited(address))}>
      {!readOnly && <label className="same-as-home attentive">
        <span>Same as Home</span>
        <input id="same-as-home" className="fancy-check raisable" type="checkbox" checked={draft.sameAsHome}
          onChange={event => dispatch(sameAsHomeChosen(event.currentTarget.checked))}/>
      </label>}
    </Address>

    <FancyTextarea value={user.details} readOnly={readOnly}
      onChange={event => dispatch(detailsEdited(event.currentTarget.value))}/>

    {!readOnly &&
        <button id="reset-form" type="reset" className="reset button secondary">Reset</button>}
    {open.mode === 'viewing' && <Link id="reset-form" to={userAt(open.user.id, 'edit')}
      className="reset button secondary">Edit</Link>}
    {!editing && !readOnly &&
        <button id="submit" type="submit" className="submit button primary">Add</button>}
    {open.mode === 'editing' && <Link id="cancel" to={userAt(open.user.id, 'view')}
      className="cancel button secondary" onClick={reset}>Cancel</Link>}
    {editing && <button id="submit" type="submit" className="submit button primary">Update</button>}

  </form>;
};
