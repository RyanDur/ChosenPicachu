import {UsersAPI} from './resource';
import {HTTPError} from '@transport/types';
import {profile} from '@pages/Users/profile';
import {UsersListener, userWithId, usersArrived} from './store';

export const syncing = (users: UsersAPI, saved: () => void, refused: (error: HTTPError) => void): UsersListener =>
  (_previous, current, dispatch, action) => {
    switch (action.type) {
      case 'opened':
        users.getAll().onSuccess(arrived => dispatch(usersArrived(arrived))).onFailure(refused);
        return;
      case 'userAdded':
        users.add(action.user).onSuccess(arrived => dispatch(usersArrived(arrived))).onFailure(refused);
        return;
      case 'userUpdated':
        userWithId(action.edit.id)(current()).map(known => users.update({...known, ...action.edit})
          .onSuccess(arrived => dispatch(usersArrived(arrived)))
          .onSuccess(saved)
          .onFailure(refused));
        return;
      case 'userRemoved':
        users.delete(action.user)
          .onSuccess(arrived => dispatch(usersArrived(arrived)))
          .onSuccess(saved)
          .onFailure(refused);
        return;
      case 'friendAdded':
        userWithId(action.userId)(current()).map(known => users.update(profile.befriended(known, action.friendId))
          .onSuccess(arrived => dispatch(usersArrived(arrived)))
          .onFailure(refused));
        return;
      case 'friendRemoved':
        userWithId(action.userId)(current()).map(known => users.update(profile.unfriended(known, action.friendId))
          .onSuccess(arrived => dispatch(usersArrived(arrived)))
          .onFailure(refused));
        return;
      default:
        return;
    }
  };
