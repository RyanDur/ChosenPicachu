import {User} from '@components/Users/UserInfo/user';
import {maybe} from '@ryandur/sand';

export const removeButtonId = (userId: string, friendId: string): string => `remove-${userId}-${friendId}`;

export const addFriendId = (userId: string): string => `add-friend-${userId}`;

export const placeAfterRemoval = (userId: string, friends: readonly User[], at: number): string =>
  maybe(friends[at]).or(() => maybe(friends[at - 1]))
    .map(next => removeButtonId(userId, next.id))
    .orElse(addFriendId(userId));

export const placeAfterAddition = (userId: string, candidatesLeft: readonly User[], friendId: string): string =>
  candidatesLeft.length === 0 ? removeButtonId(userId, friendId) : addFriendId(userId);
