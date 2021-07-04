import {FormAction, FormActions, UserInfo} from './types';

export const initialState: UserInfo = {
    user: {firstName: '', lastName: ''},
    homeAddress: {
        city: '',
        state: '',
        streetAddress: '',
        zip: ''
    }
};

export const formReducer = (state: UserInfo, action: FormAction): UserInfo => {
    switch (action.type) {
        case FormActions.UPDATE_FIRST_NAME:
            return {...state, user: {...state.user, firstName: action.firstName}};
        case FormActions.UPDATE_LAST_NAME:
            return {...state, user: {...state.user, lastName: action.lastName}};
        case FormActions.UPDATE_HOME_ADDRESS:
            return {...state, homeAddress: action.homeAddress};
        case FormActions.UPDATE_WORK_ADDRESS:
            return {...state, workAddress: action.workAddress};
        case FormActions.UPDATE_DETAILS:
            return {...state, details: action.details};
        case FormActions.RESET_FORM:
            return initialState;
    }
    return state;
};
