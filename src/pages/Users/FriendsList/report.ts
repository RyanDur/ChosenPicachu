import {profile, User} from '../profile';

export type Membership =
  | {readonly change: 'added'; readonly friend: User}
  | {readonly change: 'removed'; readonly friend: User; readonly at: number};

type Memberships = {
  told: (membership: Membership) => string;
  arrived: (friendIds: readonly string[], membership: Membership) => boolean;
};

export const memberships: Memberships = {
  told: ({change, friend}) => `${profile.fullName(friend)} ${change}.`,
  arrived: (friendIds, {change, friend}) =>
    change === 'removed' ? !friendIds.includes(friend.id) : friendIds.includes(friend.id)
};
