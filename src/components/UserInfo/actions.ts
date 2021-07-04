import {
    AddressInfo,
    FormActions,
    ResetForm,
    UpdateDetails,
    UpdateEmail,
    UpdateFirstName,
    UpdateHomeAddress,
    UpdateLastName,
    UpdateWorkAddress
} from './types';

export const updateFirstName = (firstName: string): UpdateFirstName => ({
    type: FormActions.UPDATE_FIRST_NAME,
    firstName
});
export const updateLastName = (lastName: string): UpdateLastName => ({type: FormActions.UPDATE_LAST_NAME, lastName});
export const updateEmail = (email: string): UpdateEmail => ({type: FormActions.UPDATE_EMAIL, email});
export const updateHomeAddress = (homeAddress: AddressInfo): UpdateHomeAddress => ({
    type: FormActions.UPDATE_HOME_ADDRESS,
    homeAddress
});
export const updateWorkAddress = (workAddress: AddressInfo): UpdateWorkAddress => ({
    type: FormActions.UPDATE_WORK_ADDRESS,
    workAddress
});
export const updateDetails = (details: string): UpdateDetails => ({type: FormActions.UPDATE_DETAILS, details});
export const resetForm = (): ResetForm => ({type: FormActions.RESET_FORM});

