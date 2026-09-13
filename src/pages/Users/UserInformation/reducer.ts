import {FormAction, FormActions, NewUser, User} from '@components/Users/UserInfo/types';
import {generateAvatar} from './avatars';

export const initialState: NewUser = {
    info: {firstName: '', lastName: '', email: ''},
    friends: [],
    homeAddress: {
        city: '',
        state: '',
        streetAddress: '',
        zip: ''
    },
    avatar: generateAvatar()
};

export type Draft = {
    user: NewUser | User;
    sameAsHome: boolean;
};

export const draftOf = (user: NewUser | User): Draft => ({user, sameAsHome: false});

export const userOf = ({user, sameAsHome}: Draft): NewUser | User =>
    sameAsHome ? {...user, workAddress: user.homeAddress} : user;

const edited = (draft: Draft, user: NewUser | User): Draft => ({...draft, user});

export const formReducer = (draft: Draft, action: FormAction): Draft => {
    const {user} = draft;
    switch (action.type) {
        case FormActions.UPDATE_FIRST_NAME:
            return edited(draft, {...user, info: {...user.info, firstName: action.firstName}});
        case FormActions.UPDATE_LAST_NAME:
            return edited(draft, {...user, info: {...user.info, lastName: action.lastName}});
        case FormActions.UPDATE_EMAIL:
            return edited(draft, {...user, info: {...user.info, email: action.email}});
        case FormActions.UPDATE_DATE_OF_BIRTH:
            return edited(draft, {...user, info: {...user.info, dob: action.dob}});
        case FormActions.UPDATE_HOME_ADDRESS:
            return edited(draft, {...user, homeAddress: action.homeAddress});
        case FormActions.UPDATE_WORK_ADDRESS:
            return edited(draft, {...user, workAddress: action.workAddress});
        case FormActions.UPDATE_DETAILS:
            return edited(draft, {...user, details: action.details});
        case FormActions.UPDATE_AVATAR:
            return edited(draft, {...user, avatar: action.avatar});
        case FormActions.SAME_AS_HOME_CHOSEN:
            return {...draft, sameAsHome: action.sameAsHome};
        case FormActions.RESET_FORM:
            return draftOf(action.userInfo || initialState);
    }
    return draft;
};
