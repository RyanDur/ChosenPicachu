import {AddressInfo, NewUser, User} from '@components/Users/UserInfo/user';
import {maybe} from '@ryandur/sand';
import {FormAction, FormActions} from './actions';

type Without<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

export type Draft = {
  user: Without<NewUser | User, 'work'>;
  sameAsHome: boolean;
  typedWork?: AddressInfo;
  avatarsDrawn: number;
};

export const draftOf = ({work, ...user}: NewUser | User): Draft => ({
  user,
  sameAsHome: work === 'home',
  ...(work === 'home' ? {} : maybe(work).map(typedWork => ({typedWork})).orElse({})),
  avatarsDrawn: 0
});

export const userOf = ({user, sameAsHome, typedWork}: Draft): NewUser | User =>
  ({...user, work: sameAsHome ? 'home' : typedWork});

export const avatarReport = ({avatarsDrawn}: Draft): string =>
  avatarsDrawn === 0 ? '' : `${avatarsDrawn} new avatar${avatarsDrawn === 1 ? '' : 's'} drawn.`;

const edited = (draft: Draft, user: Draft['user']): Draft => ({...draft, user});

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
      return {...draft, typedWork: action.workAddress};
    case FormActions.DETAILS_EDITED:
      return edited(draft, {...user, details: action.details});
    case FormActions.AVATAR_DRAWN:
      return {...draft, user: {...user, avatar: action.avatar}, avatarsDrawn: draft.avatarsDrawn + 1};
    case FormActions.SAME_AS_HOME_CHOSEN:
      return {...draft, sameAsHome: action.sameAsHome};
    case FormActions.FORM_RESET:
      return draftOf(action.user);
  }
  return draft;
};
