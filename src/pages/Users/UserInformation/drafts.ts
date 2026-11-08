import {Address, NewUser, User} from '../profile';
import {maybe} from '@ryandur/sand';
import {DraftAction} from './draftActions';

type Without<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

export type Draft = {
  user: Without<NewUser | User, 'work'>;
  sameAsHome: boolean;
  typedWork?: Address;
  avatarsDrawn: number;
};

type Drafts = {
  of: (user: NewUser | User) => Draft;
  userIn: (draft: Draft) => NewUser | User;
  avatarReport: (draft: Draft) => string;
  reduce: (draft: Draft, action: DraftAction) => Draft;
};

const of = ({work, ...user}: NewUser | User): Draft => ({
  user,
  sameAsHome: work === 'home',
  ...(work === 'home' ? {} : maybe(work).map(typedWork => ({typedWork})).orElse({})),
  avatarsDrawn: 0
});

const edited = (draft: Draft, user: Draft['user']): Draft => ({...draft, user});

const reduce = (draft: Draft, action: DraftAction): Draft => {
  const {user} = draft;
  switch (action.type) {
    case 'firstNameEdited':
      return edited(draft, {...user, person: {...user.person, firstName: action.firstName}});
    case 'lastNameEdited':
      return edited(draft, {...user, person: {...user.person, lastName: action.lastName}});
    case 'emailEdited':
      return edited(draft, {...user, person: {...user.person, email: action.email}});
    case 'dateOfBirthEdited':
      return edited(draft, {...user, person: {...user.person, dateOfBirth: action.dateOfBirth}});
    case 'homeAddressEdited':
      return edited(draft, {...user, homeAddress: action.homeAddress});
    case 'workAddressEdited':
      return {...draft, typedWork: action.workAddress};
    case 'detailsEdited':
      return edited(draft, {...user, details: action.details});
    case 'avatarDrawn':
      return {...draft, user: {...user, avatar: action.avatar}, avatarsDrawn: draft.avatarsDrawn + 1};
    case 'sameAsHomeChosen':
      return {...draft, sameAsHome: action.sameAsHome};
    case 'formReset':
      return of(action.user);
  }
};

export const drafts: Drafts = {
  of,
  userIn: ({user, sameAsHome, typedWork}) => ({...user, work: sameAsHome ? 'home' : typedWork}),
  avatarReport: ({avatarsDrawn}) =>
    avatarsDrawn === 0 ? '' : `${avatarsDrawn} new avatar${avatarsDrawn === 1 ? '' : 's'} drawn.`,
  reduce
};
