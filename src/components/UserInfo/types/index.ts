interface Indexable {
    readonly [x: string]: string | undefined;
}

export interface AddressInfo extends Indexable {
    streetAddress: string;
    streetAddressTwo?: string;
    city: string;
    state: string;
    zip: string;
}

export interface User {
    firstName: string;
    lastName: string;
    email?: string;
    dob?: Date;
}

export interface UserInfo {
    user: User;
    homeAddress: AddressInfo;
    avatar: string;
    workAddress?: AddressInfo;
    details?: string;
}

export type Consumer<T> = (value: T) => void

export interface Action<T> {
    type: T
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
    userInfo?: UserInfo;
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
