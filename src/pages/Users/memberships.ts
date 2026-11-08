import {not} from '@ryandur/sand';
export type Membership = {
  readonly change: 'added' | 'removed';
  readonly friendId: string;
};

type Memberships = {
  told: (friendName: string, membership: Membership) => string;
  reached: (friendIds: readonly string[], membership: Membership) => boolean;
};

export const memberships: Memberships = {
  told: (friendName, {change}) => `${friendName} ${change}.`,
  reached: (friendIds, {change, friendId}) =>
    change === 'removed' ? not(friendIds.includes(friendId)) : friendIds.includes(friendId)
};
