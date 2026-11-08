import {maybe} from '@ryandur/sand';
import {User} from '../profile';

type FriendFocus = {
  removalId: (userId: string, friendId: string) => string;
  additionId: (userId: string) => string;
  afterRemoval: (userId: string, friends: readonly User[], at: number) => string;
  afterAddition: (userId: string, candidatesLeft: readonly User[], friendId: string) => string;
};

const removalId = (userId: string, friendId: string): string => `remove-${userId}-${friendId}`;

const additionId = (userId: string): string => `add-friend-${userId}`;

export const friendFocus: FriendFocus = {
  removalId,
  additionId,
  afterRemoval: (userId, friends, at) => maybe(friends[at]).or(() => maybe(friends[at - 1]))
    .map(next => removalId(userId, next.id))
    .orElse(additionId(userId)),
  afterAddition: (userId, candidatesLeft, friendId) =>
    candidatesLeft.length === 0 ? removalId(userId, friendId) : additionId(userId)
};
