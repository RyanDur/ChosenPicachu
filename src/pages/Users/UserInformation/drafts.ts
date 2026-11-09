import {Address, NewUser, User} from '../profile';
import {maybe} from '@ryandur/sand';
import {AddressName, DraftAction} from './draftActions';

type Without<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

export type Draft = {
  user: Without<NewUser | User, 'work'>;
  sameAsHome: boolean;
  typedWork?: Address;
  avatarsDrawn: number;
  confirmedAddsWhenSent?: number;
};

type Drafts = {
  of: (user: NewUser | User) => Draft;
  userIn: (draft: Draft) => NewUser | User;
  newUser: (avatar: string) => NewUser;
  addressFor: (draft: Draft, name: AddressName) => Address;
  avatarReport: (draft: Draft) => string;
  sentAddConfirmed: (draft: Draft, confirmedAdds: number) => boolean;
  reduce: (draft: Draft, action: DraftAction) => Draft;
};

const unwritten: Address = {streetAddress: '', city: '', state: '', zip: ''};

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
    case 'addressEdited':
      return action.name === 'home'
        ? edited(draft, {...user, homeAddress: action.address})
        : {...draft, typedWork: action.address};
    case 'detailsEdited':
      return edited(draft, {...user, details: action.details});
    case 'avatarDrawn':
      return {...draft, user: {...user, avatar: action.avatar}, avatarsDrawn: draft.avatarsDrawn + 1};
    case 'sameAsHomeChosen':
      return {...draft, sameAsHome: action.sameAsHome};
    case 'addSent':
      return {...draft, confirmedAddsWhenSent: action.confirmedAdds};
    case 'formReset':
      return of(action.user);
  }
};

export const drafts: Drafts = {
  of,
  userIn: ({user, sameAsHome, typedWork}) => ({...user, work: sameAsHome ? 'home' : typedWork}),
  newUser: avatar => ({person: {firstName: '', lastName: '', email: ''}, friends: [], homeAddress: unwritten, avatar}),
  addressFor: ({user, sameAsHome, typedWork}, name) =>
    maybe(name === 'home' || sameAsHome ? user.homeAddress : typedWork).orElse(unwritten),
  avatarReport: ({avatarsDrawn}) =>
    avatarsDrawn === 0 ? '' : `${avatarsDrawn} new avatar${avatarsDrawn === 1 ? '' : 's'} drawn.`,
  sentAddConfirmed: ({confirmedAddsWhenSent}, confirmedAdds) =>
    maybe(confirmedAddsWhenSent).map(whenSent => whenSent !== confirmedAdds).orElse(false),
  reduce
};
