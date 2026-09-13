import {has} from '@ryandur/sand';
import {UsersAPI} from '@components/Users/resource/usersApi';
import {HTTPError} from '@transport/types';
import {UsersListener, userWithId, usersArrived} from './store';

export const syncing = (users: UsersAPI, saved: () => void, refused: (error: HTTPError) => void): UsersListener => (_previous, current, dispatch, action) => {
  switch (action.type) {
    case 'opened':
      users.getAll().onSuccess(arrived => dispatch(usersArrived(arrived))).onFailure(refused);
      return;
    case 'userAdded':
      users.add(action.user).onSuccess(arrived => dispatch(usersArrived(arrived))).onFailure(refused);
      return;
    case 'userUpdated': {
      const known = userWithId(action.edit.id)(current());
      if (has(known)) {
        users.update({...known, ...action.edit})
          .onSuccess(arrived => dispatch(usersArrived(arrived)))
          .onSuccess(saved)
          .onFailure(refused);
      }
      return;
    }
    case 'userRemoved':
      users.delete(action.user)
        .onSuccess(arrived => dispatch(usersArrived(arrived)))
        .onSuccess(saved)
        .onFailure(refused);
      return;
    case 'friendsChanged':
      users.update({...action.user, friends: [...action.friends]}).onSuccess(arrived => dispatch(usersArrived(arrived))).onFailure(refused);
      return;
    default:
      return;
  }
};
