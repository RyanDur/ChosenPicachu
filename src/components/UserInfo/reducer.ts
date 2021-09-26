import {FormAction, FormActions, User} from './types';
import {generateAvatar} from '../../avatars';

export const initialState: User = {
    info: {firstName: '', lastName: ''},
    friends: [],
    homeAddress: {
        city: '',
        state: '',
        streetAddress: '',
        zip: ''
    },
    avatar: generateAvatar()
};

export const formReducer = (state: User, action: FormAction): User => {
    switch (action.type) {
        case FormActions.UPDATE_FIRST_NAME:
            return {...state, info: {...state.info, firstName: action.firstName}};
        case FormActions.UPDATE_LAST_NAME:
            return {...state, info: {...state.info, lastName: action.lastName}};
        case FormActions.UPDATE_EMAIL:
            return {...state, info: {...state.info, email: action.email}};
        case FormActions.UPDATE_DATE_OF_BIRTH:
            return {...state, info: {...state.info, dob: action.dob}};
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
