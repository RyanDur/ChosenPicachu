import {AddressInfo, NewUser, User} from '@components/Users/UserInfo/user';

export enum FormActions {
  FIRST_NAME_EDITED = 'FIRST_NAME_EDITED',
  LAST_NAME_EDITED = 'LAST_NAME_EDITED',
  EMAIL_EDITED = 'EMAIL_EDITED',
  DATE_OF_BIRTH_EDITED = 'DATE_OF_BIRTH_EDITED',
  HOME_ADDRESS_EDITED = 'HOME_ADDRESS_EDITED',
  WORK_ADDRESS_EDITED = 'WORK_ADDRESS_EDITED',
  DETAILS_EDITED = 'DETAILS_EDITED',
  AVATAR_DRAWN = 'AVATAR_DRAWN',
  SAME_AS_HOME_CHOSEN = 'SAME_AS_HOME_CHOSEN',
  FORM_RESET = 'FORM_RESET'
}

type Action<T> = {
  type: T;
}

export type FirstNameEdited = Action<FormActions.FIRST_NAME_EDITED> & {
  firstName: string;
}
export type LastNameEdited = Action<FormActions.LAST_NAME_EDITED> & {
  lastName: string;
}
export type EmailEdited = Action<FormActions.EMAIL_EDITED> & {
  email: string;
}
export type DateOfBirthEdited = Action<FormActions.DATE_OF_BIRTH_EDITED> & {
  dob?: Date;
}
export type HomeAddressEdited = Action<FormActions.HOME_ADDRESS_EDITED> & {
  homeAddress: AddressInfo;
}
export type WorkAddressEdited = Action<FormActions.WORK_ADDRESS_EDITED> & {
  workAddress: AddressInfo;
}
export type DetailsEdited = Action<FormActions.DETAILS_EDITED> & {
  details: string;
}
export type AvatarDrawn = Action<FormActions.AVATAR_DRAWN> & {
  avatar: string;
}
export type SameAsHomeChosen = Action<FormActions.SAME_AS_HOME_CHOSEN> & {
  sameAsHome: boolean;
}
export type FormReset = Action<FormActions.FORM_RESET> & {
  user: NewUser | User;
}

export type FormAction =
  | FirstNameEdited
  | LastNameEdited
  | EmailEdited
  | DateOfBirthEdited
  | HomeAddressEdited
  | WorkAddressEdited
  | DetailsEdited
  | AvatarDrawn
  | SameAsHomeChosen
  | FormReset;

export const firstNameEdited = (firstName: string): FirstNameEdited => ({
  type: FormActions.FIRST_NAME_EDITED,
  firstName
});
export const lastNameEdited = (lastName: string): LastNameEdited => ({type: FormActions.LAST_NAME_EDITED, lastName});
export const emailEdited = (email: string): EmailEdited => ({type: FormActions.EMAIL_EDITED, email});
export const dateOfBirthEdited = (dob?: Date): DateOfBirthEdited => ({type: FormActions.DATE_OF_BIRTH_EDITED, dob});
export const homeAddressEdited = (homeAddress: AddressInfo): HomeAddressEdited => ({
  type: FormActions.HOME_ADDRESS_EDITED,
  homeAddress
});
export const workAddressEdited = (workAddress: AddressInfo): WorkAddressEdited => ({
  type: FormActions.WORK_ADDRESS_EDITED,
  workAddress
});
export const detailsEdited = (details: string): DetailsEdited => ({type: FormActions.DETAILS_EDITED, details});
export const avatarDrawn = (avatar: string): AvatarDrawn => ({type: FormActions.AVATAR_DRAWN, avatar});
export const sameAsHomeChosen = (sameAsHome: boolean): SameAsHomeChosen => ({
  type: FormActions.SAME_AS_HOME_CHOSEN,
  sameAsHome
});
export const formReset = (user: NewUser | User): FormReset => ({type: FormActions.FORM_RESET, user});
