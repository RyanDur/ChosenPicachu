import {FC, useReducer, useState} from 'react';
import {FancyDateInput, FancyInput, FancyTextarea} from '../FancyFormElements';
import {classNames} from '@components';
import {NewUser, User} from '../profile';
import {draftActions} from './draftActions';
import {AddressFields} from './AddressFields';
import {drafts} from './drafts';
import {avatars} from './avatars';
import {Link} from 'react-router';
import {isValid, parse} from 'date-fns';
import {Maybe, maybe, not, nothing, some} from '@ryandur/sand';
import {Opened, openings} from '../openings';
import {useUsersDispatch} from '../useUsersDispatch';
import {usersActions} from '../usersActions';
import {useOpened} from '../useOpened';
import {useUsersSelector} from '../useUsersSelector';
import {usersSelectors} from '../usersSelectors';
import {useHydrated} from '@components';
import './UserInformation.css';

const newUser = (avatar: string): NewUser => ({
  person: {firstName: '', lastName: '', email: ''},
  friends: [],
  homeAddress: {city: '', state: '', streetAddress: '', zip: ''},
  avatar
});

const FormButtons: FC = () => {
  const open = useOpened();
  const hydrated = useHydrated();
  const addInFlight = useUsersSelector(usersSelectors.addInFlight);
  const resetButton = <button type="reset" className="reset button secondary" disabled={not(hydrated)}>Reset</button>;
  switch (open.mode) {
    case 'adding':
      return <>
        {resetButton}
        <button type="submit" className="submit button primary" disabled={not(hydrated)}
          aria-disabled={addInFlight}>Add</button>
      </>;
    case 'viewing':
      return <Link to={openings.at(open.user.id, 'edit')} className="edit button secondary">Edit</Link>;
    case 'editing':
      return <>
        {resetButton}
        <Link to={openings.at(open.user.id, 'view')} className="cancel button secondary">Cancel</Link>
        <button type="submit" className="submit button primary" disabled={not(hydrated)}>Update</button>
      </>;
  }
};

const shown = (open: Opened): Maybe<User> => open.mode === 'adding' ? maybe(open.copying) : some(open.user);

const draftKey = (open: Opened): string => `${open.mode}:${shown(open).map(({id}) => id).orElse('')}`;

export const UserInformation: FC<{className?: string}> = ({className}) =>
  <Draft key={draftKey(useOpened())} className={className}/>;

const Draft: FC<{className?: string}> = ({className}) => {
  const open = useOpened();
  const usersDispatch = useUsersDispatch();
  const hydrated = useHydrated();
  const confirmedAdds = useUsersSelector(usersSelectors.confirmedAdds);
  const addInFlight = useUsersSelector(usersSelectors.addInFlight);
  const [confirmedAddsWhenSent, setConfirmedAddsWhenSent] = useState<Maybe<number>>(nothing());
  const [draft, dispatch] = useReducer(drafts.reduce, shown(open),
    started => drafts.of(started.either(user => user, () => newUser(avatars.first))));
  const user = drafts.userIn(draft);
  const readOnly = open.mode === 'viewing';
  const required = not(readOnly);

  const reset = () =>
    dispatch(draftActions.formReset(shown(open).either(user => user, () => newUser(avatars.drawn()))));

  if (confirmedAddsWhenSent.map(whenSent => whenSent !== confirmedAdds).orElse(false)) {
    setConfirmedAddsWhenSent(nothing());
    reset();
  }

  return <form aria-labelledby="form-title"
    className={classNames('user-information', className)}
    onSubmit={event => {
      event.preventDefault();

      if (open.mode === 'editing') {
        usersDispatch(usersActions.userUpdated({...open.user, ...user}));
        return;
      }

      if (addInFlight) return;
      setConfirmedAddsWhenSent(some(confirmedAdds));
      usersDispatch(usersActions.userAdded(user));
    }}
    onReset={() => reset()}>
    <h2 id="form-title" className="form-title title bold">User Information</h2>
    <FancyInput className="first-name" required={required}
      value={user.person.firstName} readOnly={readOnly}
      onChange={event => dispatch(draftActions.firstNameEdited(event.currentTarget.value))}>
      First Name
    </FancyInput>
    <FancyInput className="last-name" required={required}
      value={user.person.lastName} readOnly={readOnly}
      onChange={event => dispatch(draftActions.lastNameEdited(event.currentTarget.value))}>
      Last Name
    </FancyInput>
    <FancyInput className="email" value={user.person.email}
      type="email" readOnly={readOnly}
      onChange={event => dispatch(draftActions.emailEdited(event.currentTarget.value))}>
      Email
    </FancyInput>
    <FancyDateInput className="date-of-birth" value={user.person.dateOfBirth}
      readOnly={readOnly} required={required}
      onChange={event => {
        const born = parse(event.currentTarget.value, 'yyyy-MM-dd', new Date());
        dispatch(draftActions.dateOfBirthEdited(isValid(born) ? born : undefined));
      }}>
      Date Of Birth
    </FancyDateInput>

    <button type="button"
      aria-label="Draw a new avatar"
      className="avatar borderless rounded-corners accent raisable"
      disabled={readOnly || not(hydrated)}
      onClick={() => dispatch(draftActions.avatarDrawn(avatars.drawn()))}>
      <img className="portrait" src={user.avatar} width="264" height="280" fetchPriority="high" alt="avatar"/>
    </button>
    <output className="off-screen"
      aria-label="avatar report">{drafts.avatarReport(draft)}</output>

    <AddressFields title="Home Address" className="home-address" value={user.homeAddress}
      readOnly={readOnly} required={required}
      onEdited={address => dispatch(draftActions.homeAddressEdited(address))}/>

    <AddressFields title="Work Address" className="work-address"
      value={draft.sameAsHome ? user.homeAddress : draft.typedWork} readOnly={readOnly}
      disabled={draft.sameAsHome}
      onEdited={address => dispatch(draftActions.workAddressEdited(address))}>
      {not(readOnly) && <label className="same-as-home paragraph pill-cornered attentive">
        <span>Same as Home</span>
        <input className="fancy-check raisable" type="checkbox" checked={draft.sameAsHome}
          onChange={event => dispatch(draftActions.sameAsHomeChosen(event.currentTarget.checked))}/>
      </label>}
    </AddressFields>

    <FancyTextarea className="details-cell" value={user.details} readOnly={readOnly}
      onChange={event => dispatch(draftActions.detailsEdited(event.currentTarget.value))}/>

    <FormButtons/>

  </form>;
};
