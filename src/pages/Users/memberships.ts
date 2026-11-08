export type Membership = {
  readonly change: 'added' | 'removed';
  readonly friendId: string;
};

type Memberships = {
  told: (friendName: string, membership: Membership) => string;
  arrived: (friendIds: readonly string[], membership: Membership) => boolean;
};

export const memberships: Memberships = {
  told: (friendName, {change}) => `${friendName} ${change}.`,
  arrived: (friendIds, {change, friendId}) =>
    change === 'removed' ? !friendIds.includes(friendId) : friendIds.includes(friendId)
};
