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

export const fullNameOf = ({info}: NewUser): string => `${info.firstName} ${info.lastName}`;
