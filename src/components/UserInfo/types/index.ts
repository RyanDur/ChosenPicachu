export interface AddressInfo {
    streetAddress: string;
    streetAddressTwo?: string;
    city: string;
    state: string;
    zip: string;
}

export interface UserInfo {
    firstName: string;
    lastName: string;
    email: string;
    id?: string;
    dob?: Date;
}

export interface User {
    info: UserInfo;
    friends: User[];
    homeAddress: AddressInfo;
    avatar: string;
    workAddress?: AddressInfo;
    details?: string;
}

export enum FormActions {
    UPDATE_FIRST_NAME = 'UPDATE_FIRST_NAME',
    UPDATE_LAST_NAME = 'UPDATE_LAST_NAME',
    UPDATE_EMAIL = 'UPDATE_EMAIL',
    UPDATE_DATE_OF_BIRTH = 'UPDATE_DATE_OF_BIRTH',
    UPDATE_HOME_ADDRESS = 'UPDATE_HOME_ADDRESS',
    UPDATE_WORK_ADDRESS = 'UPDATE_WORK_ADDRESS',
    UPDATE_DETAILS = 'UPDATED_DETAILS',
    UPDATE_AVATAR = 'UPDATED_AVATAR',
    RESET_FORM = 'RESET_FORM'
}

interface Action<T> {
    type: T;
}

export type UpdateFirstName = Action<FormActions.UPDATE_FIRST_NAME> & {
    firstName: string;
}
export type UpdateLastName = Action<FormActions.UPDATE_LAST_NAME> & {
    lastName: string;
}
export type UpdateEmail = Action<FormActions.UPDATE_EMAIL> & {
    email: string;
}
export type UpdateDob = Action<FormActions.UPDATE_DATE_OF_BIRTH> & {
    dob: Date;
}
export type UpdateHomeAddress = Action<FormActions.UPDATE_HOME_ADDRESS> & {
    homeAddress: AddressInfo;
}
export type UpdateWorkAddress = Action<FormActions.UPDATE_WORK_ADDRESS> & {
    workAddress: AddressInfo;
}
export type UpdateDetails = Action<FormActions.UPDATE_DETAILS> & {
    details: string;
}
export type UpdateAvatar = Action<FormActions.UPDATE_AVATAR> & {
    avatar: string;
}
export type ResetForm = Action<FormActions.RESET_FORM> & {
    userInfo?: User;
}

export type FormAction =
    | UpdateFirstName
    | UpdateLastName
    | UpdateEmail
    | UpdateDob
    | UpdateHomeAddress
    | UpdateWorkAddress
    | UpdateDetails
    | UpdateAvatar
    | ResetForm;
