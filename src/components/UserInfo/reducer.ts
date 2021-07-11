import {FormAction, FormActions, UserInfo} from './types';
import {generateAvatar} from '../../avatars';

export const initialState: UserInfo = {
    user: {firstName: '', lastName: ''},
    homeAddress: {
        city: '',
        state: '',
        streetAddress: '',
        zip: ''
    },
    avatar: generateAvatar()
};

export const formReducer = (state: UserInfo, action: FormAction): UserInfo => {
    switch (action.type) {
        case FormActions.UPDATE_FIRST_NAME:
            return {...state, user: {...state.user, firstName: action.firstName}};
        case FormActions.UPDATE_LAST_NAME:
            return {...state, user: {...state.user, lastName: action.lastName}};
        case FormActions.UPDATE_EMAIL:
            return {...state, user: {...state.user, email: action.email}};
        case FormActions.UPDATE_DATE_OF_BIRTH:
            return {...state, user: {...state.user, dob: action.dob}};
        case FormActions.UPDATE_HOME_ADDRESS:
            return {...state, homeAddress: action.homeAddress};
        case FormActions.UPDATE_WORK_ADDRESS:
            return {...state, workAddress: action.workAddress};
        case FormActions.UPDATE_DETAILS:
            return {...state, details: action.details};
        case FormActions.UPDATE_AVATAR:
            return {...state, avatar: action.avatar};
        case FormActions.RESET_FORM:
            return action.userInfo || initialState;
    }
    return state;
};
