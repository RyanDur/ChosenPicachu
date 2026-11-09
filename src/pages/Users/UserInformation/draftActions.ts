import {Address, NewUser, User} from '../profile';

export type AddressName = 'home' | 'work';

export type DraftAction =
  | {readonly type: 'firstNameEdited'; readonly firstName: string}
  | {readonly type: 'lastNameEdited'; readonly lastName: string}
  | {readonly type: 'emailEdited'; readonly email: string}
  | {readonly type: 'dateOfBirthEdited'; readonly dateOfBirth?: Date}
  | {readonly type: 'addressEdited'; readonly name: AddressName; readonly address: Address}
  | {readonly type: 'detailsEdited'; readonly details: string}
  | {readonly type: 'avatarDrawn'; readonly avatar: string}
  | {readonly type: 'sameAsHomeChosen'; readonly sameAsHome: boolean}
  | {readonly type: 'addSent'; readonly confirmedAdds: number}
  | {readonly type: 'formReset'; readonly user: NewUser | User};

type DraftActions = {
  firstNameEdited: (firstName: string) => DraftAction;
  lastNameEdited: (lastName: string) => DraftAction;
  emailEdited: (email: string) => DraftAction;
  dateOfBirthEdited: (dateOfBirth?: Date) => DraftAction;
  addressEdited: (name: AddressName, address: Address) => DraftAction;
  detailsEdited: (details: string) => DraftAction;
  avatarDrawn: (avatar: string) => DraftAction;
  sameAsHomeChosen: (sameAsHome: boolean) => DraftAction;
  addSent: (confirmedAdds: number) => DraftAction;
  formReset: (user: NewUser | User) => DraftAction;
};

export const draftActions: DraftActions = {
  firstNameEdited: firstName => ({type: 'firstNameEdited', firstName}),
  lastNameEdited: lastName => ({type: 'lastNameEdited', lastName}),
  emailEdited: email => ({type: 'emailEdited', email}),
  dateOfBirthEdited: dateOfBirth => ({type: 'dateOfBirthEdited', dateOfBirth}),
  addressEdited: (name, address) => ({type: 'addressEdited', name, address}),
  detailsEdited: details => ({type: 'detailsEdited', details}),
  avatarDrawn: avatar => ({type: 'avatarDrawn', avatar}),
  sameAsHomeChosen: sameAsHome => ({type: 'sameAsHomeChosen', sameAsHome}),
  addSent: confirmedAdds => ({type: 'addSent', confirmedAdds}),
  formReset: user => ({type: 'formReset', user})
};
