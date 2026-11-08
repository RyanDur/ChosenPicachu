import {UsersAPI} from './resource';
import {HTTPError} from '@transport';
import {profile} from '@pages/Users/profile';
import {UsersListener} from './usersStore';
import {usersActions} from './usersActions';
import {usersSelectors} from './usersSelectors';

export const syncing = (usersApi: UsersAPI, saved: () => void, refused: (error: HTTPError) => void): UsersListener =>
  (_previous, current, dispatch, action) => {
    switch (action.type) {
      case 'opened':
        usersApi.getAll().onSuccess(arrived => dispatch(usersActions.usersArrived(arrived))).onFailure(refused);
        return;
      case 'userAdded':
        usersApi.add(action.user).onSuccess(arrived => dispatch(usersActions.usersArrived(arrived))).onFailure(refused);
        return;
      case 'userUpdated':
        usersSelectors.withId(action.edit.id)(current()).map(known => usersApi.update({...known, ...action.edit})
          .onSuccess(arrived => dispatch(usersActions.usersArrived(arrived)))
          .onSuccess(saved)
          .onFailure(refused));
        return;
      case 'userRemoved':
        usersApi.delete(action.user)
          .onSuccess(arrived => dispatch(usersActions.usersArrived(arrived)))
          .onSuccess(saved)
          .onFailure(refused);
        return;
      case 'friendAdded':
        usersSelectors.withId(action.userId)(current())
          .map(known => usersApi.update(profile.befriended(known, action.friendId))
            .onSuccess(arrived => dispatch(usersActions.usersArrived(arrived)))
            .onFailure(refused));
        return;
      case 'friendRemoved':
        usersSelectors.withId(action.userId)(current())
          .map(known => usersApi.update(profile.unfriended(known, action.friendId))
            .onSuccess(arrived => dispatch(usersActions.usersArrived(arrived)))
            .onFailure(refused));
        return;
      default:
        return;
    }
  };
