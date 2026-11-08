export type AddressInfo = {
  streetAddress: string;
  streetAddressTwo?: string;
  city: string;
  state: string;
  zip: string;
};

export type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  dob?: Date;
};

export type NewUser = {
  info: UserInfo;
  friends: string[];
  homeAddress: AddressInfo;
  avatar: string;
  work?: 'home' | AddressInfo;
  details?: string;
};

export type User = {
  id: string;
} & NewUser;

export type UserEdit = Omit<User, 'friends'>;

type Profile = {
  fullName: (user: NewUser) => string;
  befriended: (user: User, friendId: string) => User;
  unfriended: (user: User, friendId: string) => User;
};

export const profile: Profile = {
  fullName: ({info}) => `${info.firstName} ${info.lastName}`,
  befriended: (user, friendId) => ({...user, friends: [...user.friends, friendId]}),
  unfriended: (user, friendId) => ({...user, friends: user.friends.filter(id => id !== friendId)})
};
