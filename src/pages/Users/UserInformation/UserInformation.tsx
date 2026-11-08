import {FC, useReducer} from 'react';
import {classNames} from '@components/class-names';
import {NewUser, User} from '@pages/Users/profile';
import {FancyInput} from '../FancyFormElements/FancyInput';
import {FancyTextarea} from '../FancyFormElements/FancyTextarea';
import {draftActions} from './draftActions';
import {AddressFields} from './AddressFields';
import {drafts} from './drafts';
import {avatars} from './avatars';
import {Link} from 'react-router';
import {FancyDateInput} from '../FancyFormElements/FancyDateInput';
import {isValid, parse} from 'date-fns';
import {Maybe, maybe, not, some} from '@ryandur/sand';
import {Opened, openings} from '../openings';
import {useUsersDispatch} from '../useUsersDispatch';
import {usersActions} from '../usersActions';
import {useOpened} from '../useOpened';
import {useHydrated} from '@frame/state';
import './UserInformation.css';

const newUser = (avatar: string): NewUser => ({
  person: {firstName: '', lastName: '', email: ''},
  friends: [],
  homeAddress: {city: '', state: '', streetAddress: '', zip: ''},
  avatar
});

const shown = (open: Opened): Maybe<User> => open.mode === 'adding' ? maybe(open.copying) : some(open.user);

export const UserInformation: FC<{className?: string}> = ({className}) =>
  <Draft key={shown(useOpened()).map(({id}) => id).orNull()} className={className}/>;

const Draft: FC<{className?: string}> = ({className}) => {
  const open = useOpened();
  const users = useUsersDispatch();
  const hydrated = useHydrated();
  const [draft, dispatch] = useReducer(drafts.reduce, shown(open),
    started => drafts.of(started.either(user => user, () => newUser(avatars.first))));
  const user = drafts.userIn(draft);
  const readOnly = open.mode === 'viewing';
  const required = not(readOnly);
  const editing = open.mode === 'editing';

  const reset = () =>
    dispatch(draftActions.formReset(shown(open).either(user => user, () => newUser(avatars.drawn()))));

  return <form id="user-form"
    aria-labelledby="form-title"
    className={classNames('user-information', className)}
    onSubmit={event => {
      event.preventDefault();

      if (open.mode === 'editing') users(usersActions.userUpdated({...open.user, ...user}));
      else users(usersActions.userAdded(user));

      reset();
    }}
    onReset={() => reset()}>
    <h2 id="form-title" className="form-title title bold">User Information</h2>
    <FancyInput id="first-name-cell" className="first-name" inputId="first-name" required={required}
      value={user.person.firstName} readOnly={readOnly}
      onChange={event => dispatch(draftActions.firstNameEdited(event.currentTarget.value))}>
      First Name
    </FancyInput>
    <FancyInput id="last-name-cell" className="last-name" inputId="last-name" required={required}
      value={user.person.lastName} readOnly={readOnly}
      onChange={event => dispatch(draftActions.lastNameEdited(event.currentTarget.value))}>
      Last Name
    </FancyInput>
    <FancyInput id="email-cell" className="email" inputId="email" value={user.person.email}
      type="email" readOnly={readOnly}
      onChange={event => dispatch(draftActions.emailEdited(event.currentTarget.value))}>
      Email
    </FancyInput>
    <FancyDateInput id="date-of-birth-cell" className="date-of-birth" inputId="date-of-birth" value={user.person.dateOfBirth}
      readOnly={readOnly} required={required}
      onChange={event => {
        const born = parse(event.currentTarget.value, 'yyyy-MM-dd', new Date());
        dispatch(draftActions.dateOfBirthEdited(isValid(born) ? born : undefined));
      }}>
      Date Of Birth
    </FancyDateInput>

    <button type="button" id="avatar-cell"
      aria-label="Draw a new avatar"
      className="avatar borderless rounded-corners accent raisable"
      disabled={readOnly || !hydrated}
      onClick={() => dispatch(draftActions.avatarDrawn(avatars.drawn()))}>
      <img id="avatar" className="portrait" src={user.avatar} width="264" height="280" fetchPriority="high" alt="avatar"/>
    </button>
    <output className="off-screen"
      aria-label="avatar report">{drafts.avatarReport(draft)}</output>

    <AddressFields id="home-address" title="Home Address" className="home-address" value={user.homeAddress}
      readOnly={readOnly} required={required}
      onEdited={address => dispatch(draftActions.homeAddressEdited(address))}/>

    <AddressFields id="work-address" title="Work Address" className="work-address"
      value={draft.sameAsHome ? user.homeAddress : draft.typedWork} readOnly={readOnly}
      disabled={draft.sameAsHome}
      onEdited={address => dispatch(draftActions.workAddressEdited(address))}>
      {!readOnly && <label className="same-as-home paragraph pill-cornered attentive">
        <span>Same as Home</span>
        <input id="same-as-home" className="fancy-check raisable" type="checkbox" checked={draft.sameAsHome}
          onChange={event => dispatch(draftActions.sameAsHomeChosen(event.currentTarget.checked))}/>
      </label>}
    </AddressFields>

    <FancyTextarea className="details-cell" value={user.details} readOnly={readOnly}
      onChange={event => dispatch(draftActions.detailsEdited(event.currentTarget.value))}/>

    {!readOnly &&
        <button id="reset-form" type="reset" className="reset button secondary" disabled={!hydrated}>Reset</button>}
    {open.mode === 'viewing' && <Link id="reset-form" to={openings.at(open.user.id, 'edit')}
      className="reset button secondary">Edit</Link>}
    {!editing && !readOnly &&
        <button id="submit" type="submit" className="submit button primary" disabled={!hydrated}>Add</button>}
    {open.mode === 'editing' && <Link id="cancel" to={openings.at(open.user.id, 'view')}
      className="cancel button secondary" onClick={reset}>Cancel</Link>}
    {editing && <button id="submit" type="submit" className="submit button primary" disabled={!hydrated}>Update</button>}

  </form>;
};
