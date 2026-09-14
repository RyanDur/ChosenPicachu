import {fullNameOf, User} from '@components/Users/UserInfo/user';

export type Membership =
  | {readonly change: 'added'; readonly friend: User}
  | {readonly change: 'removed'; readonly friend: User; readonly at: number};

export const friendsReport = ({change, friend}: Membership): string => `${fullNameOf(friend)} ${change}.`;

export const arrived = (friendIds: readonly string[], {change, friend}: Membership): boolean =>
  change === 'removed' ? !friendIds.includes(friend.id) : friendIds.includes(friend.id);
