import {
  AddressInfo,
  FormActions,
  FormReset,
  SameAsHomeChosen,
  AvatarGenerated,
  DetailsEdited,
  DateOfBirthEdited,
  EmailEdited,
  FirstNameEdited,
  HomeAddressEdited,
  LastNameEdited,
  NewUser,
  WorkAddressEdited, User
} from '@components/Users/UserInfo/types';

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
export const avatarGenerated = (avatar: string): AvatarGenerated => ({type: FormActions.AVATAR_GENERATED, avatar});
export const sameAsHomeChosen = (sameAsHome: boolean): SameAsHomeChosen => ({
  type: FormActions.SAME_AS_HOME_CHOSEN,
  sameAsHome
});
export const formReset = (user: NewUser | User): FormReset => ({type: FormActions.FORM_RESET, user});
