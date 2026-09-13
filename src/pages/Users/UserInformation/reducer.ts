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
    case FormActions.FIRST_NAME_EDITED:
      return edited(draft, {...user, info: {...user.info, firstName: action.firstName}});
    case FormActions.LAST_NAME_EDITED:
      return edited(draft, {...user, info: {...user.info, lastName: action.lastName}});
    case FormActions.EMAIL_EDITED:
      return edited(draft, {...user, info: {...user.info, email: action.email}});
    case FormActions.DATE_OF_BIRTH_EDITED:
      return edited(draft, {...user, info: {...user.info, dob: action.dob}});
    case FormActions.HOME_ADDRESS_EDITED:
      return edited(draft, {...user, homeAddress: action.homeAddress});
    case FormActions.WORK_ADDRESS_EDITED:
      return edited(draft, {...user, workAddress: action.workAddress});
    case FormActions.DETAILS_EDITED:
      return edited(draft, {...user, details: action.details});
    case FormActions.AVATAR_GENERATED:
      return edited(draft, {...user, avatar: action.avatar});
    case FormActions.SAME_AS_HOME_CHOSEN:
      return {...draft, sameAsHome: action.sameAsHome};
    case FormActions.FORM_RESET:
      return draftOf(action.userInfo || initialState);
  }
  return draft;
};
