export type Address = {
  streetAddress: string;
  streetAddressTwo?: string;
  city: string;
  state: string;
  zip: string;
};

export type Person = {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: Date;
};

export type NewUser = {
  person: Person;
  friends: string[];
  homeAddress: Address;
  avatar: string;
  work?: 'home' | Address;
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
  fullName: ({person}) => `${person.firstName} ${person.lastName}`,
  befriended: (user, friendId) => ({...user, friends: [...user.friends, friendId]}),
  unfriended: (user, friendId) => ({...user, friends: user.friends.filter(id => id !== friendId)})
};
