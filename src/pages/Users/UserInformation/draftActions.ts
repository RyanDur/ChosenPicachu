import {AddressInfo, NewUser, User} from '@pages/Users/profile';

export type DraftAction =
  | {readonly type: 'firstNameEdited'; readonly firstName: string}
  | {readonly type: 'lastNameEdited'; readonly lastName: string}
  | {readonly type: 'emailEdited'; readonly email: string}
  | {readonly type: 'dateOfBirthEdited'; readonly dob?: Date}
  | {readonly type: 'homeAddressEdited'; readonly homeAddress: AddressInfo}
  | {readonly type: 'workAddressEdited'; readonly workAddress: AddressInfo}
  | {readonly type: 'detailsEdited'; readonly details: string}
  | {readonly type: 'avatarDrawn'; readonly avatar: string}
  | {readonly type: 'sameAsHomeChosen'; readonly sameAsHome: boolean}
  | {readonly type: 'formReset'; readonly user: NewUser | User};

type DraftActions = {
  firstNameEdited: (firstName: string) => DraftAction;
  lastNameEdited: (lastName: string) => DraftAction;
  emailEdited: (email: string) => DraftAction;
  dateOfBirthEdited: (dob?: Date) => DraftAction;
  homeAddressEdited: (homeAddress: AddressInfo) => DraftAction;
  workAddressEdited: (workAddress: AddressInfo) => DraftAction;
  detailsEdited: (details: string) => DraftAction;
  avatarDrawn: (avatar: string) => DraftAction;
  sameAsHomeChosen: (sameAsHome: boolean) => DraftAction;
  formReset: (user: NewUser | User) => DraftAction;
};

export const draftActions: DraftActions = {
  firstNameEdited: firstName => ({type: 'firstNameEdited', firstName}),
  lastNameEdited: lastName => ({type: 'lastNameEdited', lastName}),
  emailEdited: email => ({type: 'emailEdited', email}),
  dateOfBirthEdited: dob => ({type: 'dateOfBirthEdited', dob}),
  homeAddressEdited: homeAddress => ({type: 'homeAddressEdited', homeAddress}),
  workAddressEdited: workAddress => ({type: 'workAddressEdited', workAddress}),
  detailsEdited: details => ({type: 'detailsEdited', details}),
  avatarDrawn: avatar => ({type: 'avatarDrawn', avatar}),
  sameAsHomeChosen: sameAsHome => ({type: 'sameAsHomeChosen', sameAsHome}),
  formReset: user => ({type: 'formReset', user})
};
