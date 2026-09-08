import {has} from '@ryandur/sand';
import {UsersAPI} from '@components/Users/resource/usersApi';
import {UsersListener, userWithId, usersArrived} from './store';

export const syncing = (users: UsersAPI, saved: () => void): UsersListener => (_previous, current, dispatch, action) => {
  switch (action.type) {
    case 'opened':
      users.getAll().onSuccess(arrived => dispatch(usersArrived(arrived)));
      return;
    case 'userAdded':
      users.add(action.user).onSuccess(arrived => dispatch(usersArrived(arrived)));
      return;
    case 'userUpdated': {
      const known = userWithId(action.edit.id)(current());
      if (has(known)) {
        users.update({...known, ...action.edit})
          .onSuccess(arrived => dispatch(usersArrived(arrived)))
          .onSuccess(saved);
      }
      return;
    }
    case 'userRemoved':
      users.delete(action.user)
        .onSuccess(arrived => dispatch(usersArrived(arrived)))
        .onSuccess(saved);
      return;
    case 'friendsChanged':
      users.update({...action.user, friends: [...action.friends]}).onSuccess(arrived => dispatch(usersArrived(arrived)));
      return;
    default:
      return;
  }
};
