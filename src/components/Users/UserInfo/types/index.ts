export type AddressInfo = {
  streetAddress: string;
  streetAddressTwo?: string;
  city: string;
  state: string;
  zip: string;
}

export type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  dob?: Date;
}

export type NewUser = {
  info: UserInfo;
  friends: string[];
  homeAddress: AddressInfo;
  avatar: string;
  workAddress?: AddressInfo;
  details?: string;
}

export type User = {
  id: string;
} & NewUser

export type UserEdit = Omit<User, 'friends'>;

export const isPersisted = (user: NewUser | User): user is User => 'id' in user;

export enum FormActions {
  FIRST_NAME_EDITED = 'FIRST_NAME_EDITED',
  LAST_NAME_EDITED = 'LAST_NAME_EDITED',
  EMAIL_EDITED = 'EMAIL_EDITED',
  DATE_OF_BIRTH_EDITED = 'DATE_OF_BIRTH_EDITED',
  HOME_ADDRESS_EDITED = 'HOME_ADDRESS_EDITED',
  WORK_ADDRESS_EDITED = 'WORK_ADDRESS_EDITED',
  DETAILS_EDITED = 'DETAILS_EDITED',
  AVATAR_GENERATED = 'AVATAR_GENERATED',
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
  dob: Date;
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
export type AvatarGenerated = Action<FormActions.AVATAR_GENERATED> & {
  avatar: string;
}
export type SameAsHomeChosen = Action<FormActions.SAME_AS_HOME_CHOSEN> & {
  sameAsHome: boolean;
}
export type FormReset = Action<FormActions.FORM_RESET> & {
  userInfo?: NewUser | User;
}

export type FormAction =
  | FirstNameEdited
  | LastNameEdited
  | EmailEdited
  | DateOfBirthEdited
  | HomeAddressEdited
  | WorkAddressEdited
  | DetailsEdited
  | AvatarGenerated
  | SameAsHomeChosen
  | FormReset;
