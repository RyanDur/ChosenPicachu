import {User} from '@components/Users/UserInfo/user';
import {maybe} from '@ryandur/sand';

export type Membership =
  | {readonly change: 'added'; readonly friend: User}
  | {readonly change: 'removed'; readonly friend: User; readonly at: number};

export const fullNameOf = ({info}: User): string => `${info.firstName} ${info.lastName}`;

export const friendsReport = ({change, friend}: Membership): string => `${fullNameOf(friend)} ${change}.`;

export const arrived = (friendIds: readonly string[], {change, friend}: Membership): boolean =>
  change === 'removed' ? !friendIds.includes(friend.id) : friendIds.includes(friend.id);

export const removeButtonId = (userId: string, friendId: string): string => `remove-${userId}-${friendId}`;

export const addFriendId = (userId: string): string => `add-friend-${userId}`;

export const placeAfterRemoval = (userId: string, friends: readonly User[], at: number): string =>
  maybe(friends[at]).or(() => maybe(friends[at - 1]))
    .map(next => removeButtonId(userId, next.id))
    .orElse(addFriendId(userId));
